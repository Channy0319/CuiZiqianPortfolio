import { PROJECTS } from "./ProjectNotebookV3.js";
import {
  VIDEO_OVERVIEW,
  VIDEO_PROJECTS,
  VISUAL_OVERVIEW,
  VISUAL_THEMES,
} from "./MediaNotebookV3.js";
import { mountHorizontalNotebookGallery } from "./HorizontalNotebookGalleryV3.js";

function ringMarkup() {
  return Array.from({ length: 12 }, () => "<span></span>").join("");
}

function decorMarkup() {
  return `
    <div class="scene-still-life" aria-hidden="true">
      <span class="scene-mini scene-coffee"></span>
      <span class="scene-mini scene-plant"></span>
      <span class="scene-mini scene-flower"></span>
      <img
        class="scene-asset scene-leaves"
        src="/assets/project-notebook/sprites-v3/two-leaves-v3.webp"
        alt=""
        loading="eager" decoding="async" fetchpriority="low" width="1254" height="1254"
      />
      <span class="scene-polaroid"><i></i></span>
      <span class="scene-mini-crop scene-button"></span>
      <img
        class="scene-asset scene-binder"
        src="/assets/project-notebook/sprites-v3/binder-clips-v3.webp"
        alt=""
        loading="eager" decoding="async" fetchpriority="low" width="1254" height="1254"
      />
      <img
        class="scene-asset scene-pencil-set"
        src="/assets/project-notebook/sprites-v3/pencil-v3.webp"
        alt=""
        loading="eager" decoding="async" fetchpriority="low" width="1254" height="1254"
      />
      <img
        class="scene-asset scene-yarn"
        src="/assets/project-notebook/sprites-v3/yarn-v3.webp"
        alt=""
        loading="eager" decoding="async" fetchpriority="low" width="1254" height="1254"
      />
      <span class="scene-mini-crop scene-paperclip"></span>
      <span class="scene-mini-crop scene-pushpin"></span>
    </div>
  `;
}

function listProjectMarkup(project) {
  return `
    <button
      class="scene-project-card"
      type="button"
      data-open-project="${project.id}"
      aria-label="打开项目：${project.title}"
    >
      <span class="scene-project-number">${project.number}</span>
      <span class="scene-project-copy">
        <strong>${project.title}</strong>
        <span>${project.description}</span>
        <small>${project.date}<i></i>${project.team}</small>
      </span>
      <span class="scene-project-cover">
        <img src="${project.image}" alt="${project.alt}" width="1200" height="675" loading="lazy" decoding="async" />
        <em>Open project ↗</em>
      </span>
    </button>
  `;
}

function listLeftMarkup() {
  return `
    <section class="scene-list-left">
      <header class="scene-list-heading">
        <p>PROJECTS · 2024–2026</p>
        <h1 tabindex="-1">Strategy<br />Notebook</h1>
        <strong lang="zh-CN">项目策略与思考</strong>
      </header>

      <div class="scene-approach-note">
        <span>Approach</span>
        <ul>
          <li>Research</li>
          <li>Insight</li>
          <li>Direction</li>
          <li>Strategy</li>
        </ul>
      </div>

      <blockquote>
        “Good strategy<br />
        connects the dots<br />
        before they trend.”
      </blockquote>
    </section>
  `;
}

function listRightMarkup() {
  return `
    <section class="scene-list-right" aria-label="Selected projects">
      <p class="scene-page-kicker">SELECTED WORK · THREE PROJECTS</p>
      <div class="scene-project-list">
        ${PROJECTS.map(listProjectMarkup).join("")}
      </div>
    </section>
  `;
}

function detailMetadataMarkup(project) {
  return `
    <dl class="scene-detail-meta">
      <div><dt>Category</dt><dd>${project.category}</dd></div>
      <div><dt>Time</dt><dd>${project.date}</dd></div>
      <div><dt>Role</dt><dd>${project.role}</dd></div>
      <div><dt>Team</dt><dd>${project.team}</dd></div>
      <div><dt>Format</dt><dd>${project.format}</dd></div>
    </dl>
  `;
}

