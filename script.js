// State Management
let appState = {
  districts: [],
  projectData: null,
  activeView: 'home',
  currentDistrict: null,
  searchQuery: '',
  activeFilter: 'all'
};

// SVG Fallback Icons and Colors
const FALLBACK_STYLES = {
  fort: {
    gradient: 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)', // Slate/Dark
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
           </svg>`
  },
  water: {
    gradient: 'linear-gradient(135deg, #0284c7 0%, #075985 100%)', // Ocean Blue
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
           </svg>`
  },
  temple: {
    gradient: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)', // Warm Amber/Gold
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>`
  },
  nature: {
    gradient: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)', // Emerald Green
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>`
  },
  general: {
    gradient: 'linear-gradient(135deg, #115d59 0%, #e07a5f 100%)', // Brand Gradient
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
             <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
           </svg>`
  }
};

function getFallbackVisual(name = "") {
  const nm = name.toLowerCase();
  if (nm.includes('fort') || nm.includes('killa') || nm.includes('mahal') || nm.includes('palace') || nm.includes('collectorate')) {
    return FALLBACK_STYLES.fort;
  }
  if (nm.includes('lake') || nm.includes('dam') || nm.includes('talao') || nm.includes('water') || nm.includes('project') || nm.includes('river') || nm.includes('tara') || nm.includes('reservoir')) {
    return FALLBACK_STYLES.water;
  }
  if (nm.includes('temple') || nm.includes('mandir') || nm.includes('church') || nm.includes('masjid') || nm.includes('vihar') || nm.includes('dargah') || nm.includes('shrine') || nm.includes('deeksha') || nm.includes('worship')) {
    return FALLBACK_STYLES.temple;
  }
  if (nm.includes('reserve') || nm.includes('sanctuary') || nm.includes('park') || nm.includes('zoo') || nm.includes('forest') || nm.includes('wildlife') || nm.includes('garden') || nm.includes('chikhaldara')) {
    return FALLBACK_STYLES.nature;
  }
  return FALLBACK_STYLES.general;
}

// Router & View Switcher
function handleRouting() {
  const hash = window.location.hash || '#home';
  const cleanHash = hash.replace('#', '');
  
  // Mobile menu auto collapse on route
  document.getElementById('nav-links').classList.remove('active');

  // Parse Subrouting for District
  if (cleanHash.startsWith('district/')) {
    const districtName = cleanHash.split('/')[1];
    appState.activeView = 'district';
    appState.currentDistrict = decodeURIComponent(districtName);
    renderDistrictDetailView();
    switchActiveView('view-district');
    updateActiveNavLink('');
    window.scrollTo(0, 0);
    return;
  }

  // General Routes
  appState.activeView = cleanHash;
  appState.currentDistrict = null;
  
  let targetViewId = 'view-home';
  if (cleanHash === 'project') targetViewId = 'view-project';
  else if (cleanHash === 'about') targetViewId = 'view-about';
  else if (cleanHash === 'contact') targetViewId = 'view-contact';

  switchActiveView(targetViewId);
  updateActiveNavLink(cleanHash);
  window.scrollTo(0, 0);
}

function switchActiveView(viewId) {
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });
  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.classList.add('active');
  }
}

function updateActiveNavLink(route) {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
  });
  
  if (route) {
    const activeLink = document.getElementById(`link-${route}`);
    if (activeLink) activeLink.classList.add('active');
  }
}

// Render Districts Cards in Home View
function renderDistricts() {
  const grid = document.getElementById('districts-grid');
  grid.innerHTML = '';
  
  const filtered = appState.districts.filter(dist => {
    // 1. Filter by Search Query
    const query = appState.searchQuery.toLowerCase().trim();
    let matchesSearch = true;
    if (query) {
      const name = dist.district.toLowerCase();
      const overview = dist.overview.toLowerCase();
      const climate = (dist.facts.Climate || "").toLowerCase();
      const attractionsText = dist.attractions.map(a => a.name.toLowerCase() + " " + a.description.toLowerCase()).join(" ");
      matchesSearch = name.includes(query) || overview.includes(query) || climate.includes(query) || attractionsText.includes(query);
    }
    
    // 2. Filter by Category Chip
    let matchesCategory = true;
    const filter = appState.activeFilter;
    if (filter === 'tropical') {
      matchesCategory = (dist.facts.Climate || "").toLowerCase().includes('tropical');
    } else if (filter === 'lakes') {
      matchesCategory = dist.overview.toLowerCase().includes('lake') || dist.overview.toLowerCase().includes('rice');
    } else if (filter === 'wildlife') {
      matchesCategory = dist.overview.toLowerCase().includes('reserve') || dist.overview.toLowerCase().includes('sanctuary') || dist.overview.toLowerCase().includes('tiger') || dist.overview.toLowerCase().includes('park');
    }
    
    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--card-bg); border-radius: var(--radius-md); border: 1px solid var(--card-border);">
        <h3 style="margin-bottom: 8px;">No Districts Found</h3>
        <p>Try refining your search query or choosing another filter chip.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(dist => {
    const card = document.createElement('div');
    card.className = 'district-card';
    card.setAttribute('data-id', dist.district);
    
    // Get Fallback Visual Design
    const visual = getFallbackVisual(dist.district);
    
    // Format description text
    const desc = dist.overview || "No overview available.";
    
    card.innerHTML = `
      <div class="card-image-placeholder" style="background: ${visual.gradient}">
        <span class="card-badge">${dist.facts.Climate || 'Tropical'}</span>
        ${visual.icon}
      </div>
      <div class="district-card-content">
        <h3>${dist.district.replace(' Tour', '')}</h3>
        <p class="district-card-desc">${desc}</p>
        <div class="district-mini-facts">
          <div class="mini-fact">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Best: ${dist.facts['Best Time To Visit'] || 'Sep-Apr'}</span>
          </div>
          <div class="mini-fact">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            <span>Area: ${dist.facts.Area || 'N/A'}</span>
          </div>
        </div>
      </div>
      <div class="card-action">
        <span>Explore District</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </div>
    `;
    
    card.addEventListener('click', () => {
      window.location.hash = `#district/${encodeURIComponent(dist.district)}`;
    });
    
    grid.appendChild(card);
  });
}

