(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
            return;
        }
        document.addEventListener('DOMContentLoaded', fn);
    }

    function setupMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHeroCarousel() {
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-hero-card]'));
        if (cards.length < 2) {
            return;
        }
        var active = 0;
        window.setInterval(function () {
            cards.forEach(function (card, index) {
                card.style.order = String((index - active + cards.length) % cards.length);
            });
            active = (active + 1) % cards.length;
        }, 4200);
    }

    function setupPlayer() {
        var video = document.querySelector('[data-player]');
        var button = document.querySelector('[data-play-button]');
        var overlay = document.querySelector('[data-player-overlay]');
        if (!video || !button) {
            return;
        }
        var source = video.getAttribute('data-src');
        var loaded = false;
        var hlsInstance = null;

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        }

        function attachSource() {
            if (loaded || !source) {
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                return;
            }
            video.src = source;
        }

        function playVideo() {
            attachSource();
            video.controls = true;
            hideOverlay();
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    video.controls = true;
                });
            }
        }

        button.addEventListener('click', playVideo);
        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });
        video.addEventListener('playing', hideOverlay);
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    function movieMatches(movie, query, type, region) {
        var q = query.trim().toLowerCase();
        var haystack = [
            movie.title,
            movie.year,
            movie.region,
            movie.type,
            movie.genre,
            movie.category,
            movie.summary,
            (movie.tags || []).join(' ')
        ].join(' ').toLowerCase();
        var okQuery = !q || haystack.indexOf(q) !== -1;
        var okType = !type || movie.type === type;
        var okRegion = !region || movie.region === region;
        return okQuery && okType && okRegion;
    }

    function renderSearchCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return [
            '<article class="movie-card">',
            '    <a class="poster-link" href="./movie/' + movie.id + '.html">',
            '        <img src="./' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="card-score">' + movie.score + '</span>',
            '        <span class="card-play">播放</span>',
            '    </a>',
            '    <div class="card-body">',
            '        <h3><a href="./movie/' + movie.id + '.html">' + escapeHtml(movie.title) + '</a></h3>',
            '        <p class="card-meta">' + movie.year + ' · ' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + '</p>',
            '        <p class="card-desc">' + escapeHtml(movie.summary) + '</p>',
            '        <div class="tag-row">' + tags + '</div>',
            '    </div>',
            '</article>'
        ].join('\n');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function uniqueValues(items, key) {
        var seen = Object.create(null);
        return items.map(function (item) {
            return item[key];
        }).filter(function (value) {
            if (!value || seen[value]) {
                return false;
            }
            seen[value] = true;
            return true;
        }).sort();
    }

    function setupSearchPage() {
        var form = document.querySelector('[data-search-form]');
        var input = document.querySelector('[data-search-input]');
        var typeSelect = document.querySelector('[data-type-filter]');
        var regionSelect = document.querySelector('[data-region-filter]');
        var results = document.querySelector('[data-search-results]');
        var count = document.querySelector('[data-result-count]');
        if (!form || !input || !results || !window.MOVIE_DATA) {
            return;
        }

        uniqueValues(window.MOVIE_DATA, 'type').forEach(function (value) {
            var option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            typeSelect.appendChild(option);
        });
        uniqueValues(window.MOVIE_DATA, 'region').forEach(function (value) {
            var option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            regionSelect.appendChild(option);
        });

        var params = new URLSearchParams(window.location.search);
        input.value = params.get('q') || '';

        function render() {
            var query = input.value || '';
            var type = typeSelect.value || '';
            var region = regionSelect.value || '';
            var matched = window.MOVIE_DATA.filter(function (movie) {
                return movieMatches(movie, query, type, region);
            }).slice(0, 120);
            count.textContent = '找到 ' + matched.length + ' 条结果，最多展示前 120 条。';
            if (!matched.length) {
                results.innerHTML = '<div class="empty-state">没有找到匹配影片，请换一个关键词。</div>';
                return;
            }
            results.innerHTML = matched.map(renderSearchCard).join('\n');
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            render();
        });
        input.addEventListener('input', render);
        typeSelect.addEventListener('change', render);
        regionSelect.addEventListener('change', render);
        render();
    }

    ready(function () {
        setupMenu();
        setupHeroCarousel();
        setupPlayer();
        setupSearchPage();
    });
})();
