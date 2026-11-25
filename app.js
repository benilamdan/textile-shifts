/* דף פתיחה לסידור העבודה.
   הקישור האישי הקיים של העובד מועבר אחרי הסימן # (למשל ...#t=XXXX).
   חלק זה של הכתובת לעולם לא נשלח לשרת שמארח את הדף – הוא נשאר בטלפון בלבד.
   הדף לא משנה ולא מחליף שום קישור קיים: הוא רק פותח את אותו קישור אישי. */
(function () {
  'use strict';
  var APP_URL = 'https://script.google.com/macros/s/AKfycby9c-8IwTrib1n4uy6l3RynUMMHB7RtzwYtRp49QrC4cpaT2NpXu7BJQl4H2O7SDdAG/exec';
  var KEY = 'shift_link_t';

  function $(id) { return document.getElementById(id); }
  function show(id, on) { $(id).hidden = !on; }
  function store(get, val) {
    try {
      if (get) return localStorage.getItem(KEY) || '';
      if (val === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, val);
    } catch (e) { /* פרטי/חסום – ממשיכים בלי זיכרון */ }
    return '';
  }
  // מקבל מפתח בלי רווחים ובלי תווים מסוכנים, באורך סביר. כל דבר אחר נדחה.
  function clean(t) {
    t = String(t || '').trim();
    return /^[^\s<>"'`\\]{4,200}$/.test(t) ? t : '';
  }
  function fromHash() {
    var h = location.hash.replace(/^#/, '');
    var m = /(?:^|&)t=([^&]*)/.exec(h);
    if (!m) return '';
    try { return clean(decodeURIComponent(m[1])); } catch (e) { return ''; }
  }

  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document);
  var isAndroid = /Android/i.test(ua);

  var t = fromHash() || clean(store(true));
  if (fromHash()) store(false, t);

  function go(replace) { var u = APP_URL + '?t=' + encodeURIComponent(t); if (replace) location.replace(u); else location.href = u; }

  if (!t) { show('nolink', true); return; }

  show('ready', true);
  show('forget', true);
  $('open').addEventListener('click', function () { go(false); });
  $('forget').addEventListener('click', function () {
    if (!confirm('למחוק את הקישור האישי מהטלפון הזה?')) return;
    store(false, null);
    location.replace(location.pathname);
  });

  if (standalone) {
    // נפתח מהכפתור במסך הבית – ישר לסידור
    show('auto', true);
    go(true);
    return;
  }

  // פתיחה רגילה בדפדפן: מציגים הוראות התקנה
  show('install', true);
  if (isIOS) show('ios', true);
  else if (isAndroid) show('android', true);
  else show('desktop', true);

  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    show('installBtn', true);
    show('androidSteps', false);
  });
  $('installBtn').addEventListener('click', function () {
    if (!deferred) return;
    deferred.prompt();
    deferred = null;
    show('installBtn', false);
  });
})();