function detailLeftMarkup(project) {
  return `
    <section class="scene-detail-left">
      <button class="scene-back-projects" type="button" data-back-projects>
        <span aria-hidden="true">←</span>
        Back to Project
      </button>

      <header class="scene-detail-heading">
        <p>${project.eyebrow}</p>
        <h1 tabindex="-1">
          ${project.titleLines.map((line) => `<span>${line}</span>`).join("")}
        </h1>
        <strong>${project.subtitle}</strong>
        <small>${project.year}</small>
      </header>

      ${detailMetadataMarkup(project)}

      <section class="scene-summary-note">
        <span></span>
        <h2>项目简介</h2>
        <p>${project.detailDescription}</p>
      </section>

      <ul class="scene-keywords" aria-label="Keywords">
        ${project.keywords.map((keyword) => `<li>${keyword}</li>`).join("")}
      </ul>

      <p class="scene-detail-enlarge-hint">
        <span aria-hidden="true">⌕</span>
        <strong>点击右侧 PPT 页面查看大图</strong>
        <small>Click a slide to enlarge</small>
      </p>

      <em class="scene-signature">Cz.</em>
    </section>
  `;
}

function slideMarkup(project, index) {
  const number = String(index).padStart(2, "0");
  const base = `/projects/strategy/${project.id}/images/slide${number}`;
  const high = `${base}-${project.slideWidth}.webp`;
  const low = `${base}-960.webp`;

  return `
    <figure
      class="scene-slide"
      data-scene-slide="${index}"
      data-enlarge-slide="${index}"
      data-slide-src="${high}"
      role="button"
      tabindex="0"
      aria-label="放大查看第 ${index} 页"
    >
      <picture>
        <source media="(max-width: 760px)" srcset="${low}" />
        <img
          src="${high}"
          alt="${project.title} PPT 第 ${index} 页"
          width="${project.slideWidth}"
          height="${project.slideWidth * 0.5625}"
          loading="${index <= 2 ? "eager" : "lazy"}"
          decoding="async"
          ${index <= 2 ? 'fetchpriority="high"' : ""}
        />
      </picture>
      <figcaption>
        <span>${number}</span><i></i>${String(project.slideCount).padStart(2, "0")}
      </figcaption>
    </figure>
  `;
}

function detailRightMarkup(project) {
  return `
    <section class="scene-detail-right" aria-label="${project.title} 完整 PPT">
      <header class="scene-scroll-header">
        <div>
          <p>PROJECT FILE · ${project.format.toUpperCase()}</p>
          <strong>${project.title}</strong>
        </div>
        <div class="scene-mobile-presentation">
          <strong>Presentation</strong>
          <small>${project.slideCount} Slides</small>
        </div>
        <span class="scene-page-count">
          <b data-current-slide>01</b>
          /
          ${String(project.slideCount).padStart(2, "0")}
        </span>
      </header>

      <div class="scene-slides">
        ${Array.from(
          { length: project.slideCount },
          (_, index) => slideMarkup(project, index + 1),
        ).join("")}
      </div>

      <p class="scene-complete-note">已浏览全部 PPT</p>
      <nav class="scene-mobile-footer" aria-label="Project footer navigation">
        <button type="button" data-back-projects>← Project</button>
        <button type="button" data-back-table>Craft Table</button>
      </nav>
    </section>
  `;
}

function tabsMarkup() {
  return PROJECTS.map(
    (project) => `
      <span
        class="scene-tab scene-tab-${project.number}"
        aria-hidden="true"
      >
        ${project.number}
      </span>
    `,
  ).join("");
}