// Render District Detail View
function renderDistrictDetailView() {
  const container = document.getElementById('district-detail-container');
  container.innerHTML = '';

  const dist = appState.districts.find(d => d.district === appState.currentDistrict);
  if (!dist) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px;">
        <h2>District Not Found</h2>
        <p>Sorry, we could not find travel details for the requested district.</p>
        <a href="#home" class="btn btn-primary" style="margin-top: 16px;">Return to Home</a>
      </div>
    `;
    return;
  }

  // Left Column Sidebar - Summary & Quick Facts
  const sidebar = document.createElement('aside');
  sidebar.className = 'detail-sidebar';
  
  let factsHtml = '';
  const factsList = [
    { key: 'Best Time To Visit', label: 'Best Season', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>` },
    { key: 'Area', label: 'Total Area', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>` },
    { key: 'Languages', label: 'Languages', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>` },
    { key: 'STD Code', label: 'STD Code', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>` },
    { key: 'Population', label: 'Population', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>` },
    { key: 'Climate', label: 'Climate Type', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>` }
  ];

  factsList.forEach(item => {
    const val = dist.facts[item.key] || 'N/A';
    factsHtml += `
      <div class="detail-fact-item">
        <div class="detail-fact-icon">${item.icon}</div>
        <div class="detail-fact-text">
          <span class="detail-fact-lbl">${item.label}</span>
          <span class="detail-fact-val">${val}</span>
        </div>
      </div>
    `;
  });

  sidebar.innerHTML = `
    <div class="detail-summary-card">
      <h2>${dist.district.replace(' Tour', '')}</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Vidarbha District Portal</p>
      <div class="detail-facts-grid">
        ${factsHtml}
      </div>
    </div>
  `;

  // Right Column Content - Tabs and Sub-views
  const contentArea = document.createElement('div');
  contentArea.className = 'detail-content-area';
  
  // Set up Tabs Headers
  const tabs = [
    { id: 'tab-overview', label: 'Overview', active: true },
    { id: 'tab-attractions', label: 'Attractions', active: false },
    { id: 'tab-worship', label: 'Worship Places', active: false },
    { id: 'tab-reach', label: 'How to Reach', active: false },
    { id: 'tab-tips', label: 'Travel Tips', active: false },
    { id: 'tab-map', label: 'Map View', active: false }
  ];

  let tabsHtml = '<div class="tabs-header" role="tablist">';
  tabs.forEach(t => {
    tabsHtml += `<button class="tab-btn ${t.active ? 'active' : ''}" data-tab="${t.id}" role="tab" aria-selected="${t.active}">${t.label}</button>`;
  });
  tabsHtml += '</div>';

  // 1. Overview Pane
  const paneOverview = `
    <div class="tab-pane active" id="pane-tab-overview" role="tabpanel">
      <h3 style="margin-bottom: 16px;">Overview</h3>
      <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-secondary);">${dist.overview || 'No overview text available.'}</p>
    </div>
  `;

  // 2. Attractions Pane
  let attractionsHtml = '';
  if (dist.attractions && dist.attractions.length) {
    dist.attractions.forEach(att => {
      const visual = getFallbackVisual(att.name);
      attractionsHtml += `
        <div class="attraction-card">
          <div class="attraction-img-placeholder" style="background: ${visual.gradient}">
            ${visual.icon}
          </div>
          <div class="attraction-info">
            <h4>${att.name}</h4>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">${att.description}</p>
          </div>
        </div>
      `;
    });
  } else {
    attractionsHtml = `<p class="muted">No primary tourist attractions cataloged for this district.</p>`;
  }

  // Append other attractions if present
  if (dist.other_attractions && dist.other_attractions.length) {
    attractionsHtml += `<h4 style="margin-top: 32px; margin-bottom: 16px; color: var(--primary);">Other Attractions</h4><ul class="project-section-detail" style="display: block; opacity: 1; transform: none; margin-top: 0;">`;
    dist.other_attractions.forEach(att => {
      attractionsHtml += `
        <li style="margin-bottom: 12px;">
          <strong>${att.name}:</strong> ${att.description}
        </li>
      `;
    });
    attractionsHtml += `</ul>`;
  }

  const paneAttractions = `
    <div class="tab-pane" id="pane-tab-attractions" role="tabpanel">
      <h3 style="margin-bottom: 20px;">Primary Tourist Attractions</h3>
      <div class="attractions-grid">${attractionsHtml}</div>
    </div>
  `;

  // 3. Places of Worship Pane
  let worshipHtml = '';
  const worshipCats = Object.keys(dist.places_of_worship || {});
  if (worshipCats.length) {
    worshipHtml += `<div class="worship-list-container">`;
    worshipCats.forEach(cat => {
      const places = dist.places_of_worship[cat] || [];
      worshipHtml += `
        <div class="worship-card">
          <h4>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>${cat}</span>
          </h4>
          <ul>
            ${places.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      `;
    });
    worshipHtml += `</div>`;
  } else {
    worshipHtml = `<p class="muted">No structured places of worship listed.</p>`;
  }

  const paneWorship = `
    <div class="tab-pane" id="pane-tab-worship" role="tabpanel">
      <h3 style="margin-bottom: 20px;">Places of Worship</h3>
      ${worshipHtml}
    </div>
  `;

  // 4. How to Reach Pane
  let reachHtml = '';
  const reachModes = Object.keys(dist.how_to_reach || {});
  if (reachModes.length) {
    reachHtml += `<div class="reach-container">`;
    reachModes.forEach(mode => {
      let icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`; // Default
      if (mode.toLowerCase() === 'air') {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;
      } else if (mode.toLowerCase() === 'train') {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18.01"></line><line x1="8" y1="8" x2="16" y2="8"></line><line x1="6" y1="14" x2="18" y2="14"></line></svg>`;
      } else if (mode.toLowerCase() === 'road') {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`;
      }
      reachHtml += `
        <div class="reach-card">
          <div class="reach-icon">${icon}</div>
          <div class="reach-info">
            <h4>By ${mode}</h4>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">${dist.how_to_reach[mode]}</p>
          </div>
        </div>
      `;
    });
    reachHtml += `</div>`;
  } else {
    reachHtml = `<p class="muted">No travel routes loaded.</p>`;
  }

  const paneReach = `
    <div class="tab-pane" id="pane-tab-reach" role="tabpanel">
      <h3 style="margin-bottom: 20px;">How to Reach</h3>
      ${reachHtml}
    </div>
  `;

  // 5. Travel Tips Pane
  let tipsHtml = '';
  const tipsCats = Object.keys(dist.travel_tips || {});
  if (tipsCats.length) {
    tipsHtml += `<div class="tips-grid">`;
    tipsCats.forEach(cat => {
      const items = dist.travel_tips[cat] || [];
      if (items.length === 0) return;
      tipsHtml += `
        <div class="tips-card">
          <h4>${cat}</h4>
          <ul>
            ${items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    });
    tipsHtml += `</div>`;
  } else {
    tipsHtml = `<p class="muted">No travel tips or local registry details loaded.</p>`;
  }

  const paneTips = `
    <div class="tab-pane" id="pane-tab-tips" role="tabpanel">
      <h3 style="margin-bottom: 20px;">Travel Contacts & Local Tips</h3>
      ${tipsHtml}
    </div>
  `;

  // 6. Map Pane
  const visual = getFallbackVisual(dist.district);
  const paneMap = `
    <div class="tab-pane" id="pane-tab-map" role="tabpanel">
      <h3 style="margin-bottom: 20px;">District Travel Map</h3>
      <div class="map-container">
        <div class="map-wrapper" style="background: ${visual.gradient}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <div style="position: absolute; bottom: 20px; color: #fff; background: rgba(0,0,0,0.6); padding: 8px 16px; border-radius: 99px; font-size: 0.85rem; font-weight: 500;">
            ${dist.district.replace(' Tour', '')} Map Visualizer
          </div>
        </div>
        <p style="margin-top: 16px; font-size: 0.9rem; color: var(--text-muted); font-style: italic;">
          Image Source Path: ${dist.map_image || 'No source file found.'}
        </p>
      </div>
    </div>
  `;

  contentArea.innerHTML = tabsHtml + paneOverview + paneAttractions + paneWorship + paneReach + paneTips + paneMap;

  // Append to layout
  container.appendChild(sidebar);
  container.appendChild(contentArea);

  // Wire Tab Switches
  contentArea.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTabId = e.currentTarget.getAttribute('data-tab');
      
      // Update tab header buttons
      contentArea.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      e.currentTarget.classList.add('active');
      e.currentTarget.setAttribute('aria-selected', 'true');

      // Update panes
      contentArea.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
      });
      contentArea.querySelector(`#pane-${targetTabId}`).classList.add('active');
    });
  });
}

