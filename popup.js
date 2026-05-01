const API = 'http://localhost:6060/api';
let currentUrl = '';
let currentTab = null;
let selectedType = 'change';

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await getCurrentTab();
  await checkServer();
  await loadSavedEmail();
  await loadTrackedList();
  setupTabs();
  setupAlertTypes();
  setupButtons();
  detectUrlType(currentUrl);
});

// ── GET CURRENT TAB URL ───────────────────────────
async function getCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;
    currentUrl = tab.url || '';

    // Show URL
    document.getElementById('currentUrl').textContent = currentUrl;

    // Favicon
    const favicon = document.getElementById('favicon');
    if (tab.favIconUrl) {
      favicon.src = tab.favIconUrl;
    } else {
      favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(currentUrl).hostname}`;
    }

    // Auto fill label from page title
    const labelInp = document.getElementById('labelInp');
    if (tab.title && !labelInp.value) {
      labelInp.value = tab.title.substring(0, 40);
    }

  } catch (e) {
    document.getElementById('currentUrl').textContent = 'Cannot read URL';
  }
}

// ── DETECT URL TYPE ───────────────────────────────
function detectUrlType(url) {
  const typeEl = document.getElementById('urlType');
  const u = url.toLowerCase();

  if (u.includes('youtube.com') || u.includes('youtu.be')) {
    typeEl.textContent = 'VIDEO';
    typeEl.className = 'url-type type-video';
    selectType('video');
  } else if (u.includes('naukri.com') || u.includes('linkedin.com/jobs') ||
             u.includes('indeed.com') || u.includes('wellfound.com') ||
             u.includes('careers') || u.includes('jobs')) {
    typeEl.textContent = 'JOBS';
    typeEl.className = 'url-type type-job';
    selectType('job');
  } else if (u.includes('amazon') || u.includes('flipkart') ||
             u.includes('meesho') || u.includes('myntra') ||
             u.includes('snapdeal') || u.includes('price')) {
    typeEl.textContent = 'PRICE';
    typeEl.className = 'url-type type-price';
    selectType('price');
  } else if (u.includes('news') || u.includes('times') ||
             u.includes('hindu') || u.includes('ndtv') ||
             u.includes('techcrunch') || u.includes('medium.com')) {
    typeEl.textContent = 'NEWS';
    typeEl.className = 'url-type type-news';
    selectType('change');
  } else {
    typeEl.textContent = 'URL';
    typeEl.className = 'url-type type-general';
    selectType('change');
  }
}

// ── SETUP TABS ─────────────────────────────────────
function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
      if (tab.dataset.tab === 'list') loadTrackedList();
    });
  });
}

// ── ALERT TYPE SELECTION ───────────────────────────
function setupAlertTypes() {
  document.querySelectorAll('.alert-type').forEach(el => {
    el.addEventListener('click', () => selectType(el.dataset.type));
  });
}

function selectType(type) {
  selectedType = type;
  document.querySelectorAll('.alert-type').forEach(el => {
    el.classList.toggle('selected', el.dataset.type === type);
  });
  // Show target price field for price type
  const priceGroup = document.getElementById('targetPriceGroup');
  priceGroup.style.display = type === 'price' ? 'block' : 'none';
}

// ── SETUP BUTTONS ──────────────────────────────────
function setupButtons() {
  document.getElementById('trackBtn').addEventListener('click', trackCurrentUrl);
  document.getElementById('jobSearchBtn').addEventListener('click', searchJobs);
  document.getElementById('priceSearchBtn').addEventListener('click', searchPrice);
}

// ── TRACK CURRENT URL ──────────────────────────────
async function trackCurrentUrl() {
  const email    = document.getElementById('emailInp').value.trim();
  const label    = document.getElementById('labelInp').value.trim();
  const interval = document.getElementById('intervalInp').value;
  const btn      = document.getElementById('trackBtn');

  if (!email) { toast('[ error ] email required'); return; }
  if (!currentUrl || currentUrl.startsWith('chrome://')) {
    toast('[ error ] cannot track browser pages'); return;
  }

  // Save email for next time
  chrome.storage.local.set({ savedEmail: email });

  btn.textContent = '[ scanning... ]';
  btn.classList.add('loading');

  try {
    const body = {
      url:           currentUrl,
      label:         label || currentUrl,
      email:         email,
      intervalHours: parseInt(interval),
      category:      getCategoryFromType(selectedType)
    };

    // Price alert
    if (selectedType === 'price') {
      const targetPrice = document.getElementById('targetPriceInp').value;
      if (targetPrice) {
        await fetch(`${API}/price/alert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product:     label || currentUrl,
            targetPrice: parseFloat(targetPrice),
            email:       email
          })
        });
      }
    }

    // Track URL
    const res  = await fetch(`${API}/track`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    });

    if (res.ok) {
      const data = await res.json();
      showSuccess(`Target #${data.id} locked. Watching every ${interval}h`);
      toast('✓ surveillance initiated');

      // Chrome notification
      chrome.notifications?.create({
        type:    'basic',
        iconUrl: 'icons/icon48.png',
        title:   'WATCHER — Target Locked',
        message: `Now watching: ${label || currentUrl}`
      });

    } else {
      toast('[ error ] server rejected request');
    }

  } catch (e) {
    toast('[ error ] cannot reach watcher engine — start spring boot');
  }

  btn.textContent = '[ initiate surveillance ]';
  btn.classList.remove('loading');
}

