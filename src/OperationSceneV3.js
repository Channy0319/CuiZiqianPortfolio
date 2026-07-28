const keyNumbers = [
  ["运营周期", "3个月", "2024.09—2024.12"],
  ["累计播放", "280W+", "内容总曝光"],
  ["点赞", "7.1W+", "高意向反馈"],
  ["收藏", "3.2W+", "长期价值"],
  ["评论", "7.5W+", "深度互动"],
  ["粉丝增长", "700+", "自然增长"],
];

const reasons = [
  ["01", "成熟的兴趣社区", "MBTI 拥有稳定的年轻用户群体，内容语境天然适合长期运营。", "◎"],
  ["02", "内容生产效率高", "相比专业垂类，MBTI 内容创作门槛低，且更容易形成系列内容。", "↗"],
  ["03", "天然具有互动属性", "人格标签自带身份认同，容易引发用户投票、讨论和经验分享。", "◇"],
];

const strategies = [
  ["Strategy 01", "问题式标题", "提出开放式问题，引导用户分享经历与看法，提高评论互动率。"],
  ["Strategy 02", "情绪价值优先", "聚焦情绪共鸣，让用户先产生“被理解”的感受。"],
  ["Strategy 03", "持续测试与迭代", "通过多轮 A/B 测试，不断优化创意、发布时间和内容组合。"],
];

const briefItems = [
  ["Client", "课程实践项目", "个人内容账号运营"],
  ["Goal", "验证内容增长逻辑", "沉淀可复用方法"],
  ["Constraint", "无付费推广", "无额外运营预算"],
];

function keyNumberMarkup([label, value, note]) {
  return `
    <article class="operation-number">
      <small>${label}</small>
      <strong>${value}</strong>
      <span>${note}</span>
    </article>
  `;
}

function reasonMarkup([number, title, copy, mark]) {
  return `
    <article class="operation-reason operation-paper-card">
      <span class="operation-pin" aria-hidden="true"></span>
      <small>${number}</small>
      <h3>${title}</h3>
      <p>${copy}</p>
      <i aria-hidden="true">${mark}</i>
    </article>
  `;
}

function strategyMarkup([eyebrow, title, copy]) {
  return `
    <article class="operation-strategy operation-paper-card">
      <span class="operation-pin" aria-hidden="true"></span>
      <small>${eyebrow}</small>
      <h3>${title}</h3>
      <p>${copy}</p>
    </article>
  `;
}

function briefMarkup([title, lineOne, lineTwo]) {
  return `
    <article class="operation-brief-card">
      <span>${title}</span>
      <p>${lineOne}<br />${lineTwo}</p>
    </article>
  `;
}

