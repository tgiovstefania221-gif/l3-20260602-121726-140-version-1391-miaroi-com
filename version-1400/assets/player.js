document.addEventListener('DOMContentLoaded', function () {
    var video = document.getElementById('movie-player');
    var overlay = document.querySelector('.play-overlay');
    var sourceMeta = document.querySelector('meta[name="movie-source"]');
    var source = sourceMeta ? sourceMeta.getAttribute('content') : '';
    var ready = false;
    var hls = null;

    if (!video || !source) {
        return;
    }

    function prepareVideo() {
        if (ready) {
            return;
        }

        ready = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function playVideo() {
        prepareVideo();

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        var playRequest = video.play();

        if (playRequest && typeof playRequest.catch === 'function') {
            playRequest.catch(function () {
                if (overlay) {
                    overlay.classList.remove('is-hidden');
                }
            });
        }
    }

    if (overlay) {
        overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });

    video.addEventListener('play', function () {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', function () {
        if (video.currentTime === 0 && overlay) {
            overlay.classList.remove('is-hidden');
        }
    });

    window.addEventListener('pagehide', function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
});
