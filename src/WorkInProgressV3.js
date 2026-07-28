const projects = [
  ["yarn", "Crochet", "钩织"],
  ["blocks", "LEGO", "乐高"],
  ["house", "Miniature House", "拼装小屋"],
  ["palette", "Paint-by-numbers", "数字油画"],
  ["beads", "Perler Beads", "拼豆"],
  ["flower", "Scene sticker", "造景贴纸"],
  ["piano", "Piano", "钢琴（复健中……）"],
];

const iconPaths = {
  yarn: '<circle cx="12" cy="12" r="8"/><path d="M6 9c4-3 9-3 12 0M5 13c4-3 10-3 14 0M8 18c2-5 5-10 9-12M4 19c5 0 9 1 13 4"/>',
  note: '<path d="M6 3h12l3 3v15H6z"/><path d="M18 3v4h4M9 11h8M9 15h8"/>',
  idea: '<path d="M9 17h6M10 20h4"/><path d="M8 12a6 6 0 1 1 8 0c-1.3 1-1.5 2-1.5 3h-5c0-1-.2-2-1.5-3z"/><path d="M12 1v2M3 9H1M23 9h-2M5 3l2 2M19 3l-2 2"/>',
  chocolate: '<path d="M5 6l14 2-2 12-14-2z"/><path d="M8 7l-1 12M13 7l-1 12M5 11l13 2M4 15l13 2"/>',
  blocks: '<path d="M4 13h7v7H4zM13 9h7v11h-7zM7 5h7v6H7z"/><path d="M6 13v-2h3v2M15 9V7h3v2M9 5V3h3v2"/>',
  house: '<path d="M3 11l9-8 9 8v10H3z"/><path d="M8 21v-7h8v7M6 10h3M15 10h3"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c2 0 2-3 4-3h2c3 0 4-4 3-7-1-5-5-8-9-8z"/><circle cx="8" cy="9" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/>',
  beads: '<circle cx="7" cy="7" r="3"/><circle cx="14" cy="7" r="3"/><circle cx="10.5" cy="13" r="3"/><circle cx="17" cy="14" r="3"/><circle cx="8" cy="19" r="2"/>',
  flower: '<circle cx="12" cy="12" r="2.5"/><path d="M12 9c-4-7-8-2-4 2-7-1-7 5-1 4-3 6 3 8 5 2 2 6 8 4 5-1 6 1 6-5 0-4-5-1-5-6-6-3-8 3-6 6z"/>',
  piano: '<path d="M3 6h18v13H3z"/><path d="M7 6v8M11 6v8M15 6v8M19 6v8M5 14v5M9 14v5M13 14v5M17 14v5"/>',
  hammer: '<path d="M5 5l5-3 4 4-3 3zM10 8l3 3M12 10l-8 9 2 2 9-8"/>',
  pin: '<path d="M8 4l8 1-2 5 4 3-1 2-6-2-5 7-1-1 5-8-4-3z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9z"/>',
  plant: '<path d="M12 21v-9M12 15c-6 0-8-5-7-9 5 0 8 2 7 9zM12 12c5 0 7-4 7-8-5 0-7 3-7 8z"/>',
  bug: '<path d="M8 9c0-4 8-4 8 0v8c0 5-8 5-8 0zM8 12h8M12 9v12M8 10L4 7M16 10l4-3M8 15l-5 1M16 15l5 1"/><circle cx="12" cy="6" r="2"/>',
  thread: '<path d="M5 5h14l-2 15H7zM7 8h10M7 16h10M9 5V2h6v3"/><path d="M19 17c3 0 3 4 1 5"/>',
  lightning: '<path d="M14 2L6 13h6l-2 9 8-12h-6z"/>',
  sword: '<path d="M7 4l12 12M16 3l5 5-3 3-5-5zM5 14l5 5M3 21l4-4"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L21 21"/>',
  tarot: '<path d="M6 3h12v18H6z"/><circle cx="12" cy="10" r="3"/><path d="M8 17h8"/>',
  book: '<path d="M3 5c4-2 7-1 9 1v15c-2-2-5-3-9-1zM21 5c-4-2-7-1-9 1v15c2-2 5-3 9-1z"/>',
};

function journalIcon(name) {
  return `<svg class="wip-journal-icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.note}</svg>`;
}

function listRows(rows) {
  return rows
    .map(
      ([icon, title, detail]) => `
        <li>${journalIcon(icon)}<div><b>${title}</b><small>${detail}</small></div></li>
      `,
    )
    .join("");
}

function paper(title, subtitle, className, body, pin = "tape") {
  return `
    <article class="wip-paper ${className}">
      <span class="wip-fastener wip-${pin}" aria-hidden="true"></span>
      <h2>${title}</h2>
      <h3>${subtitle}</h3>
      ${body}
    </article>
  `;
}