// Render Project Documentation in Project View
function renderProjectDoc() {
  const sidebar = document.getElementById('project-nav');
  const detailsArea = document.getElementById('project-content-card');
  
  if (!appState.projectData || !appState.projectData.sections) {
    detailsArea.innerHTML = '<p class="muted">No project documentation available.</p>';
    return;
  }

  sidebar.innerHTML = '';
  detailsArea.innerHTML = '';

  appState.projectData.sections.forEach((sec, index) => {
    // 1. Render Navigation Link
    const navLink = document.createElement('div');
    navLink.className = `project-nav-link ${index === 0 ? 'active' : ''}`;
    navLink.textContent = sec.title;
    navLink.setAttribute('data-target', `project-sec-${sec.id}`);
    
    navLink.addEventListener('click', (e) => {
      sidebar.querySelectorAll('.project-nav-link').forEach(link => {
        link.classList.remove('active');
      });
      e.currentTarget.classList.add('active');

      detailsArea.querySelectorAll('.project-section-detail').forEach(pane => {
        pane.classList.remove('active');
      });
      detailsArea.querySelector(`#${e.currentTarget.getAttribute('data-target')}`).classList.add('active');
    });
    sidebar.appendChild(navLink);

    // 2. Render Section Content Pane
    const pane = document.createElement('article');
    pane.className = `project-section-detail ${index === 0 ? 'active' : ''}`;
    pane.id = `project-sec-${sec.id}`;
    
    let contentHtml = `<h2 style="font-size: 1.8rem; margin-bottom: 24px;">${sec.title}</h2>`;
    
    if (sec.type === 'text' && sec.paragraphs) {
      sec.paragraphs.forEach(p => {
        contentHtml += `<p>${p}</p>`;
      });
    } else if (sec.type === 'list' && sec.items) {
      contentHtml += `<ul>${sec.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    } else if (sec.type === 'grouped_list' && sec.groups) {
      sec.groups.forEach(group => {
        contentHtml += `
          <div class="project-subgroup">
            <h4>${group.title}</h4>
            <ul>
              ${group.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;
      });
    }
    
    pane.innerHTML = contentHtml;
    detailsArea.appendChild(pane);
  });

  // Update Hero Titles using loaded projectData metadata if present
  if (appState.projectData.title) {
    document.getElementById('hero-title').textContent = appState.projectData.title;
    document.getElementById('hero-subtitle').textContent = appState.projectData.subtitle || '';
    
    let focus = appState.projectData.focus_market || 'India';
    document.getElementById('hero-meta-market').textContent = `Focus: ${focus}`;
  }
}

