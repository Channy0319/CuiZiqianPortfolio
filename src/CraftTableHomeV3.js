const MODULES = [
  {
    slug: "operation",
    title: "Operation",
    descriptor: "内容运营与迭代",
    detail: "内容运营与迭代",
    className: "object-operation",
    sprite: "sprite-phone",
  },
  {
    slug: "strategy",
    title: "Project",
    descriptor: "项目策略与思考",
    detail: "项目策略与思考",
    className: "object-strategy",
    sprite: "sprite-notebook",
  },
  {
    slug: "visual",
    title: "Visual",
    descriptor: "视觉呈现与设计",
    detail: "视觉呈现与设计",
    className: "object-visual",
    sprite: "sprite-camera",
  },
  {
    slug: "video",
    title: "Video",
    descriptor: "视频内容与叙事",
    detail: "视频内容与叙事",
    className: "object-video",
    sprite: "sprite-headphones",
  },
  {
    slug: "about",
    title: "Work in Progress",
    descriptor: "关于我",
    detail: "正在制作中的个人手账",
    className: "object-about",
    sprite: "sprite-yarn",
  },
  {
    slug: "resume",
    title: "Resume",
    descriptor: "履历与联系方式",
    detail: "履历与联系方式",
    className: "object-resume",
    sprite: "sprite-resume",
  },
];

function objectMarkup(module) {
  return `
    <button
      class="scene-object ${module.className}"
      type="button"
      data-module="${module.slug}"
      aria-label="Open ${module.title}: ${module.detail}"
    >
      <span class="object-art ${module.sprite}" aria-hidden="true"></span>
      <span class="object-caption">
        <span>${module.title}</span>
        <small>${module.descriptor}</small>
      </span>
    </button>
  `;
}

function menuMarkup() {
  return MODULES.map(
    (module, index) => `
      <button type="button" data-menu-module="${module.slug}">
        <span>0${index + 1}</span>
        ${module.title}
      </button>
    `,
  ).join("");
}

function profileCardMarkup() {
  return `
    <article class="profile-card profile-card-static" aria-labelledby="profile-name">
      <span class="profile-paperclip" aria-hidden="true"></span>
      <div class="profile-kicker">PORTFOLIO · 2026</div>
      <div class="profile-card-grid">
        <div>
          <h1 id="profile-name">
            <span>Cui Ziqian</span>
            <small lang="zh-CN">崔子芊</small>
          </h1>
          <p class="profile-disciplines">Brand Marketing · Global Communication · Content Strategy</p>
          <p class="profile-disciplines-cn" lang="zh-CN">品牌营销 · 全球传播 · 内容策略</p>
        </div>
        <div class="profile-intro">
          <p>Welcome to my craft table.</p>
        </div>
      </div>
      <div class="profile-stamp" aria-hidden="true">CZ</div>
    </article>
  `;
}

function showModule(dialog, module) {
  dialog.querySelector("[data-dialog-number]").textContent = `0${MODULES.indexOf(module) + 1}`;
  dialog.querySelector("[data-dialog-title]").textContent = module.title;
  dialog.querySelector("[data-dialog-detail]").textContent = module.detail;
  history.pushState({ module: module.slug }, "", `#${module.slug}`);

  if (!dialog.open) {
    dialog.showModal();
  }
}

export function CraftTableHomeV3(container) {
  container.innerHTML = `
    <main class="craft-table-v3" data-version="craft-table-v3">
      <button class="menu-trigger" type="button" aria-expanded="false" aria-controls="craft-menu">
        <span aria-hidden="true"><i></i><i></i></span>
        Menu
      </button>

      <aside class="craft-menu" id="craft-menu" hidden aria-label="Portfolio sections">
        <p>Choose a piece</p>
        ${menuMarkup()}
      </aside>

      <section class="table-scene" aria-label="Cui Ziqian's portfolio craft table">
        <div class="desk-ephemera" aria-hidden="true">
          <svg class="loose-thread" viewBox="0 0 1000 180" preserveAspectRatio="none">
            <path d="M8 68 C160 18 205 142 340 72 S575 22 710 92 S886 132 992 58" />
          </svg>
          <span class="mini-prop mini-crochet-flower"></span>
          <span class="mini-prop mini-binder-clips"></span>
          <span class="mini-prop mini-paperclip"></span>
          <span class="mini-prop mini-tape"></span>
          <span class="mini-prop mini-leaf-sprig"></span>
          <span class="mini-prop mini-dried-flower"></span>
          <span class="mini-prop mini-wood-chips"></span>
          <span class="mini-prop mini-crochet-heart"></span>
          <span class="mini-prop mini-left-sage-flower"></span>
          <span class="mini-prop mini-left-sticky-note"></span>
        </div>
        ${profileCardMarkup()}
        ${MODULES.map(objectMarkup).join("")}
      </section>

      <p class="table-instruction">
        <span aria-hidden="true">↗</span>
        Pick something from the table
      </p>
      <dialog class="module-dialog" aria-labelledby="module-dialog-title">
        <form method="dialog">
          <button class="dialog-close" value="close" aria-label="Close preview">×</button>
          <span class="dialog-number" data-dialog-number>01</span>
          <p class="dialog-kicker">CRAFT TABLE ENTRY</p>
          <h2 id="module-dialog-title" data-dialog-title>Project</h2>
          <p data-dialog-detail>Project notebook and selected cases</p>
          <small>This section is prepared as an independent portfolio chapter.</small>
          <button class="dialog-done" value="close">Back to the table</button>
        </form>
      </dialog>
    </main>
  `;

  const root = container.querySelector("[data-version='craft-table-v3']");
  const menuTrigger = root.querySelector(".menu-trigger");
  const menu = root.querySelector("#craft-menu");
  const dialog = root.querySelector(".module-dialog");

  const openModule = (slug) => {
    const module = MODULES.find((item) => item.slug === slug);
    if (!module) return;

    menu.hidden = true;
    menuTrigger.setAttribute("aria-expanded", "false");

    if (["strategy", "visual", "video", "operation", "about", "resume"].includes(slug)) {
      location.hash = slug === "strategy" ? "project" : slug;
      return;
    }

    showModule(dialog, module);
  };

  root.querySelectorAll("[data-module]").forEach((object) => {
    object.addEventListener("click", () => openModule(object.dataset.module));
  });

  root.querySelectorAll("[data-menu-module]").forEach((button) => {
    button.addEventListener("click", () => openModule(button.dataset.menuModule));
  });

  menuTrigger.addEventListener("click", () => {
    const nextOpen = menu.hidden;
    menu.hidden = !nextOpen;
    menuTrigger.setAttribute("aria-expanded", String(nextOpen));
  });

  const closeMenuOnOutsideClick = (event) => {
    if (menu.hidden || menu.contains(event.target) || menuTrigger.contains(event.target)) return;
    menu.hidden = true;
    menuTrigger.setAttribute("aria-expanded", "false");
  };

  const closeDialogOnHistory = () => {
    if (dialog.open) dialog.close();
  };

  document.addEventListener("click", closeMenuOnOutsideClick);
  window.addEventListener("popstate", closeDialogOnHistory);

  const requestedModule = location.hash.slice(1).toLowerCase();
  if (MODULES.some((module) => module.slug === requestedModule)) {
    openModule(requestedModule);
  }

  console.log("CraftTable V3 mounted");

  return () => {
    document.removeEventListener("click", closeMenuOnOutsideClick);
    window.removeEventListener("popstate", closeDialogOnHistory);
  };
}
