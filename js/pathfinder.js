// ============================================================
//  RUET CAMPUS MAP — Pathfinder Module (Dijkstra)
//  Calculates shortest paths & generates turn-by-turn directions.
// ============================================================
(function () {
  'use strict';

  // ── Haversine Distance Formula (in meters) ──
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in meters
  }

  // ── MinHeap for efficient Dijkstra ──
  class MinHeap {
    constructor() {
      this.heap = [];
    }
    push(element) {
      this.heap.push(element);
      this.bubbleUp(this.heap.length - 1);
    }
    pop() {
      if (this.heap.length === 0) return null;
      const min = this.heap[0];
      const end = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = end;
        this.sinkDown(0);
      }
      return min;
    }
    isEmpty() {
      return this.heap.length === 0;
    }
    bubbleUp(index) {
      const element = this.heap[index];
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];
        if (element.priority >= parent.priority) break;
        this.heap[index] = parent;
        index = parentIndex;
      }
      this.heap[index] = element;
    }
    sinkDown(index) {
      const length = this.heap.length;
      const element = this.heap[index];
      while (true) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let leftChild, rightChild;
        let swap = null;

        if (leftChildIndex < length) {
          leftChild = this.heap[leftChildIndex];
          if (leftChild.priority < element.priority) {
            swap = leftChildIndex;
          }
        }

        if (rightChildIndex < length) {
          rightChild = this.heap[rightChildIndex];
          if (
            (swap === null && rightChild.priority < element.priority) ||
            (swap !== null && rightChild.priority < leftChild.priority)
          ) {
            swap = rightChildIndex;
          }
        }

        if (swap === null) break;
        this.heap[index] = this.heap[swap];
        index = swap;
      }
      this.heap[index] = element;
    }
  }

  // ── Build routing graph ──
  // Constructs an adjacency list from the road network & building definitions.
  function buildGraph(data) {
    const graph = {};

    // 1. Add all road nodes
    for (const [id, coords] of Object.entries(data.ROAD_NODES)) {
      graph[id] = {
        id,
        lat: coords.lat,
        lng: coords.lng,
        isBuilding: false,
        edges: []
      };
    }

    // 2. Add all buildings as nodes in the routing graph
    data.BUILDINGS.forEach(b => {
      graph[b.id] = {
        id: b.id,
        lat: b.latlng[0],
        lng: b.latlng[1],
        name: b.name,
        isBuilding: true,
        edges: []
      };
    });

    // 3. Add road edges
    data.ROAD_EDGES.forEach(([u, v, attrs]) => {
      if (graph[u] && graph[v]) {
        const dist = haversine(graph[u].lat, graph[u].lng, graph[v].lat, graph[v].lng);
        const isDrivable = attrs && attrs.drive === true;
        const isBikeable = attrs ? attrs.bike !== false : true;
        const isWalkable = attrs ? attrs.walk !== false : true;

        graph[u].edges.push({ to: v, weight: dist, drive: isDrivable, bike: isBikeable, walk: isWalkable });
        graph[v].edges.push({ to: u, weight: dist, drive: isDrivable, bike: isBikeable, walk: isWalkable });
      }
    });

    // 4. Connect buildings to their nearest road nodes
    for (const [bId, connectedRoads] of Object.entries(data.BUILDING_CONNECTIONS)) {
      if (!graph[bId]) continue;
      connectedRoads.forEach(rId => {
        if (!graph[rId]) return;
        const dist = haversine(graph[bId].lat, graph[bId].lng, graph[rId].lat, graph[rId].lng);
        // Connect bidirectionally
        graph[bId].edges.push({ to: rId, weight: dist, drive: true, bike: true, walk: true });
        graph[rId].edges.push({ to: bId, weight: dist, drive: true, bike: true, walk: true });
      });
    }

    return graph;
  }

  // ── Dijkstra's Shortest Path Algorithm ──
  function findShortestPath(graph, startId, endId, transitMode = 'walk') {
    if (!graph[startId] || !graph[endId]) return null;

    const distances = {};
    const previous = {};
    const pq = new MinHeap();

    // Init
    for (const nodeId of Object.keys(graph)) {
      distances[nodeId] = Infinity;
      previous[nodeId] = null;
    }
    distances[startId] = 0;
    pq.push({ id: startId, priority: 0 });

    while (!pq.isEmpty()) {
      const { id: currentId, priority: currentDist } = pq.pop();

      if (currentId === endId) break; // Found shortest path
      if (currentDist > distances[currentId]) continue;

      const node = graph[currentId];
      if (!node) continue;

      // Do not allow transiting through buildings (buildings are start/end only)
      if (node.isBuilding && currentId !== startId && currentId !== endId) continue;

      for (const edge of node.edges) {
        const neighborId = edge.to;

        // Skip edges that do not allow the current transit mode
        if (transitMode === 'drive' && !edge.drive) continue;
        if (transitMode === 'bike' && !edge.bike) continue;
        if (transitMode === 'walk' && !edge.walk) continue;

        const newDist = currentDist + edge.weight;

        if (newDist < distances[neighborId]) {
          distances[neighborId] = newDist;
          previous[neighborId] = currentId;
          pq.push({ id: neighborId, priority: newDist });
        }
      }
    }

    // Reconstruct path
    if (distances[endId] === Infinity) return null;

    const path = [];
    let current = endId;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    // Gather coordinates
    const coordinates = path.map(nodeId => [graph[nodeId].lat, graph[nodeId].lng]);

    // Dynamic travel velocity logic
    let speed = 1.33; // Walk speed (~1.33 m/s)
    if (transitMode === 'bike') speed = 4.17;  // Cycling speed (~15 km/h or 4.17 m/s)
    if (transitMode === 'drive') speed = 8.33; // Campus speed limit (~30 km/h or 8.33 m/s)

    return {
      nodeIds: path,
      coordinates,
      distance: distances[endId], // in meters
      walkTime: Math.round(distances[endId] / speed) // duration in seconds
    };
  }

  // ── Direction Calculator ──
  function getCompassDirection(fromCoords, toCoords) {
    const dLat = toCoords[0] - fromCoords[0];
    const dLng = toCoords[1] - fromCoords[1];
    const angle = (Math.atan2(dLng, dLat) * 180) / Math.PI;
    const normalizedAngle = (angle + 360) % 360;

    if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return 'North';
    if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return 'Northeast';
    if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return 'East';
    if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return 'Southeast';
    if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return 'South';
    if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return 'Southwest';
    if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return 'West';
    if (normalizedAngle >= 292.5 && normalizedAngle < 337.5) return 'Northwest';
    return 'forward';
  }

  // ── Generate Step-by-Step Directions ──
  function generateDirections(graph, pathResult) {
    const steps = [];
    const { nodeIds, coordinates } = pathResult;

    if (nodeIds.length < 2) return [{ type: 'arrive', text: 'You are already at your destination.', distance: 0, lat: coordinates[0] ? coordinates[0][0] : 0, lng: coordinates[0] ? coordinates[0][1] : 0 }];

    const startName = graph[nodeIds[0]].name || 'Starting Point';
    const endName = graph[nodeIds[nodeIds.length - 1]].name || 'Destination';

    steps.push({
      type: 'start',
      text: `Start your journey at **${startName}**.`,
      distance: 0,
      lat: coordinates[0][0],
      lng: coordinates[0][1]
    });

    let currentSegmentDist = 0;
    let lastDirection = '';

    for (let i = 0; i < nodeIds.length - 1; i++) {
      const currId = nodeIds[i];
      const nextId = nodeIds[i + 1];
      const currCoords = coordinates[i];
      const nextCoords = coordinates[i + 1];

      const segmentDist = haversine(currCoords[0], currCoords[1], nextCoords[0], nextCoords[1]);
      currentSegmentDist += segmentDist;

      const direction = getCompassDirection(currCoords, nextCoords);

      // Check if direction changed or it's the final node or it's a major intersection
      const isLast = i === nodeIds.length - 2;
      const isIntersection = !graph[nextId].isBuilding && graph[nextId].edges.length > 2;

      if (isLast) {
        steps.push({
          type: 'turn',
          text: `Head **${direction}** for about **${Math.round(currentSegmentDist)} meters** towards **${endName}**.`,
          distance: currentSegmentDist,
          lat: nextCoords[0],
          lng: nextCoords[1]
        });
      } else if (isIntersection || direction !== lastDirection) {
        if (i > 0) {
          const nextNodeName = graph[nextId].isBuilding ? graph[nextId].name : `road intersection ${nextId}`;
          steps.push({
            type: 'turn',
            text: `Walk **${direction}** for **${Math.round(currentSegmentDist)} meters** to the ${nextNodeName.includes('intersection') ? 'intersection' : nextNodeName}.`,
            distance: currentSegmentDist,
            lat: nextCoords[0],
            lng: nextCoords[1]
          });
          currentSegmentDist = 0;
        }
        lastDirection = direction;
      }
    }

    steps.push({
      type: 'arrive',
      text: `Arrive at **${endName}** on your ${lastDirection ? 'right' : 'path'}.`,
      distance: 0,
      lat: coordinates[coordinates.length - 1][0],
      lng: coordinates[coordinates.length - 1][1]
    });

    return steps;
  }

  // Yen's Algorithm / Edge-Elimination Alternative Route Finder
  function findAlternativePath(graph, startId, endId, primaryPathNodeIds, transitMode = 'walk') {
    if (!graph[startId] || !graph[endId] || !primaryPathNodeIds || primaryPathNodeIds.length < 3) return null;

    // Temporarily penalize/eliminate some of the primary path edges
    const edgesToRestore = [];
    const startIndex = Math.floor(primaryPathNodeIds.length * 0.2);
    const endIndex = Math.ceil(primaryPathNodeIds.length * 0.8);

    for (let i = startIndex; i < endIndex - 1; i++) {
      const u = primaryPathNodeIds[i];
      const v = primaryPathNodeIds[i + 1];

      // Penalize in graph
      if (graph[u]) {
        graph[u].edges.forEach(edge => {
          if (edge.to === v) {
            edgesToRestore.push({ fromNode: u, toNode: v, originalWeight: edge.weight, edgeRef: edge });
            edge.weight *= 2.5; // Penalize heavily to push it to find another path
          }
        });
      }
      if (graph[v]) {
        graph[v].edges.forEach(edge => {
          if (edge.to === u) {
            edgesToRestore.push({ fromNode: v, toNode: u, originalWeight: edge.weight, edgeRef: edge });
            edge.weight *= 2.5;
          }
        });
      }
    }

    // Run Dijkstra again on penalized graph
    const alternativeResult = findShortestPath(graph, startId, endId, transitMode);

    // Restore original weights
    edgesToRestore.forEach(item => {
      item.edgeRef.weight = item.originalWeight;
    });

    // Verify alternative result is actually different
    if (alternativeResult && alternativeResult.distance > 0) {
      // Ensure it's not identical to primary
      if (Math.abs(alternativeResult.distance - graph[endId].lat) > 0.0001) {
        return alternativeResult;
      }
    }

    return null;
  }

  // Expose to global scope
  window.RuetPathfinder = {
    buildGraph,
    findShortestPath,
    findAlternativePath,
    haversine,
    generateDirections
  };
})();
