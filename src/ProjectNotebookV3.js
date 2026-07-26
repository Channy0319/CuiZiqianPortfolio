export const PROJECTS = [
  {
    id: "ambrosial",
    number: "01",
    title: "安慕希新品策略",
    titleLines: ["安慕希", "新品策略项目"],
    eyebrow: "BRAND STRATEGY / PRODUCT INNOVATION",
    subtitle: "品牌年轻化与健康新奶力战略",
    description:
      "通过洞察年轻群体的消费趋势，从产品定位、包装设计与传播策略三个方向，构建兼具品牌价值与高质价比竞争优势的新品概念。",
    detailDescription:
      "在阳狮集团李奥贝纳实习期间，参与安慕希品牌策略项目，围绕消费分级趋势和常温酸奶价格竞争参与消费者研究、竞品分析、新品概念探索及包装方向讨论，并协助形成“草原酸奶”产品概念。",
    category: "Brand Strategy",
    role: "Research / Strategy Support / Concept Development",
    format: "15 Slides",
    year: "2024",
    slideCount: 15,
    slideWidth: 1920,
    keywords: ["品牌策略", "消费者洞察", "产品创新", "草原酸奶"],
    date: "2024.07 – 2024.09",
    team: "Leo Burnett",
    image: "/assets/project-notebook/ambrosial-cover.webp",
    alt: "安慕希新品上市策略提案封面",
  },
  {
    id: "volvo",
    number: "02",
    title: "沃尔沃 XC90 户外投放方案",
    titleLines: ["沃尔沃 XC90", "户外投放方案"],
    eyebrow: "BRAND STRATEGY / OUTDOOR MEDIA",
    subtitle: "目标人群、户外媒介与城市投放策略",
    description:
      "围绕沃尔沃 XC90 目标人群、户外媒介场景与城市投放策略完成方案梳理，并以完整 Project 呈现项目逻辑和视觉表达。",
    detailDescription:
      "围绕沃尔沃 XC90 目标人群、户外媒介场景与城市投放策略完成方案梳理，并以完整 Project 呈现项目逻辑和视觉表达。",
    category: "Project Design",
    role: "Strategy / Visual / Presentation",
    format: "26 Slides",
    year: "2024",
    slideCount: 26,
    slideWidth: 1280,
    keywords: ["目标人群", "户外媒介", "城市投放", "视觉表达"],
    date: "2024.04",
    team: "Course Project",
    image: "/assets/project-notebook/volvo-xc90-cover.webp",
    alt: "Volvo XC90 品牌营销方案封面",
  },
  {
    id: "zaoshu",
    number: "03",
    title: "枣叔的店内容营销分析",
    titleLines: ["枣叔的店", "内容营销分析"],
    eyebrow: "CONTENT MARKETING / BRAND GROWTH",
    subtitle: "白牌食品品牌的内容增长与信任建立",
    description:
      "围绕缺少传统品牌背书的“白牌”电商食品品牌，分析其内容生产、平台分发、内容产品与购买转化链路。",
    detailDescription:
      "围绕缺少传统品牌背书的“白牌”电商食品品牌，分析其内容生产、平台分发、内容产品与购买转化链路，并从产品透明化、品牌人格与用户口碑中提炼消费者信任的建立机制。",
    category: "Content Marketing",
    role: "Research / Strategy / Presentation",
    format: "16 Slides",
    year: "2026",
    slideCount: 16,
    slideWidth: 1920,
    keywords: ["内容营销", "品牌增长", "用户信任", "购买转化"],
    date: "2026",
    team: "Independent Project",
    image: "/assets/project-notebook/zaoshu-cover.webp",
    alt: "枣叔的店白牌零食策略提案封面",
  },
];

function projectMarkup(project) {
  return `
    <button class="notebook-project" type="button" data-project-id="${project.id}">
      <span class="project-number">${project.number}</span>
      <span class="project-copy">
        <strong>${project.title}</strong>
        <span>${project.description}</span>
        <small>${project.date}<i></i>${project.team}</small>
      </span>
      <span class="project-cover-frame">
        <img src="${project.image}" alt="${project.alt}" width="1200" height="675" />
        <em>Open project ↗</em>
      </span>
    </button>
  `;
}

function tabMarkup(project) {
  return `
    <button
      class="notebook-tab notebook-tab-${project.number}"
      type="button"
      data-tab-project="${project.id}"
      aria-label="Go to project ${project.number}"
    >
      ${project.number}
    </button>
  `;
}

