(function () {
  'use strict';

  var GA_ID = 'G-BJNH8VS40B';
  var CONSENT_KEY = 'motivfeed_analytics_consent_v1';
  var PAGE_VARIANT = 'landing_v1';
  var loaded = false;
  var consent = readConsent();

  function readConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY) || 'unset';
    } catch (_) {
      return 'unset';
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (_) {}
  }

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || gtag;

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function loadGoogleTag() {
    if (loaded) return;
    loaded = true;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(script);

    var debug = new URLSearchParams(location.search).get('debug_analytics') === '1';

    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      send_page_view: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      debug_mode: debug
    });
  }

  function applyConsent(value, persist) {
    consent = value;

    if (persist !== false) saveConsent(value);

    var granted = value === 'granted';

    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

    if (granted) {
      loadGoogleTag();
      track('consent_update', { analytics_consent: 'granted' });
    }

    renderConsentUi();
  }

  function safeValue(value) {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'boolean' || typeof value === 'number') return value;
    if (Array.isArray(value)) value = value.join('|');
    return String(value).replace(/\s+/g, ' ').trim().slice(0, 100);
  }

  function track(name, params) {
    if (consent !== 'granted') return;
    if (!/^[a-z][a-z0-9_]{0,39}$/.test(name)) return;

    var safe = { page_variant: PAGE_VARIANT };
    Object.keys(params || {}).forEach(function (key) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(key)) return;
      var value = safeValue(params[key]);
      if (value !== undefined && value !== '') safe[key] = value;
    });

    window.gtag('event', name, safe);
  }

  function renderConsentUi() {
    var banner = document.getElementById('consentBanner');
    if (!banner) return;
    banner.hidden = consent !== 'unset';
  }

  function openConsentSettings() {
    consent = 'unset';
    renderConsentUi();
    var banner = document.getElementById('consentBanner');
    if (banner) banner.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  function bindConsentUi() {
    var accept = document.getElementById('consentAccept');
    var reject = document.getElementById('consentReject');
    var settings = document.getElementById('consentSettings');

    if (accept) accept.addEventListener('click', function () {
      applyConsent('granted', true);
    });

    if (reject) reject.addEventListener('click', function () {
      applyConsent('denied', true);
    });

    if (settings) settings.addEventListener('click', openConsentSettings);

    renderConsentUi();
  }

  function bindCtas() {
    document.querySelectorAll('[data-track]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('cta_click', {
          cta_name: el.getAttribute('data-track'),
          cta_location: el.getAttribute('data-location') || 'unknown'
        });
      });
    });
  }

  function bindResearchView() {
    var section = document.getElementById('research');
    if (!section || !('IntersectionObserver' in window)) return;

    var fired = false;
    var observer = new IntersectionObserver(function (entries) {
      if (fired) return;
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          fired = true;
          track('research_view', {});
          observer.disconnect();
        }
      });
    }, { threshold: [0.35] });

    observer.observe(section);
  }

  function bindQualitySignals() {
    setTimeout(function () {
      if (!document.hidden) track('engaged_30s', {});
    }, 30000);

    window.addEventListener('error', function (event) {
      var sameOrigin = false;
      try {
        sameOrigin = !event.filename || new URL(event.filename, location.href).origin === location.origin;
      } catch (_) {}
      track('js_error', {
        error_type: 'runtime',
        error_source: sameOrigin ? 'first_party' : 'third_party'
      });
    });

    window.addEventListener('unhandledrejection', function () {
      track('js_error', {
        error_type: 'unhandled_rejection',
        error_source: 'unknown'
      });
    });
  }

  window.MotivAnalytics = {
    track: track,
    setConsent: applyConsent,
    openConsentSettings: openConsentSettings,
    getConsent: function () { return consent; },
    measurementId: GA_ID
  };

  if (consent === 'granted') {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    loadGoogleTag();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindConsentUi();
      bindCtas();
      bindResearchView();
      bindQualitySignals();
    });
  } else {
    bindConsentUi();
    bindCtas();
    bindResearchView();
    bindQualitySignals();
  }
})();