// ── LOAD TRACKED LIST ─────────────────────────────
async function loadTrackedList() {
  try {
    const res   = await fetch(`${API}/tracks`);
    const data  = await res.json();

    document.getElementById('sTotal').textContent   = data.length;
    document.getElementById('sActive').textContent  = data.filter(t => t.isActive).length;

    // Get recent changes count
    try {
      const cr = await fetch(`${API}/changes/recent`);
      const cd = await cr.json();
      document.getElementById('sChanges').textContent = cd.length;
    } catch(e) {}

    renderTrackList(data);

  } catch (e) {
    document.getElementById('trackList').innerHTML =
      `<div class="empty"><div class="empty-icon">⚠️</div>cannot reach watcher engine</div>`;
  }
}

function renderTrackList(tracks) {
  const list = document.getElementById('trackList');
  if (!tracks.length) {
    list.innerHTML = `<div class="empty"><div class="empty-icon">🎯</div>no targets — track above</div>`;
    return;
  }

  list.innerHTML = tracks.map(t => `
    <div class="track-item">
      <div class="ti-top">
        <div class="ti-label">${t.label || 'Untitled'}</div>
        <span class="url-type ${t.isActive ? 'type-general' : 'type-price'}" style="${t.isActive ? 'color:var(--green);border-color:rgba(34,197,94,.3);background:rgba(34,197,94,.08)' : ''}">
          ${t.isActive ? 'live' : 'paused'}
        </span>
      </div>
      <div class="ti-url">${truncate(t.url, 45)}</div>
      <div class="ti-meta">
        <div class="ti-info">
          every ${t.checkIntervalHours}h · checks: ${t.totalChecks || 0} · changes: ${t.totalChanges || 0}
        </div>
        <div class="ti-actions">
          <button class="ti-btn scan" onclick="manualScan(${t.id})">scan</button>
          <button class="ti-btn" onclick="toggleTrack(${t.id})">${t.isActive ? 'pause' : 'run'}</button>
          <button class="ti-btn del" onclick="deleteTrack(${t.id})">del</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── SEARCH JOBS ────────────────────────────────────
async function searchJobs() {
  const q        = document.getElementById('jobQuery').value.trim();
  const location = document.getElementById('jobLocation').value.trim() || 'India';
  const results  = document.getElementById('searchResults');

  if (!q) { toast('[ error ] enter job title'); return; }

  results.innerHTML = `<div class="empty">searching jobs...</div>`;

  try {
    const res  = await fetch(`${API}/jobs/search?q=${encodeURIComponent(q)}&location=${encodeURIComponent(location)}`);
    const data = await res.json();

    let html = '';
    const allJobs = [
      ...(data.naukri  || []).map(j => ({...j, src:'Naukri'})),
      ...(data.linkedin|| []).map(j => ({...j, src:'LinkedIn'})),
      ...(data.google?.jobs || []).map(j => ({...j, src:'Google'})),
    ].slice(0, 8);

    if (!allJobs.length) {
      results.innerHTML = `<div class="empty">no jobs found</div>`;
      return;
    }

    html = allJobs.map(j => `
      <div style="background:var(--s2);border:1px solid var(--b1);border-radius:5px;padding:8px 10px;margin-bottom:6px">
        <div style="font-size:11px;font-weight:600;color:var(--t1);margin-bottom:2px">${j.title||'Unknown'}</div>
        <div style="font-size:10px;color:var(--t2)">${j.company||''} · ${j.location||''}</div>
        <div style="display:flex;justify-content:space-between;margin-top:4px;align-items:center">
          <span style="font-size:8px;padding:2px 6px;background:rgba(34,197,94,.1);color:var(--green);border-radius:3px">${j.src}</span>
          ${j.link ? `<a href="${j.link}" target="_blank" style="font-size:8px;color:var(--cyan);letter-spacing:.5px;text-decoration:none">open →</a>` : ''}
        </div>
      </div>
    `).join('');

    results.innerHTML = html;

  } catch(e) {
    results.innerHTML = `<div class="empty">[ error ] server unreachable</div>`;
  }
}

// ── SEARCH PRICE ───────────────────────────────────
async function searchPrice() {
  const q       = document.getElementById('priceQuery').value.trim();
  const results = document.getElementById('searchResults');

  if (!q) { toast('[ error ] enter product name'); return; }

  results.innerHTML = `<div class="empty">fetching prices...</div>`;

  try {
    const res  = await fetch(`${API}/price/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();

    if (data.error) { results.innerHTML = `<div class="empty">${data.error}</div>`; return; }

    const prices = data.results || [];
    results.innerHTML = prices.map((p, i) => `
      <div style="background:${i===0?'rgba(34,197,94,.05)':'var(--s2)'};border:1px solid ${i===0?'rgba(34,197,94,.2)':'var(--b1)'};border-radius:5px;padding:8px 10px;margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div style="font-size:10px;color:var(--t1);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.title}</div>
          <div style="font-size:12px;font-weight:700;color:${i===0?'var(--green)':'var(--amber)'}">${p.price}</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:8px;color:var(--t2)">${p.source}</span>
          ${i===0?'<span style="font-size:8px;padding:2px 6px;background:rgba(34,197,94,.1);color:var(--green);border-radius:3px">cheapest</span>':''}
        </div>
      </div>
    `).join('');

  } catch(e) {
    results.innerHTML = `<div class="empty">[ error ] server unreachable</div>`;
  }
}

