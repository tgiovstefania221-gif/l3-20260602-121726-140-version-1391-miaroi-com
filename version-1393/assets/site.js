(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mainNav = document.querySelector('[data-main-nav]');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === activeSlide);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === activeSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  var pageFilter = document.querySelector('[data-page-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  if (pageFilter && cards.length) {
    pageFilter.addEventListener('input', function () {
      var keyword = pageFilter.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        card.classList.toggle('is-filter-hidden', keyword && haystack.indexOf(keyword) === -1);
      });
    });
  }

  var globalSearchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-global-search]'));

  function urlForCurrentPage(url) {
    var path = window.location.pathname.replace(/\\/g, '/');
    if (path.indexOf('/movies/') !== -1 || path.indexOf('/category/') !== -1) {
      return '../' + url;
    }
    return url;
  }

  function buildResult(item) {
    var a = document.createElement('a');
    a.href = urlForCurrentPage(item.url);
    var strong = document.createElement('strong');
    strong.textContent = item.title;
    var span = document.createElement('span');
    span.textContent = item.year + ' · ' + item.region + ' · ' + item.type + ' · ' + item.category;
    a.appendChild(strong);
    a.appendChild(span);
    return a;
  }

  globalSearchInputs.forEach(function (input) {
    var panel = input.parentElement ? input.parentElement.querySelector('[data-search-panel]') : null;
    if (!panel) {
      return;
    }

    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      panel.innerHTML = '';
      if (!keyword || !window.SITE_SEARCH_DATA) {
        panel.classList.remove('is-open');
        return;
      }
      var results = window.SITE_SEARCH_DATA.filter(function (item) {
        return item.search.indexOf(keyword) !== -1;
      }).slice(0, 12);
      if (!results.length) {
        var empty = document.createElement('a');
        empty.href = 'javascript:void(0)';
        empty.textContent = '没有找到相关内容';
        panel.appendChild(empty);
      } else {
        results.forEach(function (item) {
          panel.appendChild(buildResult(item));
        });
      }
      panel.classList.add('is-open');
    });

    document.addEventListener('click', function (event) {
      if (!input.parentElement.contains(event.target)) {
        panel.classList.remove('is-open');
      }
    });
  });
})();
