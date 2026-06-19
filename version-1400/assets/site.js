document.addEventListener('DOMContentLoaded', function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var prev = hero.querySelector('.hero-prev');
        var next = hero.querySelector('.hero-next');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        startTimer();
    }

    var singleFilter = document.querySelector('.page-filter');
    var list = document.querySelector('[data-filter-list]');

    if (singleFilter && list && !document.getElementById('site-search-input')) {
        singleFilter.addEventListener('input', function () {
            filterCards(singleFilter.value, '', '');
        });
    }

    var searchInput = document.getElementById('site-search-input');
    var regionFilter = document.getElementById('region-filter');
    var typeFilter = document.getElementById('type-filter');
    var resetButton = document.getElementById('search-reset');

    if (searchInput && list) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        searchInput.value = query;

        function runSearch() {
            filterCards(searchInput.value, regionFilter ? regionFilter.value : '', typeFilter ? typeFilter.value : '');
        }

        searchInput.addEventListener('input', runSearch);

        if (regionFilter) {
            regionFilter.addEventListener('change', runSearch);
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', runSearch);
        }

        if (resetButton) {
            resetButton.addEventListener('click', function () {
                searchInput.value = '';
                if (regionFilter) {
                    regionFilter.value = '';
                }
                if (typeFilter) {
                    typeFilter.value = '';
                }
                runSearch();
            });
        }

        runSearch();
    }

    function filterCards(query, region, type) {
        if (!list) {
            return;
        }

        var words = String(query || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
        var cards = Array.prototype.slice.call(list.querySelectorAll('[data-search-card]'));

        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags'),
                card.textContent
            ].join(' ').toLowerCase();
            var regionOk = !region || card.getAttribute('data-region') === region;
            var typeOk = !type || haystack.indexOf(String(type).toLowerCase()) !== -1;
            var queryOk = words.every(function (word) {
                return haystack.indexOf(word) !== -1;
            });

            card.classList.toggle('is-filter-hidden', !(regionOk && typeOk && queryOk));
        });
    }
});
