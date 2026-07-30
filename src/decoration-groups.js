const sharedSceneDecorationAssets = [
  "/assets/scene-mini-sprites.webp",
  "/assets/project-notebook/vintage-plant-photo.webp",
  "/assets/project-notebook/sprites-v3/two-leaves-v3.webp",
  "/assets/project-notebook/sprites-v3/binder-clips-v3.webp",
  "/assets/project-notebook/sprites-v3/pencil-v3.webp",
  "/assets/project-notebook/sprites-v3/yarn-v3.webp",
];

export const homeDecorationAssets = ["/assets/home-mini-sprites.webp"];
export const strategyDecorationAssets = [...sharedSceneDecorationAssets];
export const visualDecorationAssets = [...sharedSceneDecorationAssets];
export const videoDecorationAssets = [...sharedSceneDecorationAssets];
export const operationDecorationAssets = [...sharedSceneDecorationAssets];
export const aboutDecorationAssets = [...sharedSceneDecorationAssets];
export const resumeDecorationAssets = [...sharedSceneDecorationAssets];

const GROUPS = {
  home: homeDecorationAssets,
  strategy: strategyDecorationAssets,
  visual: visualDecorationAssets,
  video: videoDecorationAssets,
  operation: operationDecorationAssets,
  about: aboutDecorationAssets,
  resume: resumeDecorationAssets,
};

const assetLoads = new Map();
const assetStates = new Map();
const groupStates = new Map();
let siteShellAssetsReady = false;
let siteShellReadyPromise;

export function decorationGroupId(route) {
  const chapter = route.split("/")[0];
  if (!chapter) return "home";
  if (chapter === "project") return "strategy";
  return GROUPS[chapter] ? chapter : "home";
}

function loadDecorationAsset(src) {
  if (assetLoads.has(src)) return assetLoads.get(src);

  assetStates.set(src, { src, status: "pending", phase: "request" });
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    let handlingLoad = false;
    let settled = false;
    image.decoding = "async";
    image.fetchPriority = "auto";

    const fail = (phase, cause) => {
      if (settled) return;
      settled = true;
      const error = new Error(`Decoration ${phase} failed: ${src}`, { cause });
      assetStates.set(src, { src, status: "failed", phase, error });
      reject(error);
    };

    const finishLoad = async () => {
      if (settled || handlingLoad) return;
      handlingLoad = true;
      if (!image.complete || image.naturalWidth === 0) {
        fail("load", new Error("Image completed without usable pixels"));
        return;
      }

      assetStates.set(src, { src, status: "pending", phase: "decode" });
      try {
        await image.decode();
      } catch (error) {
        fail("decode", error);
        return;
      }

      if (image.naturalWidth === 0) {
        fail("decode", new Error("Decoded image has no usable pixels"));
        return;
      }

      settled = true;
      assetStates.set(src, { src, status: "loaded", phase: "complete" });
      resolve(src);
    };

    image.onload = finishLoad;
    image.onerror = (error) => fail("load", error);
    image.src = src;
    if (image.complete) queueMicrotask(finishLoad);
  });

  assetLoads.set(src, promise);
  return promise;
}

export function prepareDecorationGroup(groupId) {
  const existing = groupStates.get(groupId);
  if (existing) return existing.readyPromise;

  const settledPromise = Promise.allSettled(GROUPS[groupId].map(loadDecorationAsset));
  const state = {
    ready: false,
    settled: false,
    settledPromise,
    readyPromise: undefined,
  };
  settledPromise.then(() => {
    state.ready = true;
    state.settled = true;
  });
  state.readyPromise = settledPromise.then(() => {
    state.ready = true;
    return state;
  });
  groupStates.set(groupId, state);
  return state.readyPromise;
}

export function prepareSiteShellDecorations() {
  if (siteShellReadyPromise) return siteShellReadyPromise;

  const groupIds = Object.keys(GROUPS);
  groupIds.forEach(prepareDecorationGroup);
  siteShellReadyPromise = Promise.all(
    groupIds.map((groupId) => groupStates.get(groupId).settledPromise),
  ).then((results) => {
    siteShellAssetsReady = [...assetStates.values()].every(
      ({ status }) => status === "loaded",
    );
    return results;
  });
  return siteShellReadyPromise;
}

export function getDecorationAssetReport() {
  return {
    ready: siteShellAssetsReady,
    loaded: [...assetStates.values()]
      .filter(({ status }) => status === "loaded")
      .map(({ src }) => src),
    pending: [...assetStates.values()]
      .filter(({ status }) => status === "pending")
      .map(({ src }) => src),
    failed: [...assetStates.values()]
      .filter(({ status }) => status === "failed")
      .map(({ src, phase, error }) => ({
        src,
        phase,
        message: error?.message || "Unknown decoration error",
      })),
    uniqueUrls: [...new Set(Object.values(GROUPS).flat())],
  };
}

export function getDecorationGroupReport(groupId) {
  const sources = GROUPS[groupId] || [];
  const states = sources.map((src) => assetStates.get(src) || {
    src,
    status: "pending",
    phase: "not-started",
  });
  return {
    loaded: states.filter(({ status }) => status === "loaded").map(({ src }) => src),
    pending: states.filter(({ status }) => status === "pending").map(({ src }) => src),
    failed: states
      .filter(({ status }) => status === "failed")
      .map(({ src, phase, error }) => ({
        src,
        phase,
        message: error?.message || "Unknown decoration error",
      })),
  };
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
    layer.classList.add("is-decoration-ready");
    if (state.settled) layer.classList.add("is-decoration-cached");
    return;
  }

  prepareDecorationGroup(groupId).then(() => {
    if (layer.isConnected && layer.dataset.decorationGroup === groupId) {
      const currentState = groupStates.get(groupId);
      if (
        currentState?.settled ||
        (groupId === "home" && document.documentElement.classList.contains("is-initial-loading"))
      ) {
        layer.classList.add("is-decoration-cached");
      }
      layer.classList.add("is-decoration-ready");
    }
  });
}
