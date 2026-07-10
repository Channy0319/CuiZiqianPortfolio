(() => {
  const imageSelector = "img[data-src]";

  function revealImage(image) {
    const source = image.dataset.src;
    if (!source) return;
    image.src = source;
    image.removeAttribute("data-src");
  }

  function reveal(target) {
    if (target.matches(imageSelector)) revealImage(target);
  }

  function isInsideInactivePage(target) {
    const page = target.closest(".home-page, .section");
    return Boolean(page && !page.classList.contains("active"));
  }

  function isNearViewport(target) {
    const margin = 160;
    const box = target.getBoundingClientRect();
    return (
      box.bottom >= -margin &&
      box.top <= window.innerHeight + margin &&
      box.right >= -margin &&
      box.left <= window.innerWidth + margin
    );
  }

  function collect() {
    return document.querySelectorAll(imageSelector);
  }

  if (!("IntersectionObserver" in window)) {
    collect().forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || isInsideInactivePage(entry.target)) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "160px 0px",
    threshold: 0.01
  });

  function observe(target) {
    observer.unobserve(target);
    if (!isInsideInactivePage(target) && isNearViewport(target)) {
      reveal(target);
      return;
    }
    observer.observe(target);
  }

  collect().forEach(observe);

  window.portfolioLazyMedia = {
    refresh(root = document) {
      root.querySelectorAll(imageSelector).forEach(observe);
    },
    reveal
  };
})();