export function WorkInProgressV3(container) {
  container.innerHTML = `
    <main class="wip-scene-v3" data-version="work-in-progress-v3">
      <a class="wip-back" href="#" aria-label="返回 Craft Table">← <span>Craft Table</span></a>
      <div class="wip-still-life scene-still-life" aria-hidden="true">
        <span class="scene-mini scene-coffee"></span>
        <span class="scene-mini scene-plant"></span>
        <span class="scene-mini scene-flower"></span>
        <img class="scene-asset scene-leaves" src="/assets/project-notebook/sprites-v3/two-leaves-v3.webp" alt="" loading="eager" decoding="async" fetchpriority="low" width="1254" height="1254" />
        <span class="scene-polaroid"><i></i></span>
        <span class="scene-mini-crop scene-button"></span>
        <img class="scene-asset scene-binder" src="/assets/project-notebook/sprites-v3/binder-clips-v3.webp" alt="" loading="eager" decoding="async" fetchpriority="low" width="1254" height="1254" />
        <img class="scene-asset scene-pencil-set" src="/assets/project-notebook/sprites-v3/pencil-v3.webp" alt="" loading="eager" decoding="async" fetchpriority="low" width="1254" height="1254" />
        <img class="scene-asset scene-yarn" src="/assets/project-notebook/sprites-v3/yarn-v3.webp" alt="" loading="eager" decoding="async" fetchpriority="low" width="1254" height="1254" />
        <span class="scene-mini-crop scene-paperclip"></span>
        <span class="scene-mini-crop scene-pushpin"></span>
      </div>
      <div class="wip-stage">
        ${paper(
          "WORK IN PROGRESS",
          "正在制作中",
          "wip-intro",
          `
            <dl class="wip-project-card">
              <div><dt>Current Project</dt><dd>Cui Ziqian · 崔子芊</dd></div>
              <div><dt>Version</dt><dd>v22.0</dd></div>
              <div><dt>Status</dt><dd>Still Making...<small>持续制作中。</small></dd></div>
            </dl>
            <blockquote>
              <b>我喜欢把零散的东西一点一点变成完整的作品。</b>
              <em>I enjoy building things, piece by piece.</em>
            </blockquote>
          `,
          "clip",
        )}

        ${paper(
          `${journalIcon("yarn")}Build Materials`,
          "常用材料",
          "wip-materials",
          `<ul class="wip-icon-list">${listRows([
            ["yarn", "毛线", "Yarn"],
            ["note", "写了一半的便签", "Sticky Notes"],
            ["idea", "一闪而过的灵感", "Ideas"],
            ["chocolate", "巧克力", "Chocolate"],
          ])}</ul>`,
        )}

        ${paper(
          `${journalIcon("hammer")}Favorite Projects`,
          "最喜欢制作的东西",
          "wip-favorites",
          `<p>如果一件东西需要耐心，<br />我通常都会很喜欢。</p><ul class="wip-icon-list wip-compact-list">${listRows(projects)}</ul>`,
          "pin",
        )}

        ${paper(
          `${journalIcon("pin")}While Making Things`,
          "做东西的时候",
          "wip-making",
          `<div class="wip-ruled-copy"><p>经常一边做一边改。</p><p>很少第一次就满意。</p><p>做完以后，<br />通常还会再看很多遍。</p></div>`,
        )}

        ${paper(
          `${journalIcon("globe")}Reference Library`,
          "灵感来源",
          "wip-reference",
          `<p>我一直很喜欢那些<br />拥有完整世界观的故事。</p><ul class="wip-icon-list">${listRows([
            ["lightning", "Harry Potter", "哈利·波特"],
            ["sword", "The Lord of the Rings", "指环王"],
            ["search", "Sherlock Holmes", "福尔摩斯"],
          ])}</ul>`,
          "clip",
        )}

        ${paper(
          `${journalIcon("plant")}Currently on the Table`,
          "最近在忙什么",
          "wip-current",
          `<div class="wip-ruled-copy wip-current-list"><p>${journalIcon("yarn")}钩织新的图案</p><p>${journalIcon("piano")}重新开始练钢琴</p><p>${journalIcon("tarot")}研究塔罗（暂时还没学会）</p><p>${journalIcon("book")}认真整理自己</p></div>`,
          "pin",
        )}

        ${paper(
          `${journalIcon("bug")}Known Bugs`,
          "已知 Bug",
          "wip-bugs",
          `<div class="wip-check-list"><p>□ <span>看到没有对齐的东西，<br />会忍不住挪动几个像素。</span></p><p>□ <span>有时候会想太多，<br />所以做决定会慢一点。</span></p><p>□ <span>经常告诉自己：<br />“最后改一次。”<br />（然后再改很多次）</span></p></div>`,
        )}

        ${paper(
          `${journalIcon("chocolate")}Energy Supply`,
          "能量补给",
          "wip-energy",
          `<p>Chocolate</p><div class="wip-energy-bar" aria-label="巧克力能量 80%"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i class="empty"></i><i class="empty"></i></div><small>巧克力几乎永远有效。</small>`,
          "clip",
        )}

        ${paper(
          `${journalIcon("thread")}Last Note`,
          "最后一页",
          "wip-last-note",
          `<p>一直很喜欢需要一点耐心的东西。</p><p>比如钩织。<br />比如乐高。<br />比如做作品集。</p><p>它们看起来，<br />都是很多零散的小部分，<br />但慢慢拼起来，</p><p><b>都会变成一个我会喜欢的样子。</b></p><span class="wip-heart">♡</span>`,
        )}
      </div>

    </main>
  `;

  document.title = "Work in Progress — Cui Ziqian";
  console.log("Work in Progress V3 mounted");
  return () => {};
}