function mediaOverviewLeftMarkup(chapter) {
  const data = chapter === "visual" ? VISUAL_OVERVIEW : VIDEO_OVERVIEW;
  return `
    <section class="scene-media-left scene-media-overview">
      <header>
        <p>${data.kicker}</p>
        <h1 tabindex="-1">${data.title}</h1>
        <strong>${data.englishTitle}</strong>
      </header>
      ${data.lead ? `<p class="scene-media-lead">${data.lead}</p>` : ""}
      <p class="scene-media-description">${data.description}</p>
      <dl class="scene-media-facts">
        ${data.year ? `<div><dt>Year</dt><dd>${data.year}</dd></div>` : ""}
        <div><dt>Format</dt><dd>${data.format}</dd></div>
      </dl>
      <section class="scene-media-principles">
        <p>${chapter === "visual" ? "DESIGN PRINCIPLES" : "EDITORIAL APPROACH"}</p>
        <div>
          ${data.principles
            .map(
              ([title, copy]) => `
                <article>
                  <strong>${title}</strong>
                  <span>${copy}</span>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
      <p class="scene-media-guide">
        ${chapter === "visual" ? "点击专题封面查看详情" : "点击视频封面观看"}
        <small>${chapter === "visual" ? "Click a theme cover to explore" : "Click a video to watch"}</small>
      </p>
    </section>
  `;
}

function galleryShellMarkup({ title, label, cards, kind }) {
  return `
    <section class="scene-horizontal-section scene-horizontal-${kind}">
      <header class="scene-horizontal-heading">
        <div>
          <p>${label}</p>
          <h2>${title}</h2>
        </div>
        <div class="scene-gallery-controls">
          <span class="scene-gallery-arrow" aria-hidden="true">←</span>
          <p><b data-gallery-current>01</b> / <span data-gallery-total>01</span></p>
          <span class="scene-gallery-arrow" aria-hidden="true">→</span>
        </div>
      </header>
      <div
        class="scene-horizontal-gallery"
        data-horizontal-gallery
        tabindex="0"
        aria-label="${title}，可横向滚动"
      >
        ${cards}
      </div>
      <p class="scene-gallery-instruction">横向滑动浏览 · Scroll sideways</p>
    </section>
  `;
}

function visualThemeCardMarkup(theme) {
  return `
    <button
      class="scene-theme-card"
      type="button"
      data-open-theme="${theme.id}"
      aria-label="打开专题：${theme.title}"
    >
      <span class="scene-media-image">
        <img
          src="${theme.cover}"
          alt="${theme.title} 专题总预览"
          width="960"
          height="540"
          loading="${theme.number === "01" ? "eager" : "lazy"}"
          decoding="async"
          ${theme.number === "01" ? 'fetchpriority="high"' : ""}
        />
      </span>
    </button>
  `;
}

function visualListRightMarkup() {
  const columns = [];
  for (let index = 0; index < VISUAL_THEMES.length; index += 2) {
    columns.push(`
      <div class="scene-theme-column" data-gallery-item>
        ${VISUAL_THEMES.slice(index, index + 2).map(visualThemeCardMarkup).join("")}
      </div>
    `);
  }
  return galleryShellMarkup({
    title: "全部专题",
    label: "ALL THEMES",
    kind: "themes",
    cards: columns.join(""),
  });
}

function visualDetailLeftMarkup(theme) {
  return `
    <section class="scene-media-left scene-media-detail">
      <button class="scene-back-projects" type="button" data-back-section>
        <span aria-hidden="true">←</span> Back to Visual
      </button>
      <header>
        <p>VISUAL DESIGN / OTT THEMATIC DESIGN</p>
        <h1 tabindex="-1">
          ${theme.title
            .split(" ")
            .map((part) => `<span>${part}</span>`)
            .join("")}
        </h1>
        <strong>Sohu OTT Thematic Design</strong>
      </header>
      <dl class="scene-media-facts">
        <div><dt>Year</dt><dd>${theme.year}</dd></div>
        <div><dt>Format</dt><dd>${theme.posterCount} Posters</dd></div>
      </dl>
      <section class="scene-media-note">
        <span></span>
        <h2>专题简介</h2>
        <p>${theme.description}</p>
      </section>
      <div class="scene-media-keywords">
        <p>DESIGN KEYWORDS</p>
        <ul>${theme.keywords.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
    </section>
  `;
}

function visualDetailRightMarkup(theme) {
  const cards = theme.posters
    .map(
      (src, index) => `
        <figure class="scene-poster-card">
          <img
            src="${src}"
            alt="${theme.title} 海报 ${String(index + 1).padStart(2, "0")}"
            loading="${index < 2 ? "eager" : "lazy"}"
            decoding="async"
          />
          <figcaption>${String(index + 1).padStart(2, "0")} / ${String(theme.posterCount).padStart(2, "0")}</figcaption>
        </figure>
      `,
    )
    .join("");
  return `
    <section class="scene-poster-section">
      <header class="scene-poster-heading">
        <div><p>THEME POSTERS</p><h2>${theme.title}</h2></div>
        <span><b>01</b> / ${String(theme.posterCount).padStart(2, "0")}</span>
      </header>
      <div class="scene-poster-stack">${cards}</div>
      <p class="scene-complete-note">已浏览全部海报</p>
    </section>
  `;
}

function videoCardMarkup(video) {
  return `
    <button
      class="scene-video-card"
      type="button"
      data-gallery-item
      data-play-video="${video.id}"
      style="--video-aspect:${video.width / video.height}"
      aria-label="播放视频：${video.title}"
    >
      <span class="scene-video-cover">
        <img
          src="${video.coverSrc}"
          alt="${video.title} 视频封面"
          width="${video.width}"
          height="${video.height}"
          loading="${video.number === "01" ? "eager" : "lazy"}"
          decoding="async"
          ${video.number === "01" ? 'fetchpriority="high"' : ""}
        />
        <i aria-hidden="true">▶</i>
      </span>
      <span class="scene-media-card-copy">
        <small>${video.number} · ${video.category}</small>
        <strong>${video.title}</strong>
        <em>Play Video ▶</em>
      </span>
    </button>
  `;
}

function videoListRightMarkup() {
  return galleryShellMarkup({
    title: "全部视频",
    label: "SELECTED VIDEO WORK",
    kind: "videos",
    cards: VIDEO_PROJECTS.map(videoCardMarkup).join(""),
  });
}

function parseRoute(route) {
  const [chapter, itemId] = route.split("/");
  if (chapter === "visual") {
    const theme = VISUAL_THEMES.find((item) => item.id === itemId);
    return { chapter, mode: theme ? "detail" : "list", theme };
  }
  if (chapter === "video") {
    return { chapter, mode: "list", video: null };
  }
  const project = PROJECTS.find((item) => item.id === itemId);
  return { chapter: "project", mode: project ? "detail" : "list", project };
}

export function ProjectSceneV3(container, initialRoute = "project") {
  const previousTitle = document.title;

  container.innerHTML = `
    <main class="project-scene-v3" data-page="project-scene-v3" data-mode="list">
      <button class="scene-table-back" type="button" data-back-table>
        <span aria-hidden="true">←</span>
        Craft Table
      </button>

      <section class="project-scene-stage" aria-label="Project notebook">
        <div class="project-scene-frame">
          ${decorMarkup()}

          <article class="project-scene-notebook" data-scene-notebook aria-busy="false">
            <nav class="scene-mobile-nav" aria-label="Project navigation">
              <button class="scene-mobile-back" type="button" data-back-projects>
                <span aria-hidden="true">←</span>
                Project
              </button>
              <button class="scene-mobile-table" type="button" data-back-table>
                Craft Table
              </button>
            </nav>

            <div class="scene-page scene-left-page">
              <div class="scene-page-content" data-left-content></div>
            </div>

            <div class="scene-spine" aria-hidden="true">
              ${ringMarkup()}
            </div>

            <div
              class="scene-page scene-right-page"
              tabindex="0"
              aria-label="Notebook right page"
            >
              <div class="scene-page-content" data-right-content></div>
            </div>

            <div class="scene-tabs" data-scene-tabs>
              ${tabsMarkup()}
            </div>

            <div class="scene-progress" data-scene-progress aria-hidden="true">
              <span data-progress-label>PPT<br />01</span>
              <i><b data-scroll-progress></b></i>
              <em></em>
            </div>
          </article>
        </div>
      </section>

      <p class="scene-hint" data-scene-hint>Choose a project from the notebook</p>
      <p class="scene-live" aria-live="polite" aria-atomic="true"></p>

      <div
        class="scene-slide-lightbox"
        data-slide-lightbox
        role="dialog"
        aria-modal="true"
        aria-labelledby="scene-lightbox-title"
        hidden
      >
        <button
          class="scene-lightbox-backdrop"
          type="button"
          data-close-lightbox
          aria-label="关闭 PPT 预览"
        ></button>
        <div class="scene-lightbox-panel">
          <header>
            <span aria-hidden="true"></span>
            <p id="scene-lightbox-title" data-lightbox-title>01 / 15</p>
            <button type="button" data-close-lightbox aria-label="关闭 PPT 预览">×</button>
          </header>
          <button
            class="scene-lightbox-nav scene-lightbox-prev"
            type="button"
            data-lightbox-prev
            aria-label="查看上一页"
          >
            ‹
          </button>
          <img data-lightbox-image alt="" data-lightbox-image-button />
          <button
            class="scene-lightbox-nav scene-lightbox-next"
            type="button"
            data-lightbox-next
            aria-label="查看下一页"
          >
            ›
          </button>
        </div>
      </div>

      <div
        class="scene-video-overlay"
        data-video-overlay
        role="dialog"
        aria-modal="true"
        aria-labelledby="scene-video-overlay-title"
        hidden
      >
        <button
          class="scene-video-overlay-backdrop"
          type="button"
          data-close-video-overlay
          aria-label="关闭视频播放器"
        ></button>
        <div class="scene-video-overlay-panel">
          <header>
            <div>
              <small data-video-overlay-category></small>
              <strong id="scene-video-overlay-title" data-video-overlay-title></strong>
            </div>
            <button type="button" data-close-video-overlay aria-label="关闭视频播放器">×</button>
          </header>
          <button class="scene-video-overlay-nav is-previous" type="button" data-video-overlay-previous aria-label="上一条视频">‹</button>
          <video controls preload="none" data-video-overlay-player></video>
          <button class="scene-video-overlay-nav is-next" type="button" data-video-overlay-next aria-label="下一条视频">›</button>
        </div>
      </div>
    </main>
  `;

  const root = container.querySelector("[data-page='project-scene-v3']");
  const notebook = root.querySelector("[data-scene-notebook]");
  const leftContent = root.querySelector("[data-left-content]");
  const rightContent = root.querySelector("[data-right-content]");
  const rightPage = root.querySelector(".scene-right-page");
  const tabs = root.querySelector("[data-scene-tabs]");
  const progress = root.querySelector("[data-scene-progress]");
  const progressBar = root.querySelector("[data-scroll-progress]");
  const progressLabel = root.querySelector("[data-progress-label]");
  const hint = root.querySelector("[data-scene-hint]");
  const live = root.querySelector(".scene-live");
  const lightbox = root.querySelector("[data-slide-lightbox]");
  const lightboxImage = root.querySelector("[data-lightbox-image]");
  const lightboxTitle = root.querySelector("[data-lightbox-title]");
  const videoOverlay = root.querySelector("[data-video-overlay]");
  const videoOverlayPlayer = root.querySelector("[data-video-overlay-player]");
  const videoOverlayTitle = root.querySelector("[data-video-overlay-title]");
  const videoOverlayCategory = root.querySelector("[data-video-overlay-category]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let state;
  let swapTimer;
  let focusTimer;
  let lightboxSlideIndex = 1;
  let lightboxScrollY = 0;
  let lightboxKind = "slides";
  let lightboxAssets = [];
  let cleanupGallery = () => {};
  let activeVideoIndex = 0;

  const unlockMobileScroll = () => {
    if (document.body.style.position !== "fixed") return;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo({ top: lightboxScrollY, behavior: "instant" });
  };

  const closeLightbox = () => {
    if (lightbox.hidden) return;
    lightbox.classList.remove("is-open");
    unlockMobileScroll();
    window.setTimeout(() => {
      lightbox.hidden = true;
      lightboxImage.removeAttribute("src");
    }, reducedMotion.matches ? 0 : 180);
  };

  const showLightboxSlide = (requestedIndex) => {
    const total = state.project.slideCount;
    lightboxSlideIndex = ((requestedIndex - 1 + total) % total) + 1;
    const slideNumber = String(lightboxSlideIndex).padStart(2, "0");
    const base = `/projects/strategy/${state.project.id}/images/slide${slideNumber}`;
    lightboxImage.src = `${base}-${state.project.slideWidth}.webp`;
    lightboxImage.alt = `${state.project.title} PPT 第 ${lightboxSlideIndex} 页大图`;
    lightboxTitle.textContent = `${lightboxSlideIndex} / ${total}`;
  };

  const showPosterLightbox = (requestedIndex) => {
    const total = lightboxAssets.length;
    lightboxSlideIndex = ((requestedIndex % total) + total) % total;
    const asset = lightboxAssets[lightboxSlideIndex];
    lightboxImage.src = asset.src;
    lightboxImage.alt = asset.alt;
    lightboxTitle.textContent = `${state.theme.title} · ${String(lightboxSlideIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  };

  const showLightboxItem = (requestedIndex) => {
    if (lightboxKind === "posters") {
      showPosterLightbox(requestedIndex);
    } else {
      showLightboxSlide(requestedIndex);
    }
  };

  const openLightbox = (trigger) => {
    lightboxKind = "slides";
    showLightboxSlide(Number(trigger.dataset.enlargeSlide));
    if (window.innerWidth <= 850) {
      lightboxScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${lightboxScrollY}px`;
      document.body.style.width = "100%";
    }
    lightbox.hidden = false;
    requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
      lightbox
        .querySelector("[data-close-lightbox]:last-child")
        ?.focus({ preventScroll: true });
    });
  };

  const openPosterLightbox = (trigger) => {
    lightboxKind = "posters";
    lightboxAssets = [...rightContent.querySelectorAll("[data-gallery-image]")].map(
      (item) => ({
        src: item.dataset.galleryImage,
        alt: item.querySelector("img")?.alt || state.theme.title,
      }),
    );
    showPosterLightbox(Number(trigger.dataset.openPoster));
    lightboxScrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${lightboxScrollY}px`;
    document.body.style.width = "100%";
    lightbox.hidden = false;
    requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
      lightbox
        .querySelector("[data-close-lightbox]:last-child")
        ?.focus({ preventScroll: true });
    });
  };

  const closeVideoOverlay = () => {
    if (videoOverlay.hidden) return;
    videoOverlayPlayer.pause();
    videoOverlayPlayer.currentTime = 0;
    videoOverlay.classList.remove("is-open");
    unlockMobileScroll();
    window.setTimeout(() => {
      videoOverlay.hidden = true;
      videoOverlayPlayer.removeAttribute("src");
      videoOverlayPlayer.removeAttribute("poster");
      videoOverlayPlayer.load();
    }, reducedMotion.matches ? 0 : 180);
  };

  const showOverlayVideo = (requestedIndex) => {
    activeVideoIndex =
      ((requestedIndex % VIDEO_PROJECTS.length) + VIDEO_PROJECTS.length) %
      VIDEO_PROJECTS.length;
    const video = VIDEO_PROJECTS[activeVideoIndex];
    videoOverlayPlayer.pause();
    videoOverlayPlayer.src = video.videoSrc;
    videoOverlayPlayer.poster = video.posterSrc;
    videoOverlayPlayer.width = video.width;
    videoOverlayPlayer.height = video.height;
    videoOverlayPlayer.style.aspectRatio = `${video.width} / ${video.height}`;
    videoOverlayTitle.textContent = video.title;
    videoOverlayCategory.textContent = `${video.category} · ${String(activeVideoIndex + 1).padStart(2, "0")} / ${String(VIDEO_PROJECTS.length).padStart(2, "0")}`;
    videoOverlayPlayer.load();
  };

  const openVideoOverlay = (videoId) => {
    const index = VIDEO_PROJECTS.findIndex((video) => video.id === videoId);
    if (index < 0) return;
    closeLightbox();
    showOverlayVideo(index);
    lightboxScrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${lightboxScrollY}px`;
    document.body.style.width = "100%";
    videoOverlay.hidden = false;
    videoOverlayPlayer.play().catch(() => {});
    requestAnimationFrame(() => {
      videoOverlay.classList.add("is-open");
      videoOverlayPlayer.focus({ preventScroll: true });
    });
  };

  const updateScrollState = () => {
    if (state?.chapter !== "project" || state?.mode !== "detail") return;

    const maximum = rightPage.scrollHeight - rightPage.clientHeight;
    const readingMobile = window.innerWidth <= 850;
    const scrollProgress = readingMobile
      ? window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      : rightPage.scrollTop / Math.max(1, maximum);

    progressBar.style.height = `${Math.max(4, Math.min(100, scrollProgress * 100))}%`;

    const slides = [...rightContent.querySelectorAll("[data-scene-slide]")];
    const marker = readingMobile ? 110 : rightPage.getBoundingClientRect().top + 105;
    let nearest = slides[0];
    let nearestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide) => {
      const distance = Math.abs(slide.getBoundingClientRect().top - marker);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = slide;
      }
    });

    const current = String(nearest?.dataset.sceneSlide || 1).padStart(2, "0");
    rightContent.querySelector("[data-current-slide]")?.replaceChildren(current);
  };

  const applyState = (nextState, { focusHeading = false } = {}) => {
    rightContent.querySelectorAll("video").forEach((video) => video.pause());
    cleanupGallery();
    cleanupGallery = () => {};
    closeVideoOverlay();
    closeLightbox();
    state = nextState;
    rightPage.scrollTop = 0;
    rightPage.scrollLeft = 0;
    window.scrollTo({ top: 0, behavior: "instant" });

    root.dataset.mode = state.mode;
    root.dataset.chapter = state.chapter;
    tabs.hidden = !(state.chapter === "project" && state.mode === "list");
    progress.hidden = !(state.chapter === "project" && state.mode === "detail");

    if (state.chapter === "project") {
      if (state.mode === "detail") {
        leftContent.innerHTML = detailLeftMarkup(state.project);
        rightContent.innerHTML = detailRightMarkup(state.project);
        progressLabel.innerHTML = `PPT<br />${state.project.number}`;
        progressBar.style.height = "4%";
        hint.textContent = "Scroll the notebook’s right page";
        live.textContent = `已打开项目：${state.project.title}`;
        document.title = `${state.project.title} — Cui Ziqian`;
      } else {
        leftContent.innerHTML = listLeftMarkup();
        rightContent.innerHTML = listRightMarkup();
        hint.textContent = "Choose a project from the notebook";
        live.textContent = "已返回 Project 项目列表";
        document.title = "Project Notebook — Cui Ziqian";
      }
    }

    if (state.chapter === "visual") {
      if (state.mode === "detail") {
        leftContent.innerHTML = visualDetailLeftMarkup(state.theme);
        rightContent.innerHTML = visualDetailRightMarkup(state.theme);
        hint.textContent = "Explore the theme posters";
        live.textContent = `已打开 Visual 专题：${state.theme.title}`;
        document.title = `${state.theme.title} — Cui Ziqian`;
      } else {
        leftContent.innerHTML = mediaOverviewLeftMarkup("visual");
        rightContent.innerHTML = visualListRightMarkup();
        hint.textContent = "Choose a visual theme";
        live.textContent = "已打开 Visual 专题列表";
        document.title = "Visual Notebook — Cui Ziqian";
      }
    }

    if (state.chapter === "video") {
      leftContent.innerHTML = mediaOverviewLeftMarkup("video");
      rightContent.innerHTML = videoListRightMarkup();
      hint.textContent = "Choose a video";
      live.textContent = "已打开 Video 作品列表";
      document.title = "Video Notebook — Cui Ziqian";
    }

    const mobileBack = root.querySelector(".scene-mobile-back");
    if (mobileBack) {
      const label = state.chapter === "project" ? "Project" : state.chapter === "visual" ? "Visual" : "Video";
      mobileBack.innerHTML = `<span aria-hidden="true">←</span> ${label}`;
    }

    if (state.chapter !== "project") {
      cleanupGallery = mountHorizontalNotebookGallery(rightContent, (index, total) => {
        hint.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")} · Scroll sideways`;
      });
    }

    updateScrollState();

    if (focusHeading) {
      clearTimeout(focusTimer);
      focusTimer = setTimeout(() => {
        leftContent.querySelector("h1")?.focus({ preventScroll: true });
      }, reducedMotion.matches ? 0 : 210);
    }
  };

  const update = (route, options = {}) => {
    if (route.startsWith("video/")) {
      history.replaceState(null, "", "#video");
      route = "video";
    }
    const nextState = parseRoute(route);
    const sameState =
      state?.chapter === nextState.chapter &&
      state?.mode === nextState.mode &&
      state?.project?.id === nextState.project?.id &&
      state?.theme?.id === nextState.theme?.id &&
      state?.video?.id === nextState.video?.id;

    if (sameState) return;

    clearTimeout(swapTimer);
    notebook.setAttribute("aria-busy", "true");

    if (!state || reducedMotion.matches) {
      applyState(nextState, options);
      notebook.setAttribute("aria-busy", "false");
      return;
    }

    notebook.classList.add("is-swapping");
    swapTimer = setTimeout(() => {
      applyState(nextState, options);
      requestAnimationFrame(() => {
        notebook.classList.remove("is-swapping");
        notebook.setAttribute("aria-busy", "false");
      });
    }, 170);
  };

  const handleClick = (event) => {
    if (event.target.closest("[data-video-overlay-previous]")) {
      showOverlayVideo(activeVideoIndex - 1);
      return;
    }

    if (event.target.closest("[data-video-overlay-next]")) {
      showOverlayVideo(activeVideoIndex + 1);
      return;
    }

    if (event.target.closest("[data-close-video-overlay]")) {
      closeVideoOverlay();
      return;
    }

    if (event.target.closest("[data-lightbox-prev]")) {
      showLightboxItem(lightboxSlideIndex - 1);
      return;
    }

    if (event.target.closest("[data-lightbox-next]")) {
      showLightboxItem(lightboxSlideIndex + 1);
      return;
    }

    if (event.target.closest("[data-lightbox-image-button]")) {
      const imageRect = lightboxImage.getBoundingClientRect();
      showLightboxItem(
        event.clientX < imageRect.left + imageRect.width / 2
          ? lightboxSlideIndex - 1
          : lightboxSlideIndex + 1,
      );
      return;
    }

    const zoomButton = event.target.closest("[data-enlarge-slide]");
    if (zoomButton) {
      openLightbox(zoomButton);
      return;
    }

    const posterButton = event.target.closest("[data-open-poster]");
    if (posterButton) {
      openPosterLightbox(posterButton);
      return;
    }

    if (event.target.closest("[data-close-lightbox]")) {
      closeLightbox();
      return;
    }

    const projectButton = event.target.closest("[data-open-project]");
    if (projectButton) {
      location.hash = `project/${projectButton.dataset.openProject}`;
      return;
    }

    const themeButton = event.target.closest("[data-open-theme]");
    if (themeButton) {
      location.hash = `visual/${themeButton.dataset.openTheme}`;
      return;
    }

    const videoButton = event.target.closest("[data-play-video]");
    if (videoButton) {
      openVideoOverlay(videoButton.dataset.playVideo);
      return;
    }

    if (event.target.closest("[data-back-section], [data-back-projects]")) {
      location.hash = state?.chapter || "project";
      return;
    }

    if (event.target.closest("[data-back-table]")) {
      location.hash = "";
    }
  };

  const handleKeydown = (event) => {
    if (!videoOverlay.hidden) {
      if (event.key === "Escape") closeVideoOverlay();
      if (event.key === "ArrowLeft") showOverlayVideo(activeVideoIndex - 1);
      if (event.key === "ArrowRight") showOverlayVideo(activeVideoIndex + 1);
      return;
    }

    if (!lightbox.hidden) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showLightboxItem(lightboxSlideIndex - 1);
      if (event.key === "ArrowRight") showLightboxItem(lightboxSlideIndex + 1);
      return;
    }

    const slideTrigger = event.target.closest("[data-enlarge-slide]");
    if (slideTrigger && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openLightbox(slideTrigger);
      return;
    }

    if (event.key === "Escape" && state?.mode === "detail") {
      location.hash = state.chapter;
    }
  };

  root.addEventListener("click", handleClick);
  rightPage.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("keydown", handleKeydown);

  const normalizedInitialRoute = initialRoute.startsWith("video/") ? "video" : initialRoute;
  if (normalizedInitialRoute !== initialRoute) history.replaceState(null, "", "#video");
  applyState(parseRoute(normalizedInitialRoute));
  console.log("ProjectScene V3 mounted");

  return {
    update(route) {
      update(route, { focusHeading: true });
    },
    destroy() {
      clearTimeout(swapTimer);
      clearTimeout(focusTimer);
      root.removeEventListener("click", handleClick);
      rightPage.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("keydown", handleKeydown);
      cleanupGallery();
      rightContent.querySelectorAll("video").forEach((video) => video.pause());
      closeVideoOverlay();
      unlockMobileScroll();
      document.title = previousTitle;
    },
  };
}
