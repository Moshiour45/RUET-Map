// ============================================================
//  RUET CAMPUS MAP — Pathfinder Module (A* Search)
//  Calculates shortest paths using A* with haversine heuristic,
//  edge-projection snapping, and dynamic virtual node injection.
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

  // ── Edge-Projection: Project point P onto segment AB ──
  // Returns { lat, lng, t } where t ∈ [0, 1] is the fractional position
  // along segment AB, and (lat, lng) is the closest point ON the segment.
  function projectPointOnSegment(pLat, pLng, aLat, aLng, bLat, bLng) {
    // Vector AB
    const abLat = bLat - aLat;
    const abLng = bLng - aLng;

    // Vector AP
    const apLat = pLat - aLat;
    const apLng = pLng - aLng;

    // Dot products
    const abDotAb = abLat * abLat + abLng * abLng;

    // Degenerate edge (A == B)
    if (abDotAb < 1e-18) {
      return { lat: aLat, lng: aLng, t: 0 };
    }

    const apDotAb = apLat * abLat + apLng * abLng;

    // Parametric position clamped to [0, 1]
    let t = apDotAb / abDotAb;
    t = Math.max(0, Math.min(1, t));

    // Interpolate to get the projected point
    const projLat = aLat + t * abLat;
    const projLng = aLng + t * abLng;

    return { lat: projLat, lng: projLng, t };
  }

  // ── Find nearest road edge projection for an arbitrary [lat, lng] ──
  // Iterates all ROAD_EDGES, projects the point onto each segment line,
  // and returns the closest match with full context for virtual node creation.
  //
  // Returns: {
  //   projLat, projLng,       — snapped coordinate ON the edge
  //   nodeA, nodeB,           — endpoint IDs of the matched edge
  //   t,                      — fractional position along edge (0 = at A, 1 = at B)
  //   distance,               — perpendicular distance from point to edge (meters)
  //   edgeIndex,              — index into ROAD_EDGES array
  //   attrs                   — edge attributes (drive/bike/walk flags)
  // }
  function findNearestEdgeProjection(lat, lng, roadNodes, roadEdges) {
    let best = null;
    let bestDist = Infinity;

    for (let i = 0; i < roadEdges.length; i++) {
      const [uId, vId, attrs] = roadEdges[i];
      const nodeU = roadNodes[uId];
      const nodeV = roadNodes[vId];
      if (!nodeU || !nodeV) continue;

      const proj = projectPointOnSegment(lat, lng, nodeU.lat, nodeU.lng, nodeV.lat, nodeV.lng);
      const dist = haversine(lat, lng, proj.lat, proj.lng);

      if (dist < bestDist) {
        bestDist = dist;
        best = {
          projLat: proj.lat,
          projLng: proj.lng,
          nodeA: uId,
          nodeB: vId,
          t: proj.t,
          distance: dist,
          edgeIndex: i,
          attrs: attrs || {}
        };
      }
    }

    return best;
  }

  // ── MinHeap for efficient A* ──
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

  // ── Inject a virtual node into a shallow-cloned graph ──
  // Splits the nearest road edge at the projected point, creating proportional sub-segments.
  // Returns { augmentedGraph, virtualId, projLat, projLng }
  function injectVirtualNode(graph, virtualId, lat, lng, roadNodes, roadEdges) {
    const proj = findNearestEdgeProjection(lat, lng, roadNodes, roadEdges);
    if (!proj) return null;

    // Shallow-clone adjacency lists only for affected nodes (nodeA, nodeB)
    const augGraph = Object.create(graph);

    // Clone nodeA
    const nodeA = graph[proj.nodeA];
    if (nodeA) {
      augGraph[proj.nodeA] = {
        ...nodeA,
        edges: [...nodeA.edges]
      };
    }

    // Clone nodeB
    const nodeB = graph[proj.nodeB];
    if (nodeB) {
      augGraph[proj.nodeB] = {
        ...nodeB,
        edges: [...nodeB.edges]
      };
    }

    // Calculate the full edge weight between A and B
    const fullWeight = haversine(nodeA.lat, nodeA.lng, nodeB.lat, nodeB.lng);

    // Edge attributes from the matched edge
    const edgeAttrs = roadEdges[proj.edgeIndex][2] || {};
    const isDrivable = edgeAttrs.drive === true;
    const isBikeable = edgeAttrs.bike !== false;
    const isWalkable = edgeAttrs.walk !== false;

    // Sub-segment weights proportional to t
    const weightToA = fullWeight * proj.t;
    const weightToB = fullWeight * (1 - proj.t);

    // Create the virtual node
    augGraph[virtualId] = {
      id: virtualId,
      lat: proj.projLat,
      lng: proj.projLng,
      name: `Virtual (${proj.projLat.toFixed(5)}, ${proj.projLng.toFixed(5)})`,
      isBuilding: false,
      isVirtual: true,
      edges: [
        { to: proj.nodeA, weight: weightToA, drive: isDrivable, bike: isBikeable, walk: isWalkable },
        { to: proj.nodeB, weight: weightToB, drive: isDrivable, bike: isBikeable, walk: isWalkable }
      ]
    };

    // Connect nodeA → virtual and nodeB → virtual
    augGraph[proj.nodeA].edges.push({ to: virtualId, weight: weightToA, drive: isDrivable, bike: isBikeable, walk: isWalkable });
    augGraph[proj.nodeB].edges.push({ to: virtualId, weight: weightToB, drive: isDrivable, bike: isBikeable, walk: isWalkable });

    return {
      augmentedGraph: augGraph,
      virtualId,
      projLat: proj.projLat,
      projLng: proj.projLng
    };
  }

  // ── A* Shortest Path Algorithm ──
  // Accepts either string node IDs or [lat, lng] arrays for origin/destination.
  // When [lat, lng] is provided, dynamically injects virtual nodes via edge-projection.
  function findShortestPath(graph, startInput, endInput, transitMode = 'walk') {
    const roadNodes = window.RuetData.ROAD_NODES;
    const roadEdges = window.RuetData.ROAD_EDGES;

    let workingGraph = graph;
    let startId, endId;
    let virtualNodes = []; // track injected virtuals for cleanup

    // ── Resolve start input ──
    if (Array.isArray(startInput)) {
      // [lat, lng] coordinate — inject virtual start node
      const result = injectVirtualNode(workingGraph, 'v_start', startInput[0], startInput[1], roadNodes, roadEdges);
      if (!result) return null;
      workingGraph = result.augmentedGraph;
      startId = 'v_start';
      virtualNodes.push('v_start');
    } else {
      startId = startInput;
    }

    // ── Resolve end input ──
    if (Array.isArray(endInput)) {
      // [lat, lng] coordinate — inject virtual end node
      const result = injectVirtualNode(workingGraph, 'v_end', endInput[0], endInput[1], roadNodes, roadEdges);
      if (!result) return null;
      workingGraph = result.augmentedGraph;
      endId = 'v_end';
      virtualNodes.push('v_end');
    } else {
      endId = endInput;
    }

    if (!workingGraph[startId] || !workingGraph[endId]) return null;

    // ── Destination coordinates for heuristic h(n) ──
    const destLat = workingGraph[endId].lat;
    const destLng = workingGraph[endId].lng;

    const distances = {};
    const previous = {};
    const pq = new MinHeap();

    // Init — only set start node, others default to Infinity via lookup
    distances[startId] = 0;
    const hStart = haversine(workingGraph[startId].lat, workingGraph[startId].lng, destLat, destLng);
    pq.push({ id: startId, priority: hStart }); // f(start) = 0 + h(start)

    while (!pq.isEmpty()) {
      const { id: currentId } = pq.pop();

      if (currentId === endId) break; // Found shortest path

      const gCurrent = distances[currentId];
      if (gCurrent === undefined) continue; // stale entry

      const node = workingGraph[currentId];
      if (!node) continue;

      // Do not allow transiting through buildings (buildings are start/end only)
      if (node.isBuilding && currentId !== startId && currentId !== endId) continue;

      for (const edge of node.edges) {
        const neighborId = edge.to;

        // Skip edges that do not allow the current transit mode
        if (transitMode === 'drive' && !edge.drive) continue;
        if (transitMode === 'bike' && !edge.bike) continue;
        if (transitMode === 'walk' && !edge.walk) continue;

        const newDist = gCurrent + edge.weight;
        const prevDist = distances[neighborId];

        if (prevDist === undefined || newDist < prevDist) {
          distances[neighborId] = newDist;
          previous[neighborId] = currentId;

          // A* priority: f(n) = g(n) + h(n)
          const neighborNode = workingGraph[neighborId];
          const h = neighborNode
            ? haversine(neighborNode.lat, neighborNode.lng, destLat, destLng)
            : 0;
          pq.push({ id: neighborId, priority: newDist + h });
        }
      }
    }

    // Reconstruct path
    if (distances[endId] === undefined || distances[endId] === Infinity) return null;

    const path = [];
    let current = endId;
    while (current !== null && current !== undefined) {
      path.unshift(current);
      current = previous[current];
    }

    // Gather coordinates
    const coordinates = path.map(nodeId => [workingGraph[nodeId].lat, workingGraph[nodeId].lng]);

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

    // Resolve names — virtual nodes get a generic label
    const startNode = graph[nodeIds[0]];
    const endNode = graph[nodeIds[nodeIds.length - 1]];
    const startName = startNode ? (startNode.name || 'Starting Point') : 'Starting Point';
    const endName = endNode ? (endNode.name || 'Destination') : 'Destination';

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
      const nextNode = graph[nextId];
      const isIntersection = nextNode && !nextNode.isBuilding && nextNode.edges && nextNode.edges.length > 2;

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
          const nextNodeName = (nextNode && nextNode.isBuilding) ? nextNode.name : `road intersection ${nextId}`;
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

    // Run A* again on penalized graph
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
    generateDirections,
    projectPointOnSegment,
    findNearestEdgeProjection
  };
})();
