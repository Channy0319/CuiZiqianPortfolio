const skills = [
  "Photoshop",
  "Premiere",
  "剪映",
  "Python",
  "Excel",
  "PowerPoint",
  "ChatGPT",
  "Claude",
  "Codex",
  "Vercel",
  "GitHub",
  "英语",
];

const highlights = [
  {
    tone: "gold",
    title: "LEO BURNETT",
    subtitle: "客户执行（AE）",
    items: [
      "消费者洞察",
      "竞品分析",
      "新品概念探索",
      "产品命名 Brainstorm",
      "包装概念研究",
      "品牌定位与传播方向建议",
    ],
    mark: "☆",
  },
  {
    tone: "sage",
    title: "CHINA DAILY",
    subtitle: "海外传播运营",
    items: ["英文内容策划", "短视频制作与剪辑", "海外话题洞察", "1M+ 播放量", "实习鉴定满分"],
    mark: "♡",
  },
  {
    tone: "coral",
    title: "SOHU VIDEO",
    subtitle: "新媒体运营",
    items: ["专题策划", "首页视觉设计", "海报设计", "内容结构优化", "提升专题运营质量"],
    mark: "☺",
  },
];

function metricMarkup(value, english, chinese, tone, icon) {
  return `
    <article class="resume-metric resume-note-${tone}">
      <i aria-hidden="true"></i>
      <span class="resume-metric-icon" aria-hidden="true">${icon}</span>
      <strong>${value}</strong>
      <p>${english}</p>
      <small>${chinese}</small>
    </article>
  `;
}

function highlightMarkup(item) {
  return `
    <article class="resume-highlight resume-note-${item.tone}">
      <span class="resume-tape" aria-hidden="true"></span>
      <b>${item.title}</b>
      <strong>${item.subtitle}</strong>
      <ul>${item.items.map((entry) => `<li>${entry}</li>`).join("")}</ul>
      <em aria-hidden="true">${item.mark}</em>
    </article>
  `;
}

function experienceMarkup(date, company, role, bullets, tone) {
  return `
    <article class="resume-experience-item resume-exp-${tone}">
      <div class="resume-exp-date">${date}</div>
      <div class="resume-exp-copy">
        <h3>${company} <span>${role}</span></h3>
        <ul>${bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
    </article>
  `;
}

export function ResumeSceneV3(container) {
  container.innerHTML = `
    <main class="resume-scene-v3" data-version="resume-v3">
      <a class="resume-back" href="#" aria-label="返回 Craft Table">← <span>Craft Table</span></a>

      <div class="resume-still-life scene-still-life" aria-hidden="true">
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

      <section class="resume-book" aria-label="崔子芊简历">
        <div class="resume-page resume-page-left">
          <span class="resume-corner-tape" aria-hidden="true"></span>
          <header class="resume-profile">
            <img
              class="resume-portrait"
              src="/assets/resume/cui-ziqian-portrait.webp"
              alt="崔子芊证件照"
              width="508"
              height="774"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
            <div class="resume-identity">
              <h1>崔子芊 <em>Cui Ziqian</em></h1>
              <p>Brand Marketing · Global Marketing · Brand Communication</p>
              <div class="resume-contact">
                <span>✉ cuiziq32617@126.com</span>
                <span>⌕ 136 9357 1720</span>
                <span>◎ cuiziqianportfolio.xyz</span>
              </div>
            </div>
            <a
              class="resume-download"
              href="/assets/resume/崔子芊-香港中文大学硕士-27届-13693571720.pdf"
              download="崔子芊-香港中文大学硕士-27届-13693571720.pdf"
            >
              <span class="resume-download-clip" aria-hidden="true"></span>
              <span>DOWNLOAD<br />FULL RESUME</span>
              <small>下载完整版简历 PDF</small>
            </a>
          </header>

          <section class="resume-section resume-education">
            <h2><span>▣</span> EDUCATION <small>教育背景</small></h2>
            <div class="resume-education-grid">
              <article>
                <b>香港中文大学</b>
                <strong>新媒体 · 硕士</strong>
                <span>2026.09 – 2027.06</span>
              </article>
              <article>
                <b>中国传媒大学</b>
                <strong>网络与新媒体<br />智能融媒体运营方向 · 本科</strong>
                <span>2022.09 – 2026.06</span>
              </article>
            </div>
            <div class="resume-scores">
              <span>GPA&nbsp; 3.82 / 4.0</span>
              <span>IELTS&nbsp; 8.0</span>
              <span>CET-6&nbsp; 661</span>
            </div>
          </section>

          <section class="resume-section resume-experience">
            <h2><span>▣</span> EXPERIENCE <small>实习经历</small></h2>
            <div class="resume-experience-line" aria-hidden="true"></div>
            ${experienceMarkup(
              "2024.06<br />–2024.09",
              "阳狮集团 · 北京李奥贝纳广告有限公司",
              "客户执行（AE）",
              [
                "参与安慕希新品品牌策略项目，围绕消费者洞察、竞品分析与新品概念探索开展研究。",
                "协助客户、策略及创意团队推进项目，参与产品命名 Brainstorm、包装概念研究，以及品牌定位与传播方向建议输出。",
              ],
              "sage",
            )}
            ${experienceMarkup(
              "2024.12<br />–2025.03",
              "中国日报社",
              "海外传播运营",
              [
                "面向海外用户完成英文内容，独立完成短视频选题、素材搜集、脚本与剪辑。",
                "实习期间制作内容累计播放量 100 万+，获得实习鉴定满分。",
              ],
              "orange",
            )}
            ${experienceMarkup(
              "2025.05<br />–2025.08",
              "搜狐视频",
              "新媒体运营",
              [
                "围绕影片内容策划首页专题，提炼主题并建立视觉表达体系。",
                "完成专题海报及首页素材设计，优化内容结构及展示效果，提升专题运营质量。",
              ],
              "gold",
            )}
          </section>
        </div>

        <div class="resume-rings" aria-hidden="true">
          ${Array.from({ length: 7 }, () => "<i></i>").join("")}
        </div>

        <div class="resume-page resume-page-right">
          <section class="resume-right-section">
            <h2 class="resume-paper-title">KEY NUMBERS <small>关键数据</small></h2>
            <div class="resume-metrics">
              ${metricMarkup("2.8M+", "Content Views", "累计播放量", "lilac", "▷")}
              ${metricMarkup("100K+", "Likes & Saves", "点赞收藏", "coral", "♡")}
              ${metricMarkup("75K+", "Comments", "评论互动", "sage", "…")}
              ${metricMarkup("8.0", "IELTS", "雅思成绩", "gold", "◎")}
            </div>
          </section>

          <section class="resume-right-section">
            <h2 class="resume-paper-title">EXPERIENCE HIGHLIGHTS <small>亮点速览</small></h2>
            <div class="resume-highlights">${highlights.map(highlightMarkup).join("")}</div>
          </section>

          <section class="resume-right-section resume-skills">
            <h2 class="resume-paper-title">SKILLS <small>技能标签</small></h2>
            <div>${skills.map((skill) => `<span>${skill}</span>`).join("")}</div>
          </section>

          <aside class="resume-updated-note">
            <span class="resume-tape" aria-hidden="true"></span>
            <p>Still Updating... ♡</p>
            <small>Last Edited:<br />July 2026</small>
          </aside>
        </div>
      </section>
    </main>
  `;

  document.title = "Resume — Cui Ziqian";
  console.log("Resume V3 mounted");

  return () => {};
}
