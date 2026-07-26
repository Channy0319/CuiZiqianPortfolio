export function mountHorizontalNotebookGallery(root, onActiveChange = () => {}) {
  const viewport = root.querySelector("[data-horizontal-gallery]");
  if (!viewport) return () => {};

  const items = [...viewport.querySelectorAll("[data-gallery-item]")];
  const previous = root.querySelector("[data-gallery-previous]");
  const next = root.querySelector("[data-gallery-next]");
  const current = root.querySelector("[data-gallery-current]");
  const total = root.querySelector("[data-gallery-total]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let pointerId;
  let pointerStartX = 0;
  let scrollStartX = 0;
  let dragged = false;
  let suppressClick = false;
  let frame;
  let smoothFrame;
  let scrollTarget = viewport.scrollLeft;

  const nearestIndex = () => {
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    items.forEach((item, index) => {
      const nextDistance = Math.abs(item.offsetLeft - viewport.scrollLeft);
      if (nextDistance < distance) {
        nearest = index;
        distance = nextDistance;
      }
    });
    return nearest;
  };

  const update = () => {
    activeIndex = nearestIndex();
    current?.replaceChildren(String(activeIndex + 1).padStart(2, "0"));
    total?.replaceChildren(String(items.length).padStart(2, "0"));
    if (previous) previous.disabled = viewport.scrollLeft <= 2;
    if (next) {
      next.disabled =
        viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
    }
    items.forEach((item, index) => {
      item.toggleAttribute("data-active", index === activeIndex);
    });
    onActiveChange(activeIndex, items.length);
  };

  const requestUpdate = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };

  const moveTo = (index) => {
    const nextIndex = Math.max(0, Math.min(items.length - 1, index));
    items[nextIndex]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const stopSmoothScroll = () => {
    cancelAnimationFrame(smoothFrame);
    smoothFrame = undefined;
    scrollTarget = viewport.scrollLeft;
    viewport.classList.remove("is-wheel-scrolling");
  };

  const smoothScroll = () => {
    const maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    scrollTarget = Math.max(0, Math.min(maximum, scrollTarget));
    const distance = scrollTarget - viewport.scrollLeft;
    if (Math.abs(distance) < 0.5) {
      viewport.scrollLeft = scrollTarget;
      smoothFrame = undefined;
      viewport.classList.remove("is-wheel-scrolling");
      return;
    }
    viewport.scrollLeft += distance * 0.2;
    smoothFrame = requestAnimationFrame(smoothScroll);
  };

  const onWheel = (event) => {
    if (!viewport.contains(event.target)) return;
    if (event.ctrlKey) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta) return;
    const atStart = viewport.scrollLeft <= 1;
    const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 1;
    if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;
    event.preventDefault();
    const maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (!smoothFrame) scrollTarget = viewport.scrollLeft;
    scrollTarget = Math.max(0, Math.min(maximum, scrollTarget + delta * 1.35));
    viewport.classList.add("is-wheel-scrolling");
    if (!smoothFrame) smoothFrame = requestAnimationFrame(smoothScroll);
  };

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    stopSmoothScroll();
    pointerId = event.pointerId;
    pointerStartX = event.clientX;
    scrollStartX = viewport.scrollLeft;
    dragged = false;
    suppressClick = false;
  };

  const onPointerMove = (event) => {
    if (event.pointerId !== pointerId) return;
    const delta = event.clientX - pointerStartX;
    if (!dragged && Math.abs(delta) <= 8) return;
    if (!dragged) {
      dragged = true;
      suppressClick = true;
      viewport.setPointerCapture(pointerId);
      viewport.classList.add("is-dragging");
    }
    event.preventDefault();
    viewport.scrollLeft = scrollStartX - delta;
  };

  const onPointerEnd = (event) => {
    if (event.pointerId !== pointerId) return;
    if (viewport.hasPointerCapture?.(pointerId)) viewport.releasePointerCapture(pointerId);
    pointerId = undefined;
    viewport.classList.remove("is-dragging");
    if (dragged) {
      window.setTimeout(() => {
        suppressClick = false;
        dragged = false;
      }, 0);
    }
  };

  const onClickCapture = (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const onKeydown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(activeIndex + 1);
    }
  };

  const onPrevious = () => moveTo(activeIndex - 1);
  const onNext = () => moveTo(activeIndex + 1);

  viewport.addEventListener("scroll", requestUpdate, { passive: true });
  document.addEventListener("wheel", onWheel, { passive: false, capture: true });
  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", onPointerEnd);
  viewport.addEventListener("pointercancel", onPointerEnd);
  viewport.addEventListener("click", onClickCapture, true);
  viewport.addEventListener("keydown", onKeydown);
  previous?.addEventListener("click", onPrevious);
  next?.addEventListener("click", onNext);
  update();

  return () => {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(smoothFrame);
    viewport.classList.remove("is-wheel-scrolling");
    viewport.removeEventListener("scroll", requestUpdate);
    document.removeEventListener("wheel", onWheel, true);
    viewport.removeEventListener("pointerdown", onPointerDown);
    viewport.removeEventListener("pointermove", onPointerMove);
    viewport.removeEventListener("pointerup", onPointerEnd);
    viewport.removeEventListener("pointercancel", onPointerEnd);
    viewport.removeEventListener("click", onClickCapture, true);
    viewport.removeEventListener("keydown", onKeydown);
    previous?.removeEventListener("click", onPrevious);
    next?.removeEventListener("click", onNext);
  };
}
