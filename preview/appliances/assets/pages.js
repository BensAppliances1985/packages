/* Appliance finder static pages (build_finder_pages.py): sale prices that end before the next refresh go back to
 * the regular price (as the finder's age() does), photo thumbnails, and GA4 events for clicks to a store or to the
 * kitchen package builder (same event names as the finder, from: model_page | list_page). */
(function () {
  'use strict';
  var endsAt = function (d) { return Date.parse(String(d).slice(0, 10) + 'T20:00:00-04:00'); };
  var money = function (n) { n = Math.round(n * 100) / 100; return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); };
  var now = Date.now();
  document.querySelectorAll('[data-ends]').forEach(function (el) {
    if (!(now >= endsAt(el.dataset.ends))) return;
    el.textContent = money(Number(el.dataset.reg));
    var box = el.parentNode;
    if (el.dataset.keepwas !== '1') box.querySelectorAll('s').forEach(function (s) { s.remove(); });
    box.querySelectorAll('.sale-ends').forEach(function (s) { s.remove(); });
  });

  var main = document.getElementById('mpMain');
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-img]');
    if (!b || !main) return;
    main.src = b.dataset.img;
    document.querySelectorAll('[data-img]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
  });

  var from = document.body.dataset.page;
  document.addEventListener('click', function (e) {
    if (typeof window.gtag !== 'function') return;
    var a = e.target.closest('a[data-ga]');
    if (a) {
      var store = a.dataset.store;
      window.gtag('event', store + '_product_click', { site: 'finder', from: from, category: a.dataset.cat, model: a.dataset.model,
        rank: Number(a.dataset.rank) || null, store: store, affiliate: /shoplowes\.me|creatoriq\.cc|7tiv\.net|anrdoezrs\.net/.test(a.href) });
      return;
    }
    var x = e.target.closest('a[data-xsite]');
    if (x) window.gtag('event', 'packages_click', { site: 'finder', from: x.dataset.xsite });
  });
})();
