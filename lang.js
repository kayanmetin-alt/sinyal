(function () {
  var key = 'sinyal.lang';

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[data-lang]');
    if (!link) return;
    var choice = link.getAttribute('data-lang');
    if (choice === 'tr' || choice === 'en') {
      try { localStorage.setItem(key, choice); } catch (e) {}
    }
  }, true);

  var params = new URLSearchParams(location.search);
  var forced = params.get('lang');
  if (forced === 'tr' || forced === 'en') {
    try { localStorage.setItem(key, forced); } catch (e) {}
    params.delete('lang');
    var query = params.toString();
    history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);
  }

  var chosen = null;
  try { chosen = localStorage.getItem(key); } catch (e) {}
  var lang = chosen === 'tr' || chosen === 'en' ? chosen : systemLang();
  var here = document.documentElement.lang === 'tr' ? 'tr' : 'en';
  if (lang === here) return;
  var next = toLang(location.pathname, lang);
  if (next !== location.pathname) location.replace(next + location.search + location.hash);

  function systemLang() {
    var primary = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return String(primary).toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
  }

  function toLang(pathname, target) {
    var marked = pathname.match(/^(.*)\/en\/(.*)$/);
    if (marked) {
      if (target === 'en') return pathname;
      var rest = marked[2];
      if (rest === '' || rest === 'index.html') return marked[1] + '/';
      return marked[1] + '/' + rest;
    }
    if (target === 'tr') return pathname;
    if (/\/index\.html$/.test(pathname)) return pathname.replace(/index\.html$/, 'en/');
    if (pathname.endsWith('/')) return pathname + 'en/';
    var cut = pathname.lastIndexOf('/');
    return pathname.slice(0, cut + 1) + 'en/' + pathname.slice(cut + 1);
  }
})();