function ringMarkup() {
  return Array.from({ length: 11 }, () => `<span></span>`).join("");
}

function decorMarkup() {
  return `
    <div class="project-decor" aria-hidden="true">
      <span class="project-prop project-succulent"></span>
      <span class="project-prop project-coffee"></span>
      <span class="project-prop project-leaf"></span>
      <span class="project-prop project-flower"></span>
      <span class="project-prop project-binder"></span>
      <span class="project-prop project-pencil"></span>
      <span class="project-prop project-yarn"></span>
      <span class="project-crochet-square"></span>
      <span class="project-prop project-button"></span>
      <span class="project-thread"></span>
      <span class="project-polaroid"><i></i></span>
    </div>
  `;
}

function dialogMarkup() {
  return `
    <dialog class="project-preview-dialog" aria-labelledby="project-preview-title">
      <form method="dialog">
        <button class="project-dialog-close" value="close" aria-label="Close project preview">×</button>
        <span class="project-dialog-number" data-preview-number>01</span>
        <img data-preview-image src="${PROJECTS[0].image}" alt="${PROJECTS[0].alt}" />
        <div>
          <p>SELECTED PROJECT</p>
          <h2 id="project-preview-title" data-preview-title>${PROJECTS[0].title}</h2>
          <span data-preview-description>${PROJECTS[0].description}</span>
          <small data-preview-meta>${PROJECTS[0].date} · ${PROJECTS[0].team}</small>
        </div>
      </form>
    </dialog>
  `;
}

export function ProjectNotebookV3(container) {
  container.innerHTML = `
    <main class="project-notebook-v3" data-page="project-notebook-v3">
      ${decorMarkup()}

      <button class="notebook-back" type="button" data-back-to-table>
        <span aria-hidden="true">←</span>
        Craft Table
      </button>

      <section class="notebook-stage" aria-label="Strategy project notebook">
        <article class="open-notebook">
          <div class="notebook-page notebook-page-left">
            <header>
              <p>PROJECTS · 2024—2026</p>
              <h1>Strategy<br />Notebook</h1>
              <span lang="zh-CN">项目策略与思考</span>
            </header>

            <div class="approach-note">
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
          </div>

          <div class="notebook-spine" aria-hidden="true">
            ${ringMarkup()}
          </div>

          <div class="notebook-page notebook-page-right">
            <p class="right-page-kicker">SELECTED WORK · THREE PROJECTS</p>
            <div class="notebook-projects">
              ${PROJECTS.map(projectMarkup).join("")}
            </div>
          </div>

          <div class="notebook-tabs">
            ${PROJECTS.map(tabMarkup).join("")}
          </div>
        </article>
      </section>

      <p class="notebook-hint">Choose a project from the page</p>
      ${dialogMarkup()}
    </main>
  `;

  const root = container.querySelector("[data-page='project-notebook-v3']");
  const dialog = root.querySelector(".project-preview-dialog");
  const projectButtons = [...root.querySelectorAll("[data-project-id]")];

  const setActiveProject = (projectId, { openPreview = false, scroll = false } = {}) => {
    const project = PROJECTS.find((item) => item.id === projectId);
    if (!project) return;

    projectButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.projectId === projectId);
    });

    root.querySelectorAll("[data-tab-project]").forEach((tab) => {
      const active = tab.dataset.tabProject === projectId;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-pressed", String(active));
    });

    if (scroll) {
      root
        .querySelector(`[data-project-id="${projectId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (openPreview) {
      root.querySelector("[data-preview-number]").textContent = project.number;
      root.querySelector("[data-preview-title]").textContent = project.title;
      root.querySelector("[data-preview-description]").textContent = project.description;
      root.querySelector("[data-preview-meta]").textContent = `${project.date} · ${project.team}`;
      const previewImage = root.querySelector("[data-preview-image]");
      previewImage.src = project.image;
      previewImage.alt = project.alt;
      dialog.showModal();
    }
  };

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      location.hash = `project/${button.dataset.projectId}`;
    });
  });

  root.querySelectorAll("[data-tab-project]").forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveProject(tab.dataset.tabProject, { scroll: true });
    });
  });

  root.querySelector("[data-back-to-table]").addEventListener("click", () => {
    location.hash = "";
  });

  setActiveProject(PROJECTS[0].id);
  console.log("ProjectNotebook V3 mounted");
}
