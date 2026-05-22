/**
 * DSGVO-Cookie-Banner – Schuldnerberatung München | Tino Richter
 * Datenschutzkonform, detailliert – für sensible Beratungsdienstleistung
 */
(function () {
  const STORAGE_KEY = 'richter_cookie_consent_v1';

  function hasConsent() {
    try { return localStorage.getItem(STORAGE_KEY) !== null; } catch (e) { return false; }
  }

  function saveConsent(categories) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timestamp: new Date().toISOString(),
        categories: categories
      }));
    } catch (e) {}
  }

  function removeBanner() {
    const el = document.getElementById('cb-overlay');
    if (el) el.remove();
  }

  function acceptAll() {
    saveConsent({ necessary: true, functional: true, external: true });
    removeBanner();
  }

  function rejectAll() {
    saveConsent({ necessary: true, functional: false, external: false });
    removeBanner();
  }

  function saveSelection() {
    const func = document.getElementById('cb-toggle-func');
    const ext  = document.getElementById('cb-toggle-ext');
    saveConsent({
      necessary: true,
      functional: func ? func.checked : false,
      external:   ext  ? ext.checked  : false
    });
    removeBanner();
  }

  function toggleDetails() {
    const d = document.getElementById('cb-details');
    const btn = document.getElementById('cb-toggle-btn');
    if (!d) return;
    const open = d.style.display === 'block';
    d.style.display = open ? 'none' : 'block';
    btn.textContent = open ? 'Einstellungen anpassen ▾' : 'Einstellungen schließen ▴';
  }

  function buildBanner() {
    const overlay = document.createElement('div');
    overlay.id = 'cb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Cookie-Einstellungen');

    overlay.innerHTML = `
<style>
#cb-overlay {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(10,16,28,.72);
  backdrop-filter: blur(4px);
  display: flex; align-items: flex-end; justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
#cb-box {
  background: #0d1f3c;
  border: 1px solid rgba(196,160,106,.25);
  border-radius: 16px;
  padding: 2rem 2rem 1.75rem;
  max-width: 680px;
  width: 100%;
  color: #fff;
  box-shadow: 0 24px 80px rgba(0,0,0,.5);
}
#cb-box h2 {
  font-size: 1.1rem; font-weight: 800; margin: 0 0 .75rem;
  display: flex; align-items: center; gap: .55rem;
  color: #fff; line-height: 1.2;
}
#cb-box h2 .cb-amber { color: #c4a06a; }
#cb-intro {
  font-size: .85rem; color: rgba(255,255,255,.62); line-height: 1.7;
  margin-bottom: 1.25rem;
}
#cb-intro strong { color: rgba(255,255,255,.85); font-weight: 600; }
#cb-intro a { color: #c4a06a; text-decoration: underline; }

/* Toggle-Button */
#cb-toggle-btn {
  background: none; border: none; color: #c4a06a;
  font-size: .82rem; font-weight: 700; cursor: pointer;
  padding: 0; margin-bottom: 1rem; display: block;
}

/* Details */
#cb-details { display: none; margin-bottom: 1.25rem; }
.cb-category {
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: .65rem;
}
.cb-cat-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: .4rem;
}
.cb-cat-title { font-size: .9rem; font-weight: 700; color: #fff; }
.cb-cat-badge {
  font-size: .68rem; font-weight: 700; padding: .2rem .6rem;
  border-radius: 100px; background: rgba(196,160,106,.15);
  color: #c4a06a; border: 1px solid rgba(196,160,106,.3);
}
.cb-cat-desc { font-size: .79rem; color: rgba(255,255,255,.5); line-height: 1.65; }

/* Toggle Switch */
.cb-switch { position: relative; width: 42px; height: 24px; flex-shrink: 0; }
.cb-switch input { opacity: 0; width: 0; height: 0; }
.cb-slider {
  position: absolute; inset: 0; background: rgba(255,255,255,.15);
  border-radius: 24px; cursor: pointer; transition: background .2s;
}
.cb-slider::before {
  content: ''; position: absolute;
  left: 3px; top: 3px; width: 18px; height: 18px;
  background: #fff; border-radius: 50%; transition: transform .2s;
}
.cb-switch input:checked + .cb-slider { background: #c4a06a; }
.cb-switch input:checked + .cb-slider::before { transform: translateX(18px); }
.cb-switch input:disabled + .cb-slider { opacity: .5; cursor: default; }

/* Buttons */
#cb-btns {
  display: flex; gap: .75rem; flex-wrap: wrap; margin-top: 1.25rem;
}
.cb-btn {
  flex: 1; min-width: 140px;
  padding: .75rem 1.2rem; border-radius: 8px;
  font-size: .86rem; font-weight: 700; cursor: pointer;
  border: none; transition: all .18s; text-align: center;
}
.cb-btn-primary { background: #c4a06a; color: #fff; }
.cb-btn-primary:hover { background: #a8875a; }
.cb-btn-secondary {
  background: transparent; color: rgba(255,255,255,.7);
  border: 1px solid rgba(255,255,255,.18);
}
.cb-btn-secondary:hover { background: rgba(255,255,255,.07); color: #fff; }
.cb-btn-ghost {
  background: transparent; color: rgba(255,255,255,.45);
  border: 1px solid rgba(255,255,255,.1);
  font-size: .82rem;
}
.cb-btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,.3); }

#cb-legal {
  font-size: .72rem; color: rgba(255,255,255,.3);
  margin-top: 1rem; line-height: 1.6;
}
#cb-legal a { color: rgba(196,160,106,.6); text-decoration: underline; }

@media (max-width: 600px) {
  #cb-overlay { padding: 1rem; align-items: flex-end; }
  #cb-box { padding: 1.5rem 1.25rem; border-radius: 12px 12px 0 0; }
  .cb-btn { min-width: 100%; }
}
</style>

<div id="cb-box">
  <h2>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#c4a06a"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
    Datenschutz &amp; <span class="cb-amber">Cookie-Einstellungen</span>
  </h2>

  <p id="cb-intro">
    Diese Website wird betrieben von <strong>Tino Richter – Schuldnerberatung München</strong>.
    Da es sich um eine <strong>anerkannte Schuldnerberatungsstelle gem. § 305 InsO</strong> handelt,
    legen wir besonderen Wert auf den Schutz Ihrer persönlichen Daten.
    Wir verwenden ausschließlich <strong>technisch notwendige Cookies</strong> sowie optionale Dienste.
    Auf dieser Website sind externe Links vorhanden (z. B.
    <a href="datenschutz.html">ProvenExpert</a>, WhatsApp, schutzkonto.de) –
    beim Klick auf diese Seiten gelten deren Datenschutzbedingungen.
    Weitere Infos: <a href="datenschutz.html">Datenschutzerklärung</a> |
    <a href="impressum.html">Impressum</a>
  </p>

  <button id="cb-toggle-btn" onclick="toggleDetails()">Einstellungen anpassen ▾</button>

  <div id="cb-details">

    <div class="cb-category">
      <div class="cb-cat-head">
        <span class="cb-cat-title">Technisch notwendig</span>
        <label class="cb-switch">
          <input type="checkbox" checked disabled>
          <span class="cb-slider"></span>
        </label>
      </div>
      <p class="cb-cat-desc">
        Diese Cookies sind für den Betrieb der Website unbedingt erforderlich und können nicht deaktiviert werden.
        Dazu gehören: Speicherung Ihrer Cookie-Einwilligung (localStorage),
        Sicherheitsfunktionen sowie die korrekte Darstellung der Seite.
        Es werden keine personenbezogenen Daten an Dritte übermittelt.
      </p>
    </div>

    <div class="cb-category">
      <div class="cb-cat-head">
        <span class="cb-cat-title">Funktionale Cookies</span>
        <span class="cb-cat-badge">Optional</span>
        <label class="cb-switch">
          <input type="checkbox" id="cb-toggle-func">
          <span class="cb-slider"></span>
        </label>
      </div>
      <p class="cb-cat-desc">
        Diese ermöglichen erweiterte Funktionen wie das Merken von Eingaben im
        <a href="pfaendungsrechner.html" style="color:#c4a06a;">Pfändungsrechner</a>
        zwischen Seitenaufrufen. Keine Weitergabe an Dritte.
      </p>
    </div>

    <div class="cb-category">
      <div class="cb-cat-head">
        <span class="cb-cat-title">Externe Dienste &amp; Links</span>
        <span class="cb-cat-badge">Optional</span>
        <label class="cb-switch">
          <input type="checkbox" id="cb-toggle-ext">
          <span class="cb-slider"></span>
        </label>
      </div>
      <p class="cb-cat-desc">
        Diese Website enthält Links zu externen Diensten:
        <strong>ProvenExpert</strong> (Bewertungsplattform),
        <strong>WhatsApp</strong> (Kontaktmöglichkeit),
        <strong>schutzkonto.de</strong> (P-Konto-Bescheinigung) sowie
        <strong>Terminbuchung</strong>.
        Beim Klick auf diese externen Links gelten die Datenschutzbestimmungen der jeweiligen Anbieter.
        Diese Einstellung steuert, ob Inhalte dieser Dienste aktiv eingebettet werden dürfen.
      </p>
    </div>

  </div>

  <div id="cb-btns">
    <button class="cb-btn cb-btn-primary" onclick="acceptAll()">Alle akzeptieren</button>
    <button class="cb-btn cb-btn-secondary" onclick="rejectAll()">Nur notwendige</button>
    <button class="cb-btn cb-btn-ghost" onclick="saveSelection()">Auswahl speichern</button>
  </div>

  <p id="cb-legal">
    Verantwortlicher: Tino Richter, Schuldnerberatung München &nbsp;|&nbsp;
    <a href="datenschutz.html">Datenschutzerklärung</a> &nbsp;|&nbsp;
    <a href="impressum.html">Impressum</a><br>
    Ihre Einwilligung ist freiwillig. Sie können sie jederzeit für die Zukunft widerrufen
    (Cookie-Daten löschen im Browser). Diese Website verwendet keine Analyse- oder Werbe-Tracker.
  </p>
</div>
    `;

    // Make functions globally accessible for onclick
    window.acceptAll    = acceptAll;
    window.rejectAll    = rejectAll;
    window.saveSelection = saveSelection;
    window.toggleDetails = toggleDetails;

    document.body.appendChild(overlay);
  }

  // Init
  function init() {
    if (!hasConsent()) buildBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