// ── TRACK ACTIONS ──────────────────────────────────
async function manualScan(id) {
  toast(`[ scan ] checking target #${id}...`);
  try {
    await fetch(`${API}/check/${id}`, { method: 'POST' });
    toast('[ ok ] scan complete');
    loadTrackedList();
  } catch(e) { toast('[ error ] scan failed'); }
}

async function toggleTrack(id) {
  try {
    const res  = await fetch(`${API}/track/${id}/toggle`, { method: 'PUT' });
    const data = await res.json();
    toast(data.message);
    loadTrackedList();
  } catch(e) { toast('[ error ]'); }
}

async function deleteTrack(id) {
  if (!confirm('Purge this target?')) return;
  try {
    await fetch(`${API}/track/${id}`, { method: 'DELETE' });
    toast('[ ok ] target purged');
    loadTrackedList();
  } catch(e) { toast('[ error ]'); }
}

// ── SERVER CHECK ───────────────────────────────────
async function checkServer() {
  try {
    const res  = await fetch(`${API}/health`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    const mlOk = data.ml_service === 'connected';

    document.getElementById('serverDot').classList.remove('off');
    document.getElementById('serverTxt').textContent  = 'online';
    document.getElementById('serverStatus').textContent = `// watcher: online · ml: ${mlOk ? 'connected' : 'offline'}`;

  } catch(e) {
    document.getElementById('serverDot').classList.add('off');
    document.getElementById('serverTxt').textContent   = 'offline';
    document.getElementById('serverStatus').textContent = '// watcher engine: offline — start spring boot';
  }
}

// ── LOAD SAVED EMAIL ───────────────────────────────
async function loadSavedEmail() {
  const data = await chrome.storage.local.get('savedEmail');
  if (data.savedEmail) {
    document.getElementById('emailInp').value = data.savedEmail;
  }
}

// ── HELPERS ────────────────────────────────────────
function getCategoryFromType(type) {
  const map = { change:'GENERAL', job:'JOBS', price:'ECOMMERCE', video:'GENERAL', news:'NEWS' };
  return map[type] || 'GENERAL';
}

function truncate(s, n) {
  return s && s.length > n ? s.slice(0, n) + '…' : s || '';
}

function showSuccess(msg) {
  const banner = document.getElementById('successBanner');
  document.getElementById('successMsg').textContent = msg;
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 4000);
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
