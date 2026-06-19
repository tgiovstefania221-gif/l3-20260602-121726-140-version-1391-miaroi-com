(function() {
  const toggle = document.querySelector(".mobile-toggle");
  const panel = document.querySelector(".mobile-panel");

  if (toggle && panel) {
    toggle.addEventListener("click", function() {
      panel.classList.toggle("open");
    });
  }

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-dots button"));
    let current = 0;

    function show(index) {
      current = index;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        show(index);
      });
    });

    window.setInterval(function() {
      show((current + 1) % slides.length);
    }, 5200);
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilter(input) {
    const query = normalize(input.value);
    const cards = Array.from(document.querySelectorAll(".movie-card"));

    cards.forEach(function(card) {
      const haystack = normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.type,
        card.dataset.region,
        card.dataset.genre,
        card.textContent
      ].join(" "));

      card.classList.toggle("hidden", query && !haystack.includes(query));
    });
  }

  const urlQuery = new URLSearchParams(window.location.search).get("q") || "";
  const filters = Array.from(document.querySelectorAll(".page-filter"));

  filters.forEach(function(input) {
    if (urlQuery) {
      input.value = urlQuery;
      applyFilter(input);
    }

    input.addEventListener("input", function() {
      applyFilter(input);
    });
  });
}());