// Set up UI Event Listeners
function setupListeners() {
  // Navigation Menu Toggle (Mobile Drawer)
  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('active');
  });

  // Logo Return
  document.getElementById('nav-logo').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '#home';
  });

  // Back Button
  document.getElementById('btn-back-home').addEventListener('click', () => {
    window.location.hash = '#home';
  });

  // Search Input Handler
  const searchInput = document.getElementById('search-districts');
  searchInput.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value;
    renderDistricts();
  });

  // Filter Chips Handlers
  document.getElementById('filter-chips').querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.getElementById('filter-chips').querySelectorAll('.filter-chip').forEach(c => {
        c.classList.remove('active');
      });
      e.currentTarget.classList.add('active');
      appState.activeFilter = e.currentTarget.getAttribute('data-filter');
      renderDistricts();
    });
  });

  // Contact Form Submission Handler
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const statusMsg = document.getElementById('form-status-msg');
    const name = document.getElementById('contact-name').value;
    
    statusMsg.className = 'form-message success';
    statusMsg.textContent = `Thank you, ${name}! Your inquiry has been sent successfully. We will contact you soon.`;
    
    contactForm.reset();
    setTimeout(() => {
      statusMsg.style.display = 'none';
    }, 6000);
  });
}

// Load Application Data
function initApp() {
  // Load Project JSON
  const fetchProject = fetch('data/project.json')
    .then(res => {
      if (!res.ok) throw new Error("Could not load project info");
      return res.json();
    })
    .then(data => {
      appState.projectData = data;
    });

  // Load Districts JSON
  const fetchDistricts = fetch('data/districts.json')
    .then(res => {
      if (!res.ok) throw new Error("Could not load districts data");
      return res.json();
    })
    .then(data => {
      appState.districts = data;
    });

  // Once all data is fetched, setup views and launch router
  Promise.all([fetchProject, fetchDistricts])
    .then(() => {
      setupListeners();
      renderProjectDoc();
      renderDistricts();
      
      // Setup Router
      window.addEventListener('hashchange', handleRouting);
      // Run first routing on page load
      handleRouting();
    })
    .catch(err => {
      console.error("Initialization error: ", err);
      const grid = document.getElementById('districts-grid');
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--secondary);">
          <h3>Error Initializing Application</h3>
          <p>Failed to load data dependencies. Please check that districts.json and project.json are available in the data directory.</p>
        </div>
      `;
    });
}

// Boot application
document.addEventListener('DOMContentLoaded', initApp);
