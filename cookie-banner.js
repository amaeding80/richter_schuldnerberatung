/**
 * DSGVO-konformer Cookie-Banner
 * Schuldnerberatung Tino Richter – München
 * Rechtsstand: DSGVO Art. 7, TTDSG § 25, TMG
 *
 * Kategorien:
 *   - notwendig   : Immer aktiv (Cookie-Einstellung speichern)
 *   - statistiken : Besuchsstatistiken (opt-in)
 *   - marketing   : Remarketing / externe Widgets (opt-in)
 *
 * API:
 *   CookieBanner.open()            – Banner / Einstellungen öffnen
 *   CookieBanner.hasConsent(cat)   – true wenn Kategorie freigegeben
 *   CookieBanner.onConsent(fn)     – Callback bei Zustimmungsänderung
 */
(function () {
  'use strict';

  /* ─── Konfiguration ──────────────────────────────────────────── */
  const LS_KEY    = 'tr_cookie_consent_v1';
  const PRIVACY   = 'datenschutz.html';
  const IMPRINT   = 'impressum.html';

  const CATEGORIES = [
    {
      id:       'notwendig',
      label:    'Notwendige Cookies',
      required: true,
      desc:     'Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden. Sie speichern ausschließlich Ihre Cookie-Einstellungen und keine personenbezogenen Daten.',
      cookies: [
        { name: 'tr_cookie_consent_v1', provider: 'Diese Website', purpose: 'Speichert Ihre Cookie-Einstellungen', duration: '1 Jahr', type: 'Eigener Cookie (localStorage)' }
      ]
    },
    {
      id:       'statistiken',
      label:    'Statistik-Cookies',
      required: false,
      desc:     'Diese Cookies helfen uns, das Nutzerverhalten auf der Website anonym zu verstehen, um unsere Inhalte und Angebote gezielt zu verbessern. Alle Daten werden anonymisiert erhoben.',
      cookies: [
        { name: '_ga, _ga_*', provider: 'Google Analytics (Google LLC)', purpose: 'Anonyme Besucherstatistiken – Seitenaufrufe, Verweildauer, Absprungrate', duration: '2 Jahre / 1 Jahr', type: 'HTTP-Cookie' },
        { name: '_gid',       provider: 'Google Analytics (Google LLC)', purpose: 'Unterscheidung von Nutzersitzungen', duration: '24 Stunden', type: 'HTTP-Cookie' }
      ]
    },
    {
      id:       'marketing',
      label:    'Marketing-Cookies',
      required: false,
      desc:     'Marketing-Cookies werden verwendet, um Ihnen relevante Informationen anzuzeigen und die Effektivität unserer Kommunikation zu messen. Diese Daten können an Drittanbieter weitergegeben werden.',
      cookies: [
        { name: '_fbp',    provider: 'Meta Platforms Ireland Ltd.', purpose: 'Facebook-Pixel – Conversion-Tracking', duration: '3 Monate', type: 'HTTP-Cookie' },
        { name: 'ProvenExpert Widget', provider: 'Expert Systems AG', purpose: 'Anzeige von Bewertungen (externe Widget-Einbindung)', duration: 'Session', type: 'Third-Party-Skript' }
      ]
    }
  ];

  /* ─── State ──────────────────────────────────────────────────── */
  let _prefs     = null;
  let _callbacks = [];

  function loadPrefs() {
    try { _prefs = JSON.parse(localStorage.getItem(LS_KEY)); } catch (_) {}
  }

  function savePrefs(obj) {
    _prefs = obj;
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
    _callbacks.forEach(fn => fn(obj));
  }

  /* ─── CSS (injected once) ────────────────────────────────────── */
  function injectCSS() {
    if (document.getElementById('tr-cb-style')) return;
    const s = document.createElement('style');
    s.id    = 'tr-cb-style';
    s.textContent = `
/* === overlay === */
#tr-cb-overlay {
  position: fixed; inset: 0; z-index: 99998;
  background: rgba(10,14,28,.62);
  backdrop-filter: blur(4px);
  display: none;
  align-items: flex-end;
  justify-content: center;
  padding: 0 0 0 0;
  animation: trcb-fade-in .22s ease both;
}
#tr-cb-overlay.open { display: flex; }

/* === panel === */
#tr-cb-panel {
  position: relative;
  background: #fff;
  border-radius: 20px 20px 0 0;
  max-width: 680px;
  width: 100%;
  max-height: 92dvh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 -8px 48px rgba(0,0,0,.22);
  animation: trcb-slide-up .28s cubic-bezier(.22,.68,0,1.2) both;
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #1e293b;
  font-size: 15px;
  line-height: 1.55;
}

/* === bar (compact bottom bar, shown after consent) === */
#tr-cb-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 99997;
  background: rgba(12,9,7,.96);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255,255,255,.07);
  padding: .7rem 1.5rem;
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: .78rem;
  color: rgba(255,255,255,.45);
  animation: trcb-fade-in .3s ease both;
}
#tr-cb-bar.visible { display: flex; }
#tr-cb-bar a {
  color: rgba(255,255,255,.45);
  text-decoration: underline;
  cursor: pointer;
  border: none;
  background: none;
  font: inherit;
  padding: 0;
}
#tr-cb-bar a:hover { color: rgba(255,255,255,.7); }

/* === header === */
.trcb-header {
  padding: 1.75rem 1.75rem 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.trcb-logo {
  display: flex;
  align-items: center;
  gap: .6rem;
  flex-shrink: 0;
}
.trcb-logo-mark {
  width: 30px; height: 30px;
  background: #0d1f3c;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.trcb-logo-mark svg { width: 14px; height: 14px; fill: #fff; }
.trcb-logo-name {
  font-size: .82rem;
  font-weight: 700;
  color: #0d1f3c;
  line-height: 1.15;
}
.trcb-logo-name span {
  display: block;
  font-size: .66rem;
  font-weight: 400;
  color: #64748b;
}
.trcb-close {
  width: 34px; height: 34px; border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: #f6f8fc;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background .15s;
}
.trcb-close:hover { background: #e2e8f0; }
.trcb-close svg { width: 13px; height: 13px; stroke: #64748b; }

/* === intro === */
.trcb-intro {
  padding: 1rem 1.75rem 0;
}
.trcb-intro h2 {
  font-size: 1.18rem;
  font-weight: 800;
  color: #0d1f3c;
  margin-bottom: .45rem;
  letter-spacing: -.02em;
  line-height: 1.2;
}
.trcb-intro p {
  font-size: .855rem;
  color: #475569;
  line-height: 1.65;
  margin-bottom: .5rem;
}
.trcb-intro a { color: #c4a06a; text-decoration: underline; }
.trcb-intro a:hover { color: #a8875a; }

/* === quick actions === */
.trcb-quick {
  padding: 1rem 1.75rem;
  display: flex;
  gap: .7rem;
  flex-wrap: wrap;
}
.trcb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: .72rem 1.25rem;
  border-radius: 8px;
  font-size: .875rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all .18s;
  text-align: center;
  flex: 1;
  min-width: 140px;
  white-space: nowrap;
}
.trcb-btn-accept {
  background: #0d1f3c;
  color: #fff;
}
.trcb-btn-accept:hover { background: #162e57; transform: translateY(-1px); box-shadow: 0 4px 18px rgba(13,31,60,.25); }
.trcb-btn-essential {
  background: #f1f5f9;
  color: #0d1f3c;
}
.trcb-btn-essential:hover { background: #e2e8f0; }
.trcb-btn-save {
  background: #c4a06a;
  color: #fff;
}
.trcb-btn-save:hover { background: #a8875a; transform: translateY(-1px); box-shadow: 0 4px 18px rgba(196,160,106,.3); }

/* === toggle details === */
.trcb-toggle-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .4rem;
  padding: .4rem 1.75rem .75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-size: .8rem;
  font-weight: 600;
  width: 100%;
  transition: color .15s;
}
.trcb-toggle-details:hover { color: #0d1f3c; }
.trcb-toggle-details svg { width: 14px; height: 14px; stroke: currentColor; transition: transform .22s; }
.trcb-toggle-details.open svg { transform: rotate(180deg); }

/* === divider === */
.trcb-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0 1.75rem;
}

/* === details section === */
.trcb-details {
  display: none;
  padding: 0 1.75rem;
}
.trcb-details.open { display: block; }

/* === category === */
.trcb-cat {
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  margin: 1rem 0;
  overflow: hidden;
}
.trcb-cat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .9rem 1.1rem;
  cursor: pointer;
  background: #fff;
  gap: 1rem;
  transition: background .12s;
}
.trcb-cat-head:hover { background: #f8fafc; }
.trcb-cat-left {
  display: flex;
  align-items: center;
  gap: .75rem;
  flex: 1;
  min-width: 0;
}
.trcb-cat-title {
  font-size: .9rem;
  font-weight: 700;
  color: #0d1f3c;
}
.trcb-cat-arrow {
  width: 14px; height: 14px;
  stroke: #64748b;
  flex-shrink: 0;
  transition: transform .22s;
}
.trcb-cat.expanded .trcb-cat-arrow { transform: rotate(180deg); }

/* === toggle switch === */
.trcb-switch {
  position: relative;
  width: 44px; height: 24px;
  flex-shrink: 0;
}
.trcb-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
.trcb-switch-track {
  position: absolute; inset: 0;
  background: #cbd5e1;
  border-radius: 100px;
  transition: background .2s;
  cursor: pointer;
}
.trcb-switch input:checked + .trcb-switch-track { background: #0d1f3c; }
.trcb-switch input:disabled + .trcb-switch-track {
  background: #0d1f3c;
  cursor: not-allowed;
  opacity: .7;
}
.trcb-switch-track::after {
  content: '';
  position: absolute;
  top: 3px; left: 3px;
  width: 18px; height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: left .2s;
  box-shadow: 0 1px 3px rgba(0,0,0,.22);
}
.trcb-switch input:checked + .trcb-switch-track::after { left: 23px; }
.trcb-required-tag {
  font-size: .66rem;
  font-weight: 700;
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  border-radius: 4px;
  padding: .12rem .42rem;
  letter-spacing: .04em;
  text-transform: uppercase;
  flex-shrink: 0;
}

/* === cat body === */
.trcb-cat-body {
  display: none;
  border-top: 1.5px solid #e2e8f0;
  background: #f8fafc;
}
.trcb-cat.expanded .trcb-cat-body { display: block; }
.trcb-cat-desc {
  padding: .9rem 1.1rem;
  font-size: .82rem;
  color: #475569;
  line-height: 1.65;
  border-bottom: 1px solid #e2e8f0;
}

/* === cookie table === */
.trcb-table-wrap {
  overflow-x: auto;
  padding: .75rem 1.1rem;
}
.trcb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .78rem;
  color: #334155;
  min-width: 440px;
}
.trcb-table th {
  text-align: left;
  font-weight: 700;
  color: #0d1f3c;
  padding: .45rem .6rem;
  border-bottom: 1.5px solid #e2e8f0;
  white-space: nowrap;
  font-size: .72rem;
  text-transform: uppercase;
  letter-spacing: .04em;
}
.trcb-table td {
  padding: .55rem .6rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
  line-height: 1.5;
}
.trcb-table tr:last-child td { border-bottom: none; }
.trcb-table td:first-child { font-weight: 600; color: #0d1f3c; font-family: monospace; font-size: .78rem; }

/* === footer === */
.trcb-footer {
  padding: 1rem 1.75rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: .5rem;
  border-top: 1px solid #e2e8f0;
}
.trcb-footer-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.trcb-footer-links a {
  font-size: .76rem;
  color: #64748b;
  text-decoration: underline;
  cursor: pointer;
}
.trcb-footer-links a:hover { color: #0d1f3c; }
.trcb-footer-version {
  font-size: .68rem;
  color: #94a3b8;
}

/* === animations === */
@keyframes trcb-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes trcb-slide-up {
  from { transform: translateY(40px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

/* === responsive === */
@media (max-width: 600px) {
  #tr-cb-panel { font-size: 12px; max-height: 80dvh; border-radius: 14px 14px 0 0; }
  .trcb-header { padding: .65rem .85rem 0; }
  .trcb-logo-mark { width: 20px; height: 20px; border-radius: 4px; }
  .trcb-logo-mark svg { width: 10px; height: 10px; }
  .trcb-logo-name { font-size: .7rem; }
  .trcb-logo-name span { font-size: .58rem; }
  .trcb-close { width: 26px; height: 26px; }
  .trcb-close svg { width: 10px; height: 10px; }
  .trcb-intro  { padding: .45rem .85rem 0; }
  .trcb-intro h2 { font-size: .88rem; margin-bottom: .2rem; }
  .trcb-intro p { font-size: .73rem; line-height: 1.5; margin-bottom: .3rem; }
  .trcb-quick  { padding: .5rem .85rem; flex-direction: column; gap: .35rem; }
  .trcb-btn { min-width: 0; width: 100%; justify-content: center; padding: .5rem .85rem; font-size: .75rem; border-radius: 6px; }
  .trcb-toggle-details { padding: .2rem .85rem .4rem; font-size: .72rem; }
  .trcb-divider { margin: 0 .85rem; }
  .trcb-details { padding: 0 .85rem; }
  .trcb-footer  { padding: .55rem .85rem 1rem; font-size: .68rem; }
  #tr-cb-bar { padding: .5rem .85rem; font-size: .7rem; }
}
    `;
    document.head.appendChild(s);
  }

  /* ─── Build HTML ─────────────────────────────────────────────── */
  function buildOverlay(opts) {
    const showDetails = opts && opts.showDetails;

    const categoriesHTML = CATEGORIES.map(cat => {
      const cookiesRows = cat.cookies.map(c => `
        <tr>
          <td>${c.name}</td>
          <td>${c.provider}</td>
          <td>${c.purpose}</td>
          <td>${c.duration}</td>
        </tr>
      `).join('');

      const isChecked  = cat.required ? true : (_prefs ? (_prefs[cat.id] === true) : false);
      const switchHTML = cat.required
        ? `<label class="trcb-switch"><input type="checkbox" checked disabled><span class="trcb-switch-track"></span></label>`
        : `<label class="trcb-switch"><input type="checkbox" data-cat="${cat.id}" ${isChecked ? 'checked' : ''}><span class="trcb-switch-track"></span></label>`;

      return `
        <div class="trcb-cat" data-cat-id="${cat.id}">
          <div class="trcb-cat-head" onclick="window.__trCBToggleCat('${cat.id}')">
            <div class="trcb-cat-left">
              ${switchHTML}
              <span class="trcb-cat-title">${cat.label}</span>
              ${cat.required ? '<span class="trcb-required-tag">Immer aktiv</span>' : ''}
            </div>
            <svg class="trcb-cat-arrow" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="trcb-cat-body">
            <div class="trcb-cat-desc">${cat.desc}</div>
            <div class="trcb-table-wrap">
              <table class="trcb-table">
                <thead><tr><th>Cookie</th><th>Anbieter</th><th>Zweck</th><th>Laufzeit</th></tr></thead>
                <tbody>${cookiesRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const html = `
      <div id="tr-cb-overlay" class="open" role="dialog" aria-modal="true" aria-label="Cookie-Einstellungen">
        <div id="tr-cb-panel">

          <div class="trcb-header">
            <div class="trcb-logo">
              <div class="trcb-logo-mark">
                <svg viewBox="0 0 24 24"><path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"/></svg>
              </div>
              <div class="trcb-logo-name">Tino Richter <span>Schuldnerberatung München</span></div>
            </div>
            <button class="trcb-close" id="tr-cb-close" aria-label="Schließen (nur notwendige Cookies)">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="trcb-intro">
            <h2>Ihre Privatsphäre liegt uns am Herzen</h2>
            <p>
              Wir verwenden Cookies, um diese Website zu betreiben und Ihren Besuch zu verbessern.
              Da wir als Schuldnerberatung mit sensiblen Themen arbeiten, ist Datenschutz für uns kein Formalkram –
              sondern echte Verpflichtung. Bitte wählen Sie, welchen Cookies Sie zustimmen möchten.
              Ihre Auswahl können Sie jederzeit über den Link „Cookie-Einstellungen" im Footer widerrufen.
            </p>
            <p>Weitere Informationen finden Sie in unserer <a href="${PRIVACY}">Datenschutzerklärung</a> und im <a href="${IMPRINT}">Impressum</a>.</p>
          </div>

          <div class="trcb-quick">
            <button class="trcb-btn trcb-btn-accept"    id="tr-cb-accept-all">Alle akzeptieren</button>
            <button class="trcb-btn trcb-btn-essential" id="tr-cb-essential">Nur notwendige</button>
            <button class="trcb-btn trcb-btn-save"      id="tr-cb-save">Auswahl speichern</button>
          </div>

          <button class="trcb-toggle-details ${showDetails ? 'open' : ''}" id="tr-cb-toggle-details">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Details &amp; individuelle Einstellungen
          </button>

          <div class="trcb-divider"></div>

          <div class="trcb-details ${showDetails ? 'open' : ''}" id="tr-cb-details">
            ${categoriesHTML}

            <div style="padding:.5rem 0 .25rem;font-size:.78rem;color:#94a3b8;line-height:1.6;">
              Rechtsgrundlage: DSGVO Art. 6 Abs. 1 lit. a (Einwilligung) und Art. 6 Abs. 1 lit. f (berechtigtes Interesse)
              für notwendige Cookies gemäß TTDSG § 25 Abs. 2.
            </div>
          </div>

          <div class="trcb-footer">
            <div class="trcb-footer-links">
              <a href="${PRIVACY}">Datenschutz</a>
              <a href="${IMPRINT}">Impressum</a>
            </div>
            <span class="trcb-footer-version">© ${new Date().getFullYear()} Tino Richter · DSGVO-konform</span>
          </div>

        </div>
      </div>
    `;

    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    return wrap.firstElementChild;
  }

  function buildBar() {
    const el = document.createElement('div');
    el.id = 'tr-cb-bar';
    el.innerHTML = `
      <span>Cookie-Einstellungen dieser Seite</span>
      <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
        <button onclick="CookieBanner.open()" style="color:rgba(255,255,255,.45);background:none;border:none;font:inherit;font-size:.78rem;text-decoration:underline;cursor:pointer;padding:0;">Einstellungen ändern</button>
        <a href="${PRIVACY}" style="color:rgba(255,255,255,.45);font-size:.78rem;text-decoration:underline;">Datenschutz</a>
      </div>
    `;
    return el;
  }

  /* ─── Mount / Teardown ───────────────────────────────────────── */
  function openOverlay(opts) {
    document.getElementById('tr-cb-overlay')?.remove();
    const overlay = buildOverlay(opts);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    bindOverlayEvents();

    // Focus trap
    setTimeout(() => {
      const first = overlay.querySelector('button:not([disabled])');
      if (first) first.focus();
    }, 100);
  }

  function closeOverlay(saveEssentialOnly) {
    const overlay = document.getElementById('tr-cb-overlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
    if (saveEssentialOnly) {
      savePrefs({ notwendig: true, statistiken: false, marketing: false, ts: Date.now() });
    }
    // Kein persistenter Bar – Footer-Link "Cookie-Einstellungen" reicht aus
  }

  /* ─── Events ─────────────────────────────────────────────────── */
  function bindOverlayEvents() {
    // Close (X) → save essential only
    document.getElementById('tr-cb-close')?.addEventListener('click', () => closeOverlay(true));

    // Click outside panel → same as close
    document.getElementById('tr-cb-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'tr-cb-overlay') closeOverlay(true);
    });

    // Accept all
    document.getElementById('tr-cb-accept-all')?.addEventListener('click', () => {
      savePrefs({ notwendig: true, statistiken: true, marketing: true, ts: Date.now() });
      closeOverlay(false);
    });

    // Essential only
    document.getElementById('tr-cb-essential')?.addEventListener('click', () => {
      savePrefs({ notwendig: true, statistiken: false, marketing: false, ts: Date.now() });
      closeOverlay(false);
    });

    // Save selection
    document.getElementById('tr-cb-save')?.addEventListener('click', () => {
      const prefs = { notwendig: true, ts: Date.now() };
      CATEGORIES.forEach(cat => {
        if (cat.required) { prefs[cat.id] = true; return; }
        const cb = document.querySelector(`input[data-cat="${cat.id}"]`);
        prefs[cat.id] = cb ? cb.checked : false;
      });
      savePrefs(prefs);
      closeOverlay(false);
    });

    // Toggle details
    document.getElementById('tr-cb-toggle-details')?.addEventListener('click', function () {
      this.classList.toggle('open');
      document.getElementById('tr-cb-details')?.classList.toggle('open');
    });

    // Prevent toggle switch label from also triggering cat expand
    document.querySelectorAll('.trcb-switch').forEach(sw => {
      sw.addEventListener('click', e => e.stopPropagation());
    });

    // ESC to close
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeOverlay(true);
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  /* ─── Global cat toggle ──────────────────────────────────────── */
  window.__trCBToggleCat = function (catId) {
    const el = document.querySelector(`.trcb-cat[data-cat-id="${catId}"]`);
    if (el) el.classList.toggle('expanded');
  };

  /* ─── Init ───────────────────────────────────────────────────── */
  function init() {
    injectCSS();
    loadPrefs();

    if (!_prefs) {
      // First visit – show banner
      openOverlay();
    }
    // Returning visitor – no bar, settings accessible via footer link
  }

  /* ─── Public API ─────────────────────────────────────────────── */
  window.CookieBanner = {
    /** Open the full settings panel */
    open: function (opts) {
      injectCSS();
      loadPrefs();
      openOverlay(Object.assign({ showDetails: true }, opts));
    },
    /** Check if a category was consented to */
    hasConsent: function (cat) {
      loadPrefs();
      return !!((_prefs || {})[cat]);
    },
    /** Register callback called whenever prefs change */
    onConsent: function (fn) {
      _callbacks.push(fn);
    }
  };

  /* ─── Kick off after DOM ready ───────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
