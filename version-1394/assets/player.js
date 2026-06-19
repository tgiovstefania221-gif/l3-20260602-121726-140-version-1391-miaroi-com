(function () {
  var stages = Array.prototype.slice.call(document.querySelectorAll('.player-stage'));
  stages.forEach(function (stage) {
    var video = stage.querySelector('video');
    var overlay = stage.querySelector('.player-overlay');
    var button = stage.querySelector('.play-toggle');
    if (!video || !button) return;
    var url = button.getAttribute('data-url');
    var started = false;
    var attach = function () {
      if (started) return;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
      started = true;
    };
    var play = function () {
      attach();
      if (overlay) overlay.classList.add('is-hidden');
      var promise = video.play();
      if (promise && promise.catch) promise.catch(function () {});
    };
    button.addEventListener('click', play);
    if (overlay) overlay.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (!started) play();
    });
  });
})();
