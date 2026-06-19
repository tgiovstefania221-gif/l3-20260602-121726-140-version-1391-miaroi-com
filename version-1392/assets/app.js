(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        document.querySelectorAll("[data-hero]").forEach(function (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var current = 0;
            var timer = null;

            function setSlide(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;

                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });

                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            function startTimer() {
                if (timer) {
                    clearInterval(timer);
                }

                timer = setInterval(function () {
                    setSlide(current + 1);
                }, 5200);
            }

            hero.querySelectorAll("[data-hero-next]").forEach(function (button) {
                button.addEventListener("click", function () {
                    setSlide(current + 1);
                    startTimer();
                });
            });

            hero.querySelectorAll("[data-hero-prev]").forEach(function (button) {
                button.addEventListener("click", function () {
                    setSlide(current - 1);
                    startTimer();
                });
            });

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    setSlide(index);
                    startTimer();
                });
            });

            setSlide(0);
            startTimer();
        });

        document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var category = scope.querySelector("[data-category-filter]");
            var year = scope.querySelector("[data-year-filter]");
            var emptyState = scope.querySelector("[data-empty-state]");
            var cardContainer = scope.nextElementSibling;

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function applyFilter() {
                if (!cardContainer) {
                    return;
                }

                var query = normalize(input && input.value);
                var selectedCategory = category ? category.value : "";
                var selectedYear = year ? year.value : "";
                var visible = 0;

                cardContainer.querySelectorAll(".searchable-card").forEach(function (card) {
                    var content = normalize([
                        card.dataset.title,
                        card.dataset.category,
                        card.dataset.year,
                        card.dataset.tags,
                        card.textContent
                    ].join(" "));
                    var matchQuery = !query || content.indexOf(query) !== -1;
                    var matchCategory = !selectedCategory || card.dataset.category === selectedCategory;
                    var matchYear = !selectedYear || card.dataset.year === selectedYear;
                    var show = matchQuery && matchCategory && matchYear;

                    card.style.display = show ? "" : "none";
                    if (show) {
                        visible += 1;
                    }
                });

                if (emptyState) {
                    emptyState.classList.toggle("visible", visible === 0);
                }
            }

            [input, category, year].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", applyFilter);
                    control.addEventListener("change", applyFilter);
                }
            });
        });

        document.querySelectorAll("[data-player]").forEach(function (panel) {
            var video = panel.querySelector("video");
            var cover = panel.querySelector("[data-play-cover]");
            var stream = panel.getAttribute("data-stream");
            var loaded = false;
            var hls = null;

            function attachStream() {
                if (!video || !stream || loaded) {
                    return;
                }

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                    loaded = true;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    loaded = true;
                    return;
                }

                video.src = stream;
                loaded = true;
            }

            function startPlayback() {
                attachStream();

                if (video) {
                    var playResult = video.play();
                    if (playResult && typeof playResult.catch === "function") {
                        playResult.catch(function () {});
                    }
                }
            }

            attachStream();

            if (cover) {
                cover.addEventListener("click", startPlayback);
            }

            if (video) {
                video.addEventListener("play", function () {
                    if (cover) {
                        cover.classList.add("hidden");
                    }
                });

                video.addEventListener("click", function () {
                    if (video.paused) {
                        startPlayback();
                    }
                });
            }

            window.addEventListener("pagehide", function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    });
})();
