(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupSearchForms() {
    document.querySelectorAll('.search-form').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"], input[type="search"]');
        var target = form.getAttribute('data-search-target') || form.getAttribute('action') || 'search.html';
        var value = input ? input.value.trim() : '';
        if (value) {
          event.preventDefault();
          window.location.href = target + '?q=' + encodeURIComponent(value);
        }
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var buttons = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-nav]'));
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      buttons.forEach(function (button, i) {
        button.classList.toggle('is-active', i === current);
      });
    }

    function start() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var index = Number(button.getAttribute('data-hero-nav')) || 0;
        show(index);
        start();
      });
    });

    if (slides.length > 1) {
      start();
    }
  }

  function setupFilters() {
    document.querySelectorAll('[data-filter-form]').forEach(function (form) {
      var input = form.querySelector('[data-filter-input]');
      var list = document.querySelector('[data-filter-list]');
      var empty = document.querySelector('[data-empty-state]');
      if (!input || !list) {
        return;
      }

      function applyFilter() {
        var value = input.value.trim().toLowerCase();
        var visible = 0;
        list.querySelectorAll('[data-search]').forEach(function (item) {
          var haystack = (item.getAttribute('data-search') || '').toLowerCase();
          var title = (item.getAttribute('data-title') || '').toLowerCase();
          var matched = !value || haystack.indexOf(value) !== -1 || title.indexOf(value) !== -1;
          item.style.display = matched ? '' : 'none';
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        applyFilter();
      });
      input.addEventListener('input', applyFilter);

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        input.value = q;
        applyFilter();
      }
    });
  }

  function setupPlayers() {
    document.querySelectorAll('[data-player]').forEach(function (wrap) {
      var video = wrap.querySelector('video');
      var button = wrap.querySelector('[data-play]');
      if (!video || !button) {
        return;
      }
      var source = video.getAttribute('data-src');
      var loaded = false;
      var hlsInstance = null;

      function loadAndPlay() {
        if (!source) {
          return;
        }
        if (!loaded) {
          if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
          } else {
            video.src = source;
          }
          loaded = true;
        }
        wrap.classList.add('is-playing');
        video.controls = true;
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }

      button.addEventListener('click', loadAndPlay);
      video.addEventListener('click', function () {
        if (!loaded) {
          loadAndPlay();
        }
      });
      video.addEventListener('play', function () {
        wrap.classList.add('is-playing');
      });
      video.addEventListener('emptied', function () {
        if (hlsInstance && typeof hlsInstance.destroy === 'function') {
          hlsInstance.destroy();
          hlsInstance = null;
        }
        loaded = false;
        wrap.classList.remove('is-playing');
      });
    });
  }

  ready(function () {
    setupMenu();
    setupSearchForms();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
