import { PROJECTS } from "./ProjectNotebookV3.js";

function ringMarkup() {
  return Array.from({ length: 12 }, () => "<span></span>").join("");
}

function slideMarkup(project, index) {
  const slideNumber = String(index).padStart(2, "0");
  const base = `/projects/strategy/${project.id}/images/slide${slideNumber}`;
  const high = `${base}-${project.slideWidth}.webp`;
  const low = `${base}-960.webp`;
  const eager = index <= 2;

  return `
    <figure class="detail-slide" data-detail-slide="${index}">
      <picture>
        <source
          media="(max-width: 760px)"
          srcset="${low}"
        />
        <img
          src="${high}"
          alt="${project.title} PPT 第 ${index} 页"
          width="${project.slideWidth}"
          height="${project.slideWidth * 0.5625}"
          loading="${eager ? "eager" : "lazy"}"
          decoding="async"
          ${eager ? 'fetchpriority="high"' : ""}
        />
      </picture>
      <figcaption>
        <span>${slideNumber}</span>
        <i></i>
        ${String(project.slideCount).padStart(2, "0")}
      </figcaption>
    </figure>
  `;
}

function metadataMarkup(project) {
  return `
    <dl class="detail-meta">
      <div>
        <dt>Category</dt>
        <dd>${project.category}</dd>
      </div>
      <div>
        <dt>Time</dt>
        <dd>${project.date}</dd>
      </div>
      <div>
        <dt>Role</dt>
        <dd>${project.role}</dd>
      </div>
      <div>
        <dt>Team</dt>
        <dd>${project.team}</dd>
      </div>
      <div>
        <dt>Format</dt>
        <dd>${project.format}</dd>
      </div>
    </dl>
  `;
}

function decorMarkup() {
  return `
    <div class="detail-decor" aria-hidden="true">
      <span class="detail-prop detail-coffee"></span>
      <span class="detail-prop detail-succulent"></span>
      <span class="detail-prop detail-flower"></span>
      <span class="detail-prop detail-binder"></span>
      <span class="detail-prop detail-pencil"></span>
      <span class="detail-prop detail-paperclip"></span>
      <span class="detail-prop detail-yarn"></span>
      <span class="detail-prop detail-crochet"></span>
      <span class="detail-polaroid"><i></i></span>
    </div>
  `;
}

export function ProjectDetailV3(container, projectId) {
  const project = PROJECTS.find((item) => item.id === projectId);

  if (!project) {
    location.hash = "project";
    return () => {};
  }

  const previousTitle = document.title;
  document.title = `${project.title} — Cui Ziqian`;

  container.innerHTML = `
    <main
      class="project-detail-v3 project-detail-${project.id}"
      data-page="project-detail-v3"
      data-project="${project.id}"
    >
      ${decorMarkup()}

      <button class="detail-back" type="button" data-back-to-projects>
        <span aria-hidden="true">←</span>
        Back to Project
      </button>

      <section class="detail-stage" aria-label="${project.title}">
        <article class="detail-notebook">
          <aside class="detail-left-page">
            <header class="detail-heading">
              <p>${project.eyebrow}</p>
              <h1>
                ${project.titleLines.map((line) => `<span>${line}</span>`).join("")}
              </h1>
              <strong>${project.subtitle}</strong>
              <small>${project.year}</small>
            </header>

            ${metadataMarkup(project)}

            <section class="detail-summary-note" aria-labelledby="detail-summary-title">
              <span class="detail-note-tape"></span>
              <h2 id="detail-summary-title">项目简介</h2>
              <p>${project.detailDescription}</p>
            </section>

            <ul class="detail-keywords" aria-label="Keywords">
              ${project.keywords.map((keyword) => `<li>${keyword}</li>`).join("")}
            </ul>

            <span class="detail-signature">Cz.</span>
          </aside>

          <div class="detail-spine" aria-hidden="true">
            ${ringMarkup()}
          </div>

          <section
            class="detail-right-page"
            tabindex="0"
            aria-label="${project.title} 完整 PPT，可纵向滚动"
          >
            <header class="detail-scroll-header">
              <div>
                <p>PROJECT FILE · ${project.format.toUpperCase()}</p>
                <strong>${project.title}</strong>
              </div>
              <span class="detail-page-count">
                <b data-current-slide>01</b>
                /
                ${String(project.slideCount).padStart(2, "0")}
              </span>
            </header>

            <div class="detail-slides">
              ${Array.from(
                { length: project.slideCount },
                (_, index) => slideMarkup(project, index + 1),
              ).join("")}
            </div>

            <p class="detail-complete-note" data-complete-note>已浏览全部 PPT</p>
          </section>

          <div class="detail-progress" aria-hidden="true">
            <span class="detail-progress-label">PPT<br />${project.number}</span>
            <i><b data-scroll-progress></b></i>
            <em></em>
          </div>
        </article>
      </section>

      <p class="detail-scroll-hint">
        <span aria-hidden="true">↕</span>
        滚动右侧查看完整项目
      </p>
    </main>
  `;

  const root = container.querySelector("[data-page='project-detail-v3']");
  const rightPage = root.querySelector(".detail-right-page");
  const progressBar = root.querySelector("[data-scroll-progress]");
  const currentSlide = root.querySelector("[data-current-slide]");
  const completeNote = root.querySelector("[data-complete-note]");
  const slides = [...root.querySelectorAll("[data-detail-slide]")];

  const updateScrollState = () => {
    const maximum = rightPage.scrollHeight - rightPage.clientHeight;
    const progress = maximum > 0 ? rightPage.scrollTop / maximum : 0;
    progressBar.style.height = `${Math.max(4, progress * 100)}%`;
    completeNote.classList.toggle("is-visible", progress > 0.965);

    const marker = rightPage.getBoundingClientRect().top + 92;
    let nearestSlide = slides[0];
    let nearestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide) => {
      const distance = Math.abs(slide.getBoundingClientRect().top - marker);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSlide = slide;
      }
    });

    currentSlide.textContent = String(nearestSlide?.dataset.detailSlide || 1).padStart(2, "0");
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") location.hash = "project";
  };

  root.querySelector("[data-back-to-projects]").addEventListener("click", () => {
    location.hash = "project";
  });
  rightPage.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("keydown", handleKeydown);
  updateScrollState();

  console.log(`ProjectDetail V3 mounted: ${project.id}`);

  return () => {
    document.title = previousTitle;
    rightPage.removeEventListener("scroll", updateScrollState);
    window.removeEventListener("keydown", handleKeydown);
  };
}
