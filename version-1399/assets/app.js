(function () {
  var menu = document.querySelector(".menu-toggle");
  var panel = document.querySelector(".mobile-panel");
  if (menu && panel) {
    menu.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var current = 0;
    var show = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide") || 0));
      });
    });
    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
  scopes.forEach(function (scope) {
    var grid = document.querySelector("[data-filter-grid]");
    if (!grid) {
      return;
    }
    var input = scope.querySelector("[data-filter-input]");
    var typeSelect = scope.querySelector("[data-filter-type]");
    var categorySelect = scope.querySelector("[data-filter-category]");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    var urlParams = new URLSearchParams(window.location.search);
    var q = urlParams.get("q") || "";
    if (input && q) {
      input.value = q;
    }
    var apply = function () {
      var text = input ? input.value.trim().toLowerCase() : "";
      var typeValue = typeSelect ? typeSelect.value : "";
      var categoryValue = categorySelect ? categorySelect.value : "";
      cards.forEach(function (card) {
        var haystack = card.getAttribute("data-text") || "";
        var type = card.getAttribute("data-type") || "";
        var category = card.getAttribute("data-category") || "";
        var matched = true;
        if (text && haystack.indexOf(text) === -1) {
          matched = false;
        }
        if (typeValue && type !== typeValue) {
          matched = false;
        }
        if (categoryValue && category !== categoryValue) {
          matched = false;
        }
        card.classList.toggle("hidden-card", !matched);
      });
    };
    [input, typeSelect, categorySelect].forEach(function (el) {
      if (el) {
        el.addEventListener("input", apply);
        el.addEventListener("change", apply);
      }
    });
    apply();
  });

  var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
  players.forEach(function (box) {
    var video = box.querySelector("video");
    var button = box.querySelector(".player-start");
    var status = box.querySelector(".player-status");
    var stream = box.getAttribute("data-stream") || "";
    var hlsInstance = null;
    var started = false;
    var setStatus = function (message) {
      if (status) {
        status.textContent = message;
      }
    };
    var playVideo = function () {
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          setStatus("点击视频区域继续播放");
        });
      }
    };
    var start = function () {
      if (!video || !stream) {
        setStatus("播放源暂不可用");
        return;
      }
      box.classList.add("playing");
      setStatus("播放准备中...");
      if (started) {
        playVideo();
        return;
      }
      started = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
        video.load();
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus("暂时无法播放，请稍后重试");
            if (hlsInstance) {
              hlsInstance.destroy();
              hlsInstance = null;
            }
          }
        });
      } else {
        setStatus("暂时无法播放，请稍后重试");
      }
    };
    if (button) {
      button.addEventListener("click", start);
    }
    if (video) {
      video.addEventListener("click", start);
      video.addEventListener("playing", function () {
        setStatus("");
      });
      video.addEventListener("pause", function () {
        if (!video.ended) {
          box.classList.remove("playing");
        }
      });
    }
  });
})();
