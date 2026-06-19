(function () {
  var toggle = document.querySelector('.nav-toggle');
  var mobile = document.querySelector('.mobile-nav');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length) {
    var current = 0;
    var show = function (index) {
      current = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show((current + 1) % slides.length);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-page-search]');
  var items = Array.prototype.slice.call(document.querySelectorAll('.movie-item'));
  if (searchInput && items.length) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    searchInput.value = q;
    var filter = function () {
      var key = searchInput.value.trim().toLowerCase();
      items.forEach(function (item) {
        var source = (item.getAttribute('data-search') || item.textContent || '').toLowerCase();
        item.style.display = !key || source.indexOf(key) !== -1 ? '' : 'none';
      });
    };
    searchInput.addEventListener('input', filter);
    filter();
  }
})();