export function OperationSceneV3(container) {
  container.innerHTML = `
    <main class="operation-scene-v3" data-version="operation-v3">
      <a class="scene-table-back operation-back" href="#" aria-label="返回 Craft Table">← <span>Craft Table</span></a>

      <div class="operation-still-life scene-still-life" aria-hidden="true">
        <span class="scene-mini scene-coffee"></span>
        <span class="scene-mini scene-plant"></span>
        <span class="scene-mini scene-flower"></span>
        <img class="scene-asset scene-leaves" src="/assets/project-notebook/sprites-v3/two-leaves-v3.png" alt="" loading="lazy" decoding="async" width="1536" height="1024" />
        <span class="scene-polaroid"><i></i></span>
        <span class="scene-mini-crop scene-button"></span>
        <img class="scene-asset scene-binder" src="/assets/project-notebook/sprites-v3/binder-clips-v3.png" alt="" loading="lazy" decoding="async" width="1536" height="1024" />
        <img class="scene-asset scene-pencil-set" src="/assets/project-notebook/sprites-v3/pencil-v3.png" alt="" loading="lazy" decoding="async" width="1536" height="1024" />
        <img class="scene-asset scene-yarn" src="/assets/project-notebook/sprites-v3/yarn-v3.png" alt="" loading="lazy" decoding="async" width="1536" height="1024" />
        <span class="scene-mini-crop scene-paperclip"></span>
        <span class="scene-mini-crop scene-pushpin"></span>
      </div>

      <section class="operation-book" aria-label="Operation 内容运营案例">
        <div class="operation-page operation-page-left">
          <header class="operation-heading">
            <small>CASE 01 / XIAOHONGSHU GROWTH EXPERIMENT</small>
            <h1>MBTI账号运营实践</h1>
            <p class="operation-date">2024.09 — 2024.12</p>
            <p>以 MBTI 兴趣内容为切入点，在没有个人 IP、没有粉丝基础的情况下，通过平台规律观察、内容策略设计和持续数据复盘，完成 3 个月账号冷启动实验。</p>
          </header>

          <section class="operation-profile-card">
            <img
              src="/assets/operation/mbti-profile-wide.webp"
              alt="MBTI后花园小红书账号资料：47关注、708粉丝、11.6万获赞与收藏"
            />
          </section>

          <section class="operation-section">
            <h2 class="operation-label">KEY NUMBERS <small>关键数据</small></h2>
            <div class="operation-numbers">${keyNumbers.map(keyNumberMarkup).join("")}</div>
          </section>

          <section class="operation-data-strip" aria-label="三阶段账号数据">
            <button
              class="operation-data-preview"
              type="button"
              data-operation-image="/assets/operation/view-trends.webp"
              data-operation-alt="三阶段账号观看趋势数据"
              aria-label="点击查看观看趋势大图"
            >
              <span>观看趋势</span>
              <img src="/assets/operation/view-trends.webp" alt="三阶段账号观看趋势数据" />
            </button>
            <button
              class="operation-data-preview"
              type="button"
              data-operation-image="/assets/operation/interaction-trends.webp"
              data-operation-alt="三阶段账号互动数据"
              aria-label="点击查看互动表现大图"
            >
              <span>互动表现</span>
              <img src="/assets/operation/interaction-trends.webp" alt="三阶段账号互动数据" />
            </button>
          </section>

          <section class="operation-section operation-brief">
            <h2><span>01</span> PROJECT BRIEF <small>项目背景</small></h2>
            <div>${briefItems.map(briefMarkup).join("")}</div>
          </section>
        </div>

        <div class="operation-rings" aria-hidden="true">${Array.from({ length: 6 }, () => "<i></i>").join("")}</div>

        <div class="operation-page operation-page-right">
          <section class="operation-section operation-why">
            <h2 class="operation-label"><span>02</span> WHY MBTI <small>为什么选择MBTI?</small></h2>
            <div>${reasons.map(reasonMarkup).join("")}</div>
          </section>

          <section class="operation-section operation-content">
            <h2 class="operation-label"><span>03</span> CONTENT STRATEGY <small>内容策略</small></h2>
            <div>${strategies.map(strategyMarkup).join("")}</div>
          </section>

          <div class="operation-bottom-grid">
            <section class="operation-section operation-insights">
              <h2 class="operation-label"><span>04</span> KEY INSIGHTS <small>关键洞察</small></h2>
              <div>
                <article><b>洞察 01</b><p>用户更愿意表达，而不是被动观看。</p></article>
                <article><b>洞察 02</b><p>降低理解成本，比追求专业深度更重要。</p></article>
                <article><b>洞察 03</b><p>内容增长依赖持续验证，而不是一次爆款。</p></article>
              </div>
            </section>

            <section class="operation-section operation-reflection">
              <h2 class="operation-label">REFLECTION <small>项目总结</small></h2>
              <p>如果重新运营这个账号，我会进一步建立固定栏目，增加评论区运营，并持续围绕标题、发布时间和内容形式进行复盘。运营不是单次创意，而是持续测试、收集反馈与优化的过程。</p>
              <span aria-hidden="true">→</span>
            </section>
          </div>
        </div>
      </section>

      <div class="operation-lightbox" role="dialog" aria-modal="true" aria-label="数据大图查看器" hidden>
        <button class="operation-lightbox-close" type="button" aria-label="关闭大图">×</button>
        <img src="" alt="" />
      </div>
    </main>
  `;

  const lightbox = container.querySelector(".operation-lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxClose = lightbox?.querySelector(".operation-lightbox-close");
  const previousBodyOverflow = document.body.style.overflow;

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImage?.removeAttribute("src");
    document.body.style.overflow = previousBodyOverflow;
  }

  function openLightbox(trigger) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = trigger.dataset.operationImage;
    lightboxImage.alt = trigger.dataset.operationAlt || "账号数据大图";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
  }

  const previews = [...container.querySelectorAll(".operation-data-preview")];
  previews.forEach((preview) => {
    preview.addEventListener("click", () => openLightbox(preview));
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  function handleLightboxKeydown(event) {
    if (event.key === "Escape") closeLightbox();
  }

  window.addEventListener("keydown", handleLightboxKeydown);

  document.title = "Operation — Cui Ziqian";
  console.log("Operation V3 mounted");
  return () => {
    window.removeEventListener("keydown", handleLightboxKeydown);
    document.body.style.overflow = previousBodyOverflow;
  };
}
