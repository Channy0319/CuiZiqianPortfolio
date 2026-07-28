const DECORATION_TIMEOUT_MS = 1100;

const SHARED_SCENE_DECORATIONS = [
  "/assets/scene-mini-sprites.webp",
  "/assets/project-notebook/vintage-plant-photo.webp",
  "/assets/project-notebook/sprites-v3/two-leaves-v3.webp",
  "/assets/project-notebook/sprites-v3/binder-clips-v3.webp",
  "/assets/project-notebook/sprites-v3/pencil-v3.webp",
  "/assets/project-notebook/sprites-v3/yarn-v3.webp",
];

const GROUPS = {
  home: ["/assets/home-mini-sprites.webp"],
  strategy: SHARED_SCENE_DECORATIONS,
  visual: SHARED_SCENE_DECORATIONS,
  video: SHARED_SCENE_DECORATIONS,
  operation: SHARED_SCENE_DECORATIONS,
  about: SHARED_SCENE_DECORATIONS,
  resume: SHARED_SCENE_DECORATIONS,
};

const assetLoads = new Map();
const groupStates = new Map();

export function decorationGroupId(route) {
  const chapter = route.split("/")[0];
  if (!chapter) return "home";
  if (chapter === "project") return "strategy";
  return GROUPS[chapter] ? chapter : "home";
}

function loadDecorationAsset(src) {
  if (assetLoads.has(src)) return assetLoads.get(src);

  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = "low";
    image.onload = async () => {
      try {
        await image.decode();
      } catch {
        // A successful load is still usable when decode() is unavailable or interrupted.
      }
      resolve(src);
    };
    image.onerror = () => reject(new Error(`Decoration failed to load: ${src}`));
    image.src = src;
  });

  assetLoads.set(src, promise);
  return promise;
}

export function prepareDecorationGroup(groupId) {
  const existing = groupStates.get(groupId);
  if (existing) return existing.readyPromise;

  const settledPromise = Promise.allSettled(GROUPS[groupId].map(loadDecorationAsset));
  const state = { ready: false, settledPromise, readyPromise: undefined };
  state.readyPromise = Promise.race([
    settledPromise,
    new Promise((resolve) => window.setTimeout(resolve, DECORATION_TIMEOUT_MS)),
  ]).then(() => {
    state.ready = true;
    return state;
  });
  groupStates.set(groupId, state);
  return state.readyPromise;
}

export function waitForDecorationGroup(groupId) {
  prepareDecorationGroup(groupId);
  return groupStates.get(groupId).settledPromise;
}

export function mountDecorationGroup(container, groupId) {
  const selector = groupId === "home" ? ".desk-ephemera" : ".scene-still-life";
  const layer = container.querySelector(selector);
  if (!layer) return;

  layer.dataset.decorationGroup = groupId;
  layer.classList.add("decoration-group");

  if (getComputedStyle(layer).display === "none") {
    layer.classList.add("is-decoration-ready", "is-decoration-cached");
    return;
  }

  const state = groupStates.get(groupId);
  if (state?.ready) {
    layer.classList.add("is-decoration-ready", "is-decoration-cached");
    return;
  }

  prepareDecorationGroup(groupId).then(() => {
    if (layer.isConnected && layer.dataset.decorationGroup === groupId) {
      if (groupId === "home" && document.documentElement.classList.contains("is-initial-loading")) {
        layer.classList.add("is-decoration-cached");
      }
      layer.classList.add("is-decoration-ready");
    }
  });
}
