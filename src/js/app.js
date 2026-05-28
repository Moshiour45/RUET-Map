// ============================================================
//  RUET CAMPUS MAP — Main Application Module
//  Manages Leaflet Map, Google Maps tile layers, corrected
//  Dijkstra navigation routing, modern side HUD, and voice directions.
// ============================================================
(function () {
  'use strict';

  // Check dependencies
  if (!window.RuetData || !window.RuetPathfinder) {
    console.error('RUET Map: Data or Pathfinder modules are missing!');
    return;
  }

  const { BUILDINGS, CAT_COLORS, CAMPUS_CENTER } = window.RuetData;
  const { buildGraph, findShortestPath, generateDirections } = window.RuetPathfinder;

  // Build the static routing graph
  const routingGraph = buildGraph(window.RuetData);

  // ============================================================
  //  MAP INITIALIZATION (Google Maps Tiles in Leaflet)
  // ============================================================
  const osmLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  });

  const satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  });

  // Strict geographical boundaries locking map viewport strictly to RUET Campus
  const campusBounds = L.latLngBounds(
    [24.3615, 88.6235], // Southwest corner
    [24.3740, 88.6375]  // Northeast corner
  );

  const map = L.map('map', {
    center: CAMPUS_CENTER,
    zoom: 17,
    minZoom: 16,
    maxZoom: 20,
    maxBounds: campusBounds,
    maxBoundsViscosity: 1.0,
    layers: [osmLayer],
    zoomControl: false // Hide Leaflet standard zoom controls to use our unified controls stack
  });

  // Satellite view toggle layer binder
  let isSatellite = false;
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      if (isSatellite) {
        map.removeLayer(satelliteLayer);
        map.addLayer(osmLayer);
        this.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Cyberpunk`;
        this.title = "Toggle Satellite View";
      } else {
        map.removeLayer(osmLayer);
        map.addLayer(satelliteLayer);
        this.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Street`;
        this.title = "Toggle Street View";
      }
      isSatellite = !isSatellite;
    });
  }

  // Draw campus bounds (dashed green boundary line)
  L.polygon([
    [24.3740, 88.6235],
    [24.3740, 88.6375],
    [24.3615, 88.6375],
    [24.3615, 88.6235]
  ], {
    color: '#10b981',
    weight: 2.2,
    dashArray: '10, 6',
    fillColor: '#10b981',
    fillOpacity: 0.015,
    interactive: false
  }).addTo(map);

  // Draw permanent background road network outlines (beautiful glowing centerlines)
  const roadNetworkGroup = L.layerGroup().addTo(map);
  window.RuetData.ROAD_EDGES.forEach(([u, v]) => {
    const nodeU = window.RuetData.ROAD_NODES[u];
    const nodeV = window.RuetData.ROAD_NODES[v];
    if (nodeU && nodeV) {
      L.polyline([[nodeU.lat, nodeU.lng], [nodeV.lat, nodeV.lng]], {
        color: '#10b981',
        weight: 3.5,
        opacity: 0.16,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false
      }).addTo(roadNetworkGroup);
    }
  });

  // Highway indicator label overlay
  L.marker([24.36200, 88.63000], {
    icon: L.divIcon({
      className: '',
      html: '<div style="white-space:nowrap;font-family:Inter,sans-serif;font-size:10px;font-weight:700;color:#64748b;letter-spacing:2px;text-shadow:0 1px 3px rgba(0,0,0,0.8);">━ RAJSHAHI — NATORE — DHAKA HIGHWAY ━</div>',
      iconAnchor: [180, 10]
    }),
    interactive: false
  }).addTo(map);

  // ============================================================
  //  BUILDING MARKERS RENDERING (Elegant Custom DivIcons)
  // ============================================================
  const markerLayers = {};
  const allMarkerGroup = L.layerGroup().addTo(map);

  function createMarkerIcon(category, isActive = true) {
    const colors = CAT_COLORS[category];
    const fill = colors.fill;
    const opacityClass = isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40';

    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8 transition-all duration-300 transform ${opacityClass}">
          <!-- pulse halo behind active structures -->
          ${isActive ? `<div class="absolute inset-0 rounded-full animate-ping opacity-25" style="background-color: ${fill}"></div>` : ''}
          <!-- circular boundary card -->
          <div class="w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300" 
               style="background-color: rgba(17, 24, 37, 0.85); border-color: ${fill};">
            <div class="w-2.5 h-2.5 rounded-full" style="background-color: ${fill};"></div>
          </div>
        </div>
      `,
      iconAnchor: [16, 16],
      iconSize: [32, 32]
    });
  }

  // Draw building markers dynamically on Leaflet map
  BUILDINGS.forEach(b => {
    const cat = CAT_COLORS[b.category];

    const marker = L.marker(b.latlng, {
      icon: createMarkerIcon(b.category),
      riseOnHover: true
    });

    marker.bindTooltip(b.name, {
      direction: 'top',
      offset: [0, -10],
      className: 'leaflet-tooltip'
    });

    const popupHTML = `
      <div style="padding:16px 18px;min-width:240px;">
        <div style="font-size:15px;font-weight:700;color:#f1f5f9;margin-bottom:4px;">${b.name}</div>
        <div style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:6px;background:${cat.fill}22;color:${cat.fill};font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">
          <span style="width:6px;height:6px;border-radius:50%;background:${cat.fill};"></span>
          ${cat.label}
        </div>
        <p style="color:#94a3b8;font-size:12.5px;line-height:1.65;margin:0;">${b.desc}</p>
        <div style="margin-top:12px;padding:10px 12px;background:rgba(26,34,53,0.6);border-radius:8px;border:1px solid rgba(42,58,82,0.4);">
          <span style="font-size:11px;color:#64748b;">📍 RUET Campus, Kazla, Rajshahi-6204</span>
        </div>
      </div>
    `;
    marker.bindPopup(popupHTML, { maxWidth: 320 });

    marker.on('click', () => {
      openSidePanel(b);
    });

    marker.addTo(allMarkerGroup);
    markerLayers[b.id] = { marker, data: b };
  });

  // Dynamic Building text labels visible at higher zoom levels
  const labelGroup = L.layerGroup().addTo(map);

  function updateLabels() {
    labelGroup.clearLayers();
    const zoom = map.getZoom();
    if (zoom < 17) return;

    const fontSize = zoom >= 19 ? 11 : zoom >= 18 ? 10 : 8;

    BUILDINGS.forEach(b => {
      let shortName = b.name
        .replace('Shahid Lt. ', '')
        .replace('Shahid Abdul ', '')
        .replace('Shahid Sahidul ', '')
        .replace('Shahid President Ziaur ', '')
        .replace(' Building', '')
        .replace('Central ', '')
        .replace('Campus ', '')
        .replace(" & Humanities", "")
        .replace("Applied Science", "App. Sci.");

      if (zoom < 18) {
        shortName = shortName
          .replace('Mechanical Engineering', 'ME')
          .replace('Civil Engineering', 'CE')
          .replace('Chemical Engineering', 'ChE');
      }

      const marker = L.marker(b.latlng, {
        icon: L.divIcon({
          className: '',
          html: `<div style="white-space:nowrap;font-family:Inter,sans-serif;font-size:${fontSize}px;font-weight:600;color:#f1f5f9;text-shadow:0 0 5px #0a0f1a, 0 0 5px #0a0f1a, 0 1px 3px rgba(0,0,0,0.8);pointer-events:none;text-align:center;margin-top:14px;">${shortName}</div>`,
          iconAnchor: [50, 0],
          iconSize: [100, 16]
        }),
        interactive: false
      });
      labelGroup.addLayer(marker);
    });
  }

  map.on('zoomend', updateLabels);
  updateLabels();

  // ============================================================
  //  GLOBAL SEARCH & CENTERING FUNCTION
  // ============================================================
  const searchBox = document.getElementById('search-box');
  const searchResults = document.getElementById('search-results');

  if (searchBox && searchResults) {
    searchBox.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        searchResults.classList.add('hidden');
        return;
      }

      const matches = BUILDINGS.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.desc.toLowerCase().includes(q) ||
        (b.departments && b.departments.some(d => 
          d.code.toLowerCase().includes(q) || 
          d.full_name.toLowerCase().includes(q)
        ))
      );

      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="p-4 text-slate-500 text-sm text-center">No results found</div>';
      } else {
        searchResults.innerHTML = matches.map(b => {
          const cat = CAT_COLORS[b.category];
          const deptsBadge = b.departments ? `<div class="text-[10px] text-ruet-accent mt-0.5 font-bold tracking-wide">${b.departments.map(d => d.code).join(' · ')}</div>` : '';
          return `
            <div class="search-item flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-ruet-border/40 transition-all duration-200 hover:bg-ruet-green/15 last:border-b-0" data-id="${b.id}">
              <span class="w-2.5 h-2.5 rounded shrink-0" style="background:${cat.fill}"></span>
              <div>
                <div class="text-[13px] font-medium text-slate-200">${b.name}</div>
                <div class="text-[11px] text-slate-500">${cat.label}</div>
                ${deptsBadge}
              </div>
            </div>`;
        }).join('');
      }
      searchResults.classList.remove('hidden');
    });

    searchResults.addEventListener('click', (e) => {
      const item = e.target.closest('.search-item');
      if (!item) return;
      const id = item.dataset.id;
      focusBuilding(id);
      searchResults.classList.add('hidden');
      searchBox.value = '';
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#search-box') && !e.target.closest('#search-results')) {
        searchResults.classList.add('hidden');
      }
    });
  }

  function focusBuilding(id) {
    const entry = markerLayers[id];
    if (!entry) return;
    const { marker, data } = entry;

    map.setView(data.latlng, 19);
    marker.openPopup();
    openSidePanel(data);
  }

  window.focusBuilding = focusBuilding;

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchBox) {
      e.preventDefault();
      searchBox.focus();
    }
    if (e.key === 'Escape') {
      if (searchResults) searchResults.classList.add('hidden');
      if (searchBox) searchBox.blur();
      closeSidePanel();
      closeRouteAutocomplete();
    }
  });

  // ============================================================
  //  SIDE DETAILS PANEL
  // ============================================================
  const sidePanel = document.getElementById('side-panel');
  const panelTitle = document.getElementById('panel-title');
  const panelContent = document.getElementById('panel-content');
  const closePanelBtn = document.getElementById('close-panel');

  function openSidePanel(b) {
    const cat = CAT_COLORS[b.category];
    panelTitle.textContent = b.name;
    panelContent.innerHTML = `
      <div class="mb-5">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider" style="background:${cat.fill}18;color:${cat.fill};">
          <span class="w-2 h-2 rounded-full" style="background:${cat.fill};"></span>
          ${cat.label}
        </span>
      </div>
      <p class="text-slate-400 text-sm leading-7 mb-5">${b.desc}</p>
      
      <!-- Departments housed list -->
      ${b.departments ? `
        <div class="p-4 bg-ruet-card/85 rounded-xl border border-ruet-border/40 mb-4 shadow-sm">
          <div class="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" class="shrink-0"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span class="text-xs text-slate-400 font-bold uppercase tracking-wider">Housed Departments</span>
          </div>
          <div class="space-y-2.5">
            ${b.departments.map(d => `
              <div class="flex items-center gap-2.5">
                <span class="px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[10px] font-bold uppercase tracking-wider shrink-0">${d.code}</span>
                <span class="text-[11.5px] text-slate-300 font-medium leading-normal">${d.full_name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="p-4 bg-ruet-card/80 rounded-xl border border-ruet-border/40 mb-4">
        <div class="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span class="text-xs text-slate-500">Location</span>
        </div>
        <p class="text-[13px] text-slate-200">RUET Campus, Kazla, Rajshahi-6204</p>
      </div>
      <div class="p-4 bg-ruet-card/80 rounded-xl border border-ruet-border/40 mb-5">
        <div class="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="text-xs text-slate-500">University</span>
        </div>
        <p class="text-[13px] text-slate-200">Rajshahi University of Engineering & Technology</p>
      </div>
      <div class="flex gap-2.5">
        <button onclick="focusBuilding('${b.id}')" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-ruet-green to-ruet-green-light border border-ruet-accent/30 text-white text-sm font-semibold cursor-pointer font-sans transition-all duration-300 flex items-center justify-center gap-2 hover:brightness-110">
          🎯 Focus Map
        </button>
        <button onclick="window.RuetApp.setRoutingDestination('${b.id}')" class="flex-1 py-3 rounded-xl bg-ruet-card border border-ruet-border/60 text-ruet-accent text-sm font-semibold cursor-pointer font-sans transition-all duration-300 flex items-center justify-center gap-2 hover:border-ruet-accent hover:bg-ruet-green/10">
          🚀 Directions
        </button>
      </div>
    `;
    sidePanel.style.right = '0px';
  }

  function closeSidePanel() {
    if (sidePanel) sidePanel.style.right = '-420px';
  }

  if (closePanelBtn) {
    closePanelBtn.addEventListener('click', closeSidePanel);
  }

  // ============================================================
  //  CATEGORY FILTERS (SHOW/HIDE MARKERS)
  // ============================================================
  let activeCategory = 'all';

  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.cat-pill').forEach(p => {
        p.classList.remove('border-ruet-accent', 'text-ruet-accent', 'bg-ruet-green/20');
        p.classList.add('border-ruet-border/60', 'text-slate-400');
      });
      this.classList.remove('border-ruet-border/60', 'text-slate-400');
      this.classList.add('border-ruet-accent', 'text-ruet-accent', 'bg-ruet-green/20');

      activeCategory = this.dataset.cat;

      Object.values(markerLayers).forEach(({ marker, data }) => {
        if (activeCategory === 'all' || data.category === activeCategory) {
          marker.setIcon(createMarkerIcon(data.category, true));
          if (!map.hasLayer(marker)) marker.addTo(allMarkerGroup);
        } else {
          marker.setIcon(createMarkerIcon(data.category, false));
        }
      });
    });
  });

  const allCatPill = document.querySelector('.cat-pill[data-cat="all"]');
  if (allCatPill) {
    allCatPill.classList.add('border-ruet-accent', 'text-ruet-accent', 'bg-ruet-green/20');
  }

  // ============================================================
  //  MAP LEGEND
  // ============================================================
  const legendBtn = document.getElementById('legend-btn');
  if (legendBtn) {
    legendBtn.addEventListener('click', () => {
      panelTitle.textContent = 'Map Legend';
      panelContent.innerHTML = `
        <p class="text-sm text-slate-400 mb-5">Color codes for building types and campus infrastructure.</p>
        ${Object.entries(CAT_COLORS).map(([key, val]) => `
          <div class="flex items-center gap-3 py-2.5">
            <div class="w-4 h-4 rounded shrink-0 flex items-center justify-center border" style="background-color:rgba(17,24,37,0.85); border-color:${val.fill};">
              <div class="w-2 h-2 rounded-full" style="background-color:${val.fill};"></div>
            </div>
            <span class="text-sm text-slate-200 font-medium">${val.label}</span>
          </div>
        `).join('')}
        <hr class="border-ruet-border/40 my-4"/>
        <div class="flex items-center gap-3 py-2.5">
          <div class="w-4 h-4 rounded-full bg-emerald-600/30 border border-emerald-500 shrink-0"></div>
          <span class="text-sm text-slate-200">Campus boundary (Dashed Green)</span>
        </div>
        <div class="p-4 bg-ruet-card/80 rounded-xl border border-ruet-border/40 mt-5">
          <p class="text-xs text-slate-500 leading-relaxed font-sans">
            <strong class="text-slate-400">Controls:</strong><br/>
            • Scroll to Zoom<br/>
            • Click any location dot for detailed history<br/>
            • Double-click anywhere to snap routing pins
          </p>
        </div>
      `;
      sidePanel.style.right = '0px';
    });
  }

  // ============================================================
  //  DIJKSTRA ROUTING IMPLEMENTATION
  // ============================================================
  let activeRoutePath = null;
  let activeAlternatePath = null;
  let currentTransitMode = 'walk';
  let activePrimaryResult = null;
  let activeAlternateResult = null;
  let speechMuted = false;
  let liveNavigationInterval = null;
  let speechAnnouncedSteps = new Set();
  let currentGPSLatLng = null;

  let startMarker = null;
  let endMarker = null;
  let stepPulseLayer = null;

  const routeFromInput = document.getElementById('route-from');
  const routeToInput = document.getElementById('route-to');
  const fromAutocomplete = document.getElementById('from-autocomplete');
  const toAutocomplete = document.getElementById('to-autocomplete');
  const routeSubmitBtn = document.getElementById('route-submit-btn');
  const routeClearBtn = document.getElementById('route-clear-btn');
  const routeSwapBtn = document.getElementById('route-swap-btn');
  const routeResultsPanel = document.getElementById('route-results');
  const routeToggleBtn = document.getElementById('route-toggle-btn');
  const routePanel = document.getElementById('route-panel');
  const routeCloseBtn = document.getElementById('route-close-btn');

  let selectedFromId = '';
  let selectedToId = '';

  function setRoutingDestination(destId) {
    const destBuilding = BUILDINGS.find(b => b.id === destId);
    if (!destBuilding) return;

    if (routePanel) {
      routePanel.classList.remove('-left-[380px]');
      routePanel.classList.add('left-4');
    }

    selectedToId = destId;
    if (routeToInput) {
      routeToInput.value = destBuilding.name;
    }

    if (!selectedFromId && routeFromInput) {
      const startBuilding = BUILDINGS.find(b => b.id === 'main-gate');
      if (startBuilding) {
        selectedFromId = 'main-gate';
        routeFromInput.value = startBuilding.name;
      }
    }

    closeSidePanel();
    calculateAndDrawRoute();
  }

  function setupAutocomplete(inputElement, dropdownElement, onSelect) {
    if (!inputElement || !dropdownElement) return;

    inputElement.addEventListener('focus', () => {
      renderDropdown(inputElement.value);
    });

    inputElement.addEventListener('input', (e) => {
      renderDropdown(e.target.value);
    });

    function renderDropdown(filterText) {
      const q = filterText.toLowerCase().trim();
      const filtered = BUILDINGS.filter(b => 
        b.name.toLowerCase().includes(q) || 
        CAT_COLORS[b.category].label.toLowerCase().includes(q) ||
        (b.departments && b.departments.some(d => 
          d.code.toLowerCase().includes(q) || 
          d.full_name.toLowerCase().includes(q)
        ))
      );

      let currentLocationHtml = '';
      if (navigator.geolocation && ("my current location".includes(q) || q === '')) {
        currentLocationHtml = `
          <div class="autocomplete-item flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-all duration-200 hover:bg-blue-500/10 border-b border-ruet-border/30"
               data-id="current-location" data-name="My Current Location">
             <span class="text-xs shrink-0">📍</span>
             <span class="text-xs font-bold text-blue-400 leading-tight">My Current Location</span>
          </div>
        `;
      }

      if (filtered.length === 0 && currentLocationHtml === '') {
        dropdownElement.innerHTML = '<div class="p-3 text-slate-500 text-xs text-center">No buildings found</div>';
      } else {
        const buildingsHtml = filtered.map(b => {
          const cat = CAT_COLORS[b.category];
          const deptsSuffix = b.departments ? ` <span class="text-[10px] text-ruet-accent font-semibold ml-1 shrink-0">(${b.departments.map(d => d.code).join('/')})</span>` : '';
          return `
            <div class="autocomplete-item flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-all duration-200 hover:bg-ruet-green/15 border-b border-ruet-border/30 last:border-b-0"
                 data-id="${b.id}" data-name="${b.name}">
              <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${cat.fill}"></span>
              <span class="text-xs font-medium text-slate-200 leading-tight">${b.name}${deptsSuffix}</span>
            </div>
          `;
        }).join('');

        dropdownElement.innerHTML = currentLocationHtml + buildingsHtml;
      }
      dropdownElement.classList.remove('hidden');
    }

    dropdownElement.addEventListener('click', (e) => {
      const item = e.target.closest('.autocomplete-item');
      if (!item) return;

      const id = item.dataset.id;
      const name = item.dataset.name;

      inputElement.value = name;
      dropdownElement.classList.add('hidden');
      onSelect(id);
    });
  }

  function closeRouteAutocomplete() {
    if (fromAutocomplete) fromAutocomplete.classList.add('hidden');
    if (toAutocomplete) toAutocomplete.classList.add('hidden');
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#route-from-container')) {
      if (fromAutocomplete) fromAutocomplete.classList.add('hidden');
    }
    if (!e.target.closest('#route-to-container')) {
      if (toAutocomplete) toAutocomplete.classList.add('hidden');
    }
  });

  setupAutocomplete(routeFromInput, fromAutocomplete, (id) => {
    selectedFromId = id;
  });

  setupAutocomplete(routeToInput, toAutocomplete, (id) => {
    selectedToId = id;
  });

  if (routeSwapBtn) {
    routeSwapBtn.addEventListener('click', () => {
      const tempId = selectedFromId;
      selectedFromId = selectedToId;
      selectedToId = tempId;

      const tempVal = routeFromInput.value;
      routeFromInput.value = routeToInput.value;
      routeToInput.value = tempVal;

      if (selectedFromId && selectedToId) {
        calculateAndDrawRoute();
      }
    });
  }

  // Edge-projection snapping: finds the closest point ON a road segment
  // (not just the nearest vertex node) for any arbitrary coordinate.
  function getNearestRoadProjection(latlng) {
    const proj = window.RuetPathfinder.findNearestEdgeProjection(
      latlng[0], latlng[1],
      window.RuetData.ROAD_NODES,
      window.RuetData.ROAD_EDGES
    );
    if (!proj) return null;
    return {
      projLat: proj.projLat,
      projLng: proj.projLng,
      nodeA: proj.nodeA,
      nodeB: proj.nodeB,
      t: proj.t,
      distance: proj.distance
    };
  }

  function snapDroppedLatLng(latlng, isStart) {
    let nearestBuilding = null;
    let minBuildingDist = Infinity;

    BUILDINGS.forEach(b => {
      const dist = window.RuetPathfinder.haversine(latlng.lat, latlng.lng, b.latlng[0], b.latlng[1]);
      if (dist < minBuildingDist) {
        minBuildingDist = dist;
        nearestBuilding = b;
      }
    });

    if (nearestBuilding && minBuildingDist <= 25) {
      // Close to a building — snap to building ID
      if (isStart) {
        selectedFromId = nearestBuilding.id;
        if (routeFromInput) routeFromInput.value = nearestBuilding.name;
      } else {
        selectedToId = nearestBuilding.id;
        if (routeToInput) routeToInput.value = nearestBuilding.name;
      }
    } else {
      // Not near a building — project onto nearest road segment edge
      const proj = getNearestRoadProjection([latlng.lat, latlng.lng]);
      if (proj) {
        // Store as [lat, lng] array so pathfinder creates a virtual node
        const snappedCoord = [proj.projLat, proj.projLng];
        if (isStart) {
          selectedFromId = snappedCoord;
          if (routeFromInput) routeFromInput.value = `Waypoint (${proj.projLat.toFixed(5)}, ${proj.projLng.toFixed(5)})`;
        } else {
          selectedToId = snappedCoord;
          if (routeToInput) routeToInput.value = `Waypoint (${proj.projLat.toFixed(5)}, ${proj.projLng.toFixed(5)})`;
        }
      }
    }

    calculateAndDrawRoute();
  }

  // Double click map to set route snappably
  map.on('dblclick', (e) => {
    if (!selectedFromId) {
      snapDroppedLatLng(e.latlng, true);
    } else if (!selectedToId) {
      snapDroppedLatLng(e.latlng, false);
    } else {
      selectedFromId = '';
      selectedToId = '';
      routeFromInput.value = '';
      routeToInput.value = '';
      clearRoute();
      snapDroppedLatLng(e.latlng, true);
    }
  });

  function calculateAndDrawRoute() {
    if (!selectedFromId || !selectedToId) {
      alert('Please select both starting point and destination.');
      return;
    }

    if (selectedFromId === selectedToId) {
      alert('Starting point and destination are the same building!');
      return;
    }

    const isFromCurrent = selectedFromId === 'current-location';
    const isToCurrent = selectedToId === 'current-location';

    if ((isFromCurrent || isToCurrent) && !currentGPSLatLng) {
      alert('Fetching your current location. Please verify that location services are enabled...');
      startLocationTracking(false);

      const checkGpsInterval = setInterval(() => {
        if (currentGPSLatLng) {
          clearInterval(checkGpsInterval);
          calculateAndDrawRoute();
        }
      }, 1000);
      return;
    }

    clearRoute();

    // Resolve start/end inputs — pathfinder accepts both string IDs and [lat, lng] arrays.
    // For GPS current-location or custom pin drops (stored as arrays), pass coordinates directly;
    // the pathfinder will dynamically inject virtual nodes via edge-projection.
    let startInput = isFromCurrent ? currentGPSLatLng : selectedFromId;
    let endInput = isToCurrent ? currentGPSLatLng : selectedToId;

    const result = findShortestPath(routingGraph, startInput, endInput, currentTransitMode);

    if (!result) {
      alert('No walkable routing path found for ' + currentTransitMode + ' mode between these locations.');
      return;
    }

    activePrimaryResult = result;

    // For alternative routes, pass the same inputs (pathfinder handles virtual nodes internally)
    const altStartId = isFromCurrent ? 'v_start' : (Array.isArray(selectedFromId) ? 'v_start' : selectedFromId);
    const altEndId = isToCurrent ? 'v_end' : (Array.isArray(selectedToId) ? 'v_end' : selectedToId);
    activeAlternateResult = window.RuetPathfinder.findAlternativePath(
      routingGraph, altStartId, altEndId, result.nodeIds, currentTransitMode
    );

    drawPolylines(activePrimaryResult, activeAlternateResult);

    // Resolve display info for markers
    const resolveLocation = (input, isCurrent) => {
      if (isCurrent) return { name: 'My Current Location', latlng: currentGPSLatLng };
      if (Array.isArray(input)) return { name: `Waypoint (${input[0].toFixed(5)}, ${input[1].toFixed(5)})`, latlng: input };
      const building = BUILDINGS.find(b => b.id === input);
      if (building) return { name: building.name, latlng: building.latlng };
      const roadNode = window.RuetData.ROAD_NODES[input];
      if (roadNode) return { name: input, latlng: [roadNode.lat, roadNode.lng] };
      return { name: 'Unknown', latlng: result.coordinates[0] };
    };

    const startInfo = resolveLocation(startInput, isFromCurrent);
    const endInfo = resolveLocation(endInput, isToCurrent);

    // Use actual route coordinates for marker positions (snapped to road)
    const startLatLng = result.coordinates[0];
    const endLatLng = result.coordinates[result.coordinates.length - 1];

    startMarker = L.marker(startLatLng, {
      draggable: true,
      icon: L.divIcon({
        className: '',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-xl text-white font-bold text-xs scale-110 cursor-move">
            A
          </div>
        `,
        iconAnchor: [16, 16]
      })
    }).bindPopup(`<b>Start:</b> ${startInfo.name}`).addTo(map);

    startMarker.on('dragend', (e) => {
      snapDroppedLatLng(e.target.getLatLng(), true);
    });

    endMarker = L.marker(endLatLng, {
      draggable: true,
      icon: L.divIcon({
        className: '',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 border-2 border-slate-900 shadow-xl text-white font-bold text-xs scale-110 cursor-move">
            B
          </div>
        `,
        iconAnchor: [16, 16]
      })
    }).bindPopup(`<b>Destination:</b> ${endInfo.name}`).addTo(map);

    endMarker.on('dragend', (e) => {
      snapDroppedLatLng(e.target.getLatLng(), false);
    });

    map.fitBounds(activeRoutePath.getBounds(), {
      padding: [80, 80]
    });

    updateRoutePanelUI(activePrimaryResult);

    if (routeClearBtn) routeClearBtn.classList.remove('hidden');
  }

  function drawPolylines(primary, alternate) {
    if (activeRoutePath) map.removeLayer(activeRoutePath);
    if (activeAlternatePath) map.removeLayer(activeAlternatePath);

    if (alternate) {
      activeAlternatePath = L.polyline(alternate.coordinates, {
        color: '#475569',
        weight: 6,
        opacity: 0.55,
        dashArray: '6, 10',
        interactive: true
      }).addTo(map);

      activeAlternatePath.bindTooltip('Alternative Route', { sticky: true });

      activeAlternatePath.on('click', () => {
        const temp = activePrimaryResult;
        activePrimaryResult = activeAlternateResult;
        activeAlternateResult = temp;

        drawPolylines(activePrimaryResult, activeAlternateResult);
        updateRoutePanelUI(activePrimaryResult);
      });
    }

    const baseLine = L.polyline(primary.coordinates, {
      color: '#1e3a8a',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    const activeLine = L.polyline(primary.coordinates, {
      color: '#10b981',
      weight: 5,
      opacity: 0.95,
      className: 'route-line',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    activeRoutePath = L.featureGroup([baseLine, activeLine]).addTo(map);
  }

  function updateRoutePanelUI(res) {
    const directionsList = generateDirections(routingGraph, res);
    const mins = Math.ceil(res.walkTime / 60);

    let transitLabel = 'Walking';
    if (currentTransitMode === 'bike') transitLabel = 'Cycling';
    if (currentTransitMode === 'drive') transitLabel = 'Driving';

    if (routeResultsPanel) {
      routeResultsPanel.innerHTML = `
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="p-3 bg-ruet-card/90 rounded-xl border border-ruet-border/30 shadow-sm">
            <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Distance</span>
            <div class="text-base font-extrabold text-ruet-accent mt-0.5">${Math.round(res.distance)} m</div>
          </div>
          <div class="p-3 bg-ruet-card/90 rounded-xl border border-ruet-border/30 shadow-sm">
            <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">${transitLabel} Time</span>
            <div class="text-base font-extrabold text-blue-400 mt-0.5">${mins} ${mins === 1 ? 'min' : 'mins'}</div>
          </div>
        </div>

        <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Step-by-Step Directions</h4>
        <div class="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
          ${directionsList.map((step, idx) => {
            let icon = '⬆️';
            if (step.type === 'start') icon = '🟢';
            else if (step.type === 'arrive') icon = '🚩';
            else if (step.text.toLowerCase().includes('left')) icon = '⬅️';
            else if (step.text.toLowerCase().includes('right')) icon = '➡️';

            return `
              <div class="direction-step flex items-start gap-3 p-2.5 rounded-lg border border-ruet-border/20 bg-slate-900/40 hover:bg-slate-900/80 hover:border-ruet-green/30 cursor-pointer transition-all duration-150"
                   data-lat="${step.lat || ''}" 
                   data-lng="${step.lng || ''}">
                <span class="text-xs shrink-0 mt-0.5 select-none">${icon}</span>
                <p class="text-[11.5px] leading-relaxed text-slate-300 font-sans">${step.text}</p>
              </div>
            `;
          }).join('')}
        </div>

        <button id="start-nav-btn" class="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/30 text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 hover:brightness-110 flex items-center justify-center gap-2 shadow-lg border-none outline-none">
          🚀 Start Spoken Navigation
        </button>
      `;
      routeResultsPanel.classList.remove('hidden');

      const startNavBtn = document.getElementById('start-nav-btn');
      if (startNavBtn) {
        startNavBtn.addEventListener('click', () => {
          startHUDNavigation(res);
        });
      }

      document.querySelectorAll('.direction-step').forEach(step => {
        step.addEventListener('click', function () {
          const lat = parseFloat(this.dataset.lat);
          const lng = parseFloat(this.dataset.lng);
          if (!lat || !lng) return;

          if (stepPulseLayer) map.removeLayer(stepPulseLayer);
          stepPulseLayer = L.circleMarker([lat, lng], {
            radius: 12,
            color: '#4ade80',
            weight: 2,
            fillColor: '#4ade80',
            fillOpacity: 0.4
          }).addTo(map);

          setTimeout(() => {
            if (stepPulseLayer) map.removeLayer(stepPulseLayer);
          }, 2000);

          map.setView([lat, lng], 19);
        });
      });
    }
  }

  function startHUDNavigation(activeRes) {
    if (routePanel) routePanel.classList.add('hidden');
    const header = document.getElementById('header');
    const categoryBar = document.getElementById('category-bar');
    if (header) header.classList.add('hidden');
    if (categoryBar) categoryBar.classList.add('hidden');

    const navHud = document.getElementById('nav-hud');
    if (navHud) navHud.classList.remove('hidden');

    speechAnnouncedSteps.clear();

    const endBuildingName = selectedToId === 'current-location' ? 'your current location' : (BUILDINGS.find(b => b.id === selectedToId)?.name || 'destination');
    announceVoice("Starting navigation to " + endBuildingName);

    startLocationTracking(false);

    if (liveNavigationInterval) clearInterval(liveNavigationInterval);
    liveNavigationInterval = setInterval(() => {
      const userPos = currentGPSLatLng || activeRes.coordinates[0];
      updateLiveNavigation(userPos, activeRes);
    }, 1500);

    const userPos = currentGPSLatLng || activeRes.coordinates[0];
    updateLiveNavigation(userPos, activeRes);
  }

  function updateLiveNavigation(userLatLng, activeResult) {
    if (!userLatLng || !activeResult) return;

    const coordinates = activeResult.coordinates;
    const steps = generateDirections(routingGraph, activeResult);

    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < coordinates.length; i++) {
      const dist = window.RuetPathfinder.haversine(userLatLng[0], userLatLng[1], coordinates[i][0], coordinates[i][1]);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const remainingCoords = coordinates.slice(nearestIndex);
    let remainingDist = 0;
    for (let i = 0; i < remainingCoords.length - 1; i++) {
      remainingDist += window.RuetPathfinder.haversine(
        remainingCoords[i][0], remainingCoords[i][1],
        remainingCoords[i+1][0], remainingCoords[i+1][1]
      );
    }

    let speed = 1.33;
    if (currentTransitMode === 'bike') speed = 4.17;
    if (currentTransitMode === 'drive') speed = 8.33;

    const remainingTimeSecs = Math.round(remainingDist / speed);
    const mins = Math.ceil(remainingTimeSecs / 60);

    const hudTime = document.getElementById('hud-time');
    const hudDistance = document.getElementById('hud-distance');
    if (hudTime) hudTime.textContent = `${mins} ${mins === 1 ? 'min' : 'mins'}`;
    if (hudDistance) hudDistance.textContent = `· ${Math.round(remainingDist)} meters`;

    const stepIndex = Math.min(Math.floor(nearestIndex / Math.max(1, Math.ceil(coordinates.length / steps.length))), steps.length - 1);
    const activeStep = steps[stepIndex] || steps[0];

    if (activeStep) {
      const turnInstructionText = activeStep.text.replace(/\*\*/g, '');
      const hudInst = document.getElementById('hud-turn-instruction');
      if (hudInst) hudInst.textContent = turnInstructionText;

      const nextNodeIndex = Math.min(nearestIndex + 2, coordinates.length - 1);
      const nextNodeCoords = coordinates[nextNodeIndex];
      const distToNextNode = window.RuetPathfinder.haversine(userLatLng[0], userLatLng[1], nextNodeCoords[0], nextNodeCoords[1]);
      
      const hudSub = document.getElementById('hud-turn-subtext');
      if (hudSub) {
        hudSub.textContent = `In ${Math.round(distToNextNode)} meters`;
      }

      const announcementKey = activeStep.text;
      if (!speechAnnouncedSteps.has(announcementKey)) {
        speechAnnouncedSteps.add(announcementKey);
        announceVoice(turnInstructionText);
      }

      const turnIcon = document.getElementById('hud-turn-icon');
      if (turnIcon) {
        if (activeStep.type === 'start') turnIcon.textContent = '🟢';
        else if (activeStep.type === 'arrive') turnIcon.textContent = '🚩';
        else if (turnInstructionText.toLowerCase().includes('left')) turnIcon.textContent = '⬅️';
        else if (turnInstructionText.toLowerCase().includes('right')) turnIcon.textContent = '➡️';
        else turnIcon.textContent = '⬆️';
      }
    }
  }

  function announceVoice(message) {
    if (speechMuted || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech error:", e);
    }
  }

  function endHUDNavigation() {
    if (liveNavigationInterval) {
      clearInterval(liveNavigationInterval);
      liveNavigationInterval = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (routePanel) routePanel.classList.remove('hidden');
    const header = document.getElementById('header');
    const categoryBar = document.getElementById('category-bar');
    if (header) header.classList.remove('hidden');
    if (categoryBar) categoryBar.classList.remove('hidden');

    const navHud = document.getElementById('nav-hud');
    if (navHud) navHud.classList.add('hidden');
  }

  function clearRoute() {
    if (activeRoutePath) {
      map.removeLayer(activeRoutePath);
      activeRoutePath = null;
    }
    if (activeAlternatePath) {
      map.removeLayer(activeAlternatePath);
      activeAlternatePath = null;
    }
    if (startMarker) {
      map.removeLayer(startMarker);
      startMarker = null;
    }
    if (endMarker) {
      map.removeLayer(endMarker);
      endMarker = null;
    }
    if (stepPulseLayer) {
      map.removeLayer(stepPulseLayer);
      stepPulseLayer = null;
    }
    if (routeResultsPanel) {
      routeResultsPanel.classList.add('hidden');
      routeResultsPanel.innerHTML = '';
    }
    if (routeClearBtn) {
      routeClearBtn.classList.add('hidden');
    }
    endHUDNavigation();
  }

  if (routeSubmitBtn) {
    routeSubmitBtn.addEventListener('click', calculateAndDrawRoute);
  }

  if (routeClearBtn) {
    routeClearBtn.addEventListener('click', () => {
      clearRoute();
      if (routeFromInput) routeFromInput.value = '';
      if (routeToInput) routeToInput.value = '';
      selectedFromId = '';
      selectedToId = '';
    });
  }

  document.querySelectorAll('.transit-mode-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.transit-mode-btn').forEach(b => {
        b.classList.remove('active', 'text-ruet-accent', 'bg-ruet-green/20');
        b.classList.add('text-slate-400');
      });
      this.classList.remove('text-slate-400');
      this.classList.add('active', 'text-ruet-accent', 'bg-ruet-green/20');

      currentTransitMode = this.dataset.mode;
      if (selectedFromId && selectedToId) {
        calculateAndDrawRoute();
      }
    });
  });

  const hudVoiceBtn = document.getElementById('hud-voice-btn');
  if (hudVoiceBtn) {
    hudVoiceBtn.addEventListener('click', () => {
      speechMuted = !speechMuted;
      hudVoiceBtn.textContent = speechMuted ? '🔇' : '🔊';
      hudVoiceBtn.title = speechMuted ? 'Unmute voice navigation' : 'Mute voice navigation';
      if (!speechMuted) announceVoice("Voice guidance enabled.");
      else if (window.speechSynthesis) window.speechSynthesis.cancel();
    });
  }

  const hudExitBtn = document.getElementById('hud-exit-btn');
  if (hudExitBtn) {
    hudExitBtn.addEventListener('click', endHUDNavigation);
  }

  if (routeToggleBtn && routePanel) {
    routeToggleBtn.addEventListener('click', () => {
      if (routePanel.classList.contains('-left-[380px]')) {
        routePanel.classList.remove('-left-[380px]');
        routePanel.classList.add('left-4');
        closeSidePanel();
      } else {
        routePanel.classList.remove('left-4');
        routePanel.classList.add('-left-[380px]');
      }
    });
  }

  if (routeCloseBtn && routePanel) {
    routeCloseBtn.addEventListener('click', () => {
      routePanel.classList.remove('left-4');
      routePanel.classList.add('-left-[380px]');
    });
  }

  // ============================================================
  //  USER GEOLOCATION ("MY LOCATION")
  // ============================================================
  let watchId = null;

  function startLocationTracking(panToUser = true) {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    const locateBtn = document.getElementById('locate-btn');
    if (locateBtn) {
      locateBtn.classList.add('locate-active');
      locateBtn.innerHTML = `
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-dasharray="16" stroke-linecap="round"/></svg>
      `;
    }

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latlng = [position.coords.latitude, position.coords.longitude];
        const accuracy = position.coords.accuracy;

        updateUserMarker(latlng, accuracy);

        if (locateBtn) {
          locateBtn.classList.add('locate-active');
          locateBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
          `;
        }

        if (panToUser) {
          map.setView(latlng, 18);
          panToUser = false;
        }
      },
      (error) => {
        console.error("GPS Watch error:", error);
        if (locateBtn) {
          locateBtn.classList.remove('locate-active');
          locateBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
          `;
        }
        alert("GPS Error: Could not acquire your position. Enable location services.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  // ============================================================
  //  VIEWPORT CONTROLS HUD CLICKS
  // ============================================================
  document.getElementById('zoom-in-btn').addEventListener('click', () => {
    map.zoomIn();
  });

  document.getElementById('zoom-out-btn').addEventListener('click', () => {
    map.zoomOut();
  });

  document.getElementById('zoom-reset-btn').addEventListener('click', () => {
    map.setView(CAMPUS_CENTER, 17);
  });

  const locateBtn = document.getElementById('locate-btn');
  if (locateBtn) {
    locateBtn.addEventListener('click', () => {
      if (watchId !== null) {
        if (currentGPSLatLng) {
          map.setView(currentGPSLatLng, 18);
        } else {
          navigator.geolocation.clearWatch(watchId);
          watchId = null;
          startLocationTracking(true);
        }
      } else {
        startLocationTracking(true);
      }
    });
  }

  // ============================================================
  //  LOADING SCREEN DISMISS
  // ============================================================
  window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => loader.style.display = 'none', 700);
      }, 1000);
    }
  });

  // Expose methods for routing triggers
  window.RuetApp = {
    setRoutingDestination,
    calculateAndDrawRoute,
    clearRoute
  };

})();
