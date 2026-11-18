/* Serumah — menerapkan tema terang/gelap sebelum halaman tampil, agar tidak berkedip. */
(function () {
  var pref = 'auto';
  try { pref = localStorage.getItem('serumah-theme') || 'auto'; } catch (e) { /* penyimpanan tidak tersedia */ }
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function apply() {
    var dark = pref === 'dark' || (pref === 'auto' && mq && mq.matches);
    document.documentElement.setAttribute('data-mode', dark ? 'dark' : 'light');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0d1713' : '#174e42');
  }
  window.serumahTheme = {
    get: function () { return pref; },
    set: function (value) {
      pref = value;
      try { localStorage.setItem('serumah-theme', value); } catch (e) { /* abaikan */ }
      apply();
    }
  };
  apply();
  if (mq) {
    var onChange = function () { if (pref === 'auto') { apply(); if (window.onSerumahThemeChange) window.onSerumahThemeChange(); } };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
