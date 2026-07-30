import { CraftTableHomeV3 } from "./CraftTableHomeV3.js";
import { ProjectSceneV3 } from "./ProjectSceneV3.js";
import { ResumeSceneV3 } from "./ResumeSceneV3.js";
import { WorkInProgressV3 } from "./WorkInProgressV3.js";
import { OperationSceneV3 } from "./OperationSceneV3.js";
import {
  decorationGroupId,
  getDecorationAssetReport,
  getDecorationGroupReport,
  mountDecorationGroup,
  prepareDecorationGroup,
  prepareSiteShellDecorations,
  waitForDecorationGroup,
} from "./decoration-groups.js";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("Craft Table V3 app root not found");
}

let cleanupCurrentPage;
let projectSceneController;
let routeTransitionTimer;
let routeEntryTimer;
let routeTransitionToken = 0;

const ROUTE_FOCUS_OUT_MS = 190;
const ROUTE_FOCUS_IN_MS = 270;
const SITE_SHELL_REVEAL_DEADLINE_MS = 8000;
const SITE_SHELL_MIN_LOADING_MS = 2000;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetDocumentScroll() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

function decodeImage(src, priority, states) {
  states.set(src, { src, status: "pending", phase: "request" });
  return new Promise((resolve, reject) => {
    const image = new Image();
    let handlingLoad = false;
    let settled = false;
    image.decoding = "async";
    image.fetchPriority = priority;

    const fail = (phase, cause) => {
      if (settled) return;
      settled = true;
      const error = new Error(`Initial image ${phase} failed: ${src}`, { cause });
      states.set(src, { src, status: "failed", phase, error });
      reject(error);
    };

    const finishLoad = async () => {
      if (settled || handlingLoad) return;
      handlingLoad = true;
      if (!image.complete || image.naturalWidth === 0) {
        fail("load", new Error("Image completed without usable pixels"));
        return;
      }

      states.set(src, { src, status: "pending", phase: "decode" });
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
      states.set(src, { src, status: "loaded", phase: "complete" });
      resolve(src);
    };

    image.onload = finishLoad;
    image.onerror = (error) => fail("load", error);
    image.src = src;
    if (image.complete) queueMicrotask(finishLoad);
  });
}

function nextAnimationFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function waitForStableHomePaint() {
  const paintReady = async () => {
    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch (error) {
        console.warn("[initial-preload] Font readiness check failed.", error);
      }
    }

    const home = document.querySelector(".craft-table-v3");
    let previousSize;
    let stableFrames = 0;
    for (let frame = 0; frame < 5 && stableFrames < 2; frame += 1) {
      await nextAnimationFrame();
      const rect = home?.getBoundingClientRect();
      const currentSize = rect ? `${Math.round(rect.width)}x${Math.round(rect.height)}` : "missing";
      stableFrames = currentSize === previousSize ? stableFrames + 1 : 0;
      previousSize = currentSize;
    }
  };

  await Promise.race([
    paintReady(),
    new Promise((resolve) => window.setTimeout(resolve, 240)),
  ]);
}

async function revealInitialPage() {
  const initialLoadingStartedAt = Number.isFinite(window.__initialLoadingStartedAt)
    ? window.__initialLoadingStartedAt
    : 0;
  const initialLoadingElapsed = () => performance.now() - initialLoadingStartedAt;
  const homeSources = [
    "/assets/wood-desk-background.jpg",
    "/assets/craft-table-object-sprites-polished.png",
    "/assets/notebook-only-v3.png",
  ];
  const homeAssetStates = new Map();
  const homeAssetsSettled = Promise.allSettled(
    homeSources.map((src) => decodeImage(src, "high", homeAssetStates)),
  );
  const siteShellSettled = Promise.all([
    homeAssetsSettled,
    waitForDecorationGroup("home"),
    prepareSiteShellDecorations(),
  ]);
  const minimumReady = new Promise((resolve) =>
    window.setTimeout(resolve, Math.max(0, SITE_SHELL_MIN_LOADING_MS - initialLoadingElapsed())),
  );
  const completed = Promise.all([minimumReady, siteShellSettled]).then(() => "settled");
  const result = await Promise.race([
    completed,
    new Promise((resolve) =>
      window.setTimeout(
        () => resolve("timeout"),
        Math.max(0, SITE_SHELL_REVEAL_DEADLINE_MS - initialLoadingElapsed()),
      ),
    ),
  ]);

  const getHomeReport = () => ({
    loaded: [...homeAssetStates.values()]
      .filter(({ status }) => status === "loaded")
      .map(({ src }) => src),
    pending: [...homeAssetStates.values()]
      .filter(({ status }) => status === "pending")
      .map(({ src }) => src),
    failed: [...homeAssetStates.values()]
      .filter(({ status }) => status === "failed")
      .map(({ src, phase, error }) => ({
        src,
        phase,
        message: error?.message || "Unknown initial image error",
      })),
  });
  const updateReadyState = () => {
    const homeReport = getHomeReport();
    const homeDecorationReport = getDecorationGroupReport("home");
    const homeReady =
      homeReport.pending.length === 0 &&
      homeReport.failed.length === 0 &&
      homeDecorationReport.pending.length === 0 &&
      homeDecorationReport.failed.length === 0;
    document.querySelector(".craft-table-v3")?.classList.toggle("home-ready", homeReady);
    window.siteShellAssetsReady = homeReady && getDecorationAssetReport().ready;
    return { homeReady, homeReport, homeDecorationReport };
  };
  const initialState = updateReadyState();
  const decorationReport = getDecorationAssetReport();
  if (
    result === "timeout" ||
    initialState.homeReport.pending.length ||
    initialState.homeReport.failed.length ||
    decorationReport.pending.length ||
    decorationReport.failed.length
  ) {
    const issueReport = {
      elapsedMs: Math.round(performance.now()),
      outcome: result,
      pendingDecorations: decorationReport.pending.map((src) => new URL(src, location.href).href),
      failedDecorations: decorationReport.failed.map((item) => ({
        ...item,
        src: new URL(item.src, location.href).href,
      })),
      pendingHomeAssets: initialState.homeReport.pending.map(
        (src) => new URL(src, location.href).href,
      ),
      failedHomeAssets: initialState.homeReport.failed.map((item) => ({
        ...item,
        src: new URL(item.src, location.href).href,
      })),
    };
    console.warn(
      "[initial-preload] Continuing with unresolved assets.\n" +
        JSON.stringify(issueReport, null, 2),
    );
  }

  if (result === "timeout") {
    siteShellSettled.then(() => {
      const finalState = updateReadyState();
      const finalDecorations = getDecorationAssetReport();
      if (finalState.homeReport.failed.length || finalDecorations.failed.length) {
        console.error(
          "[initial-preload] Background loading completed with failed assets.\n" +
            JSON.stringify(
              {
                failedHomeAssets: finalState.homeReport.failed.map((item) => ({
                  ...item,
                  src: new URL(item.src, location.href).href,
                })),
                failedDecorations: finalDecorations.failed.map((item) => ({
                  ...item,
                  src: new URL(item.src, location.href).href,
                })),
              },
              null,
              2,
            ),
        );
      } else {
        console.info("[initial-preload] Pending assets finished loading in the background.");
      }
    });
  }

  await waitForStableHomePaint();
  window.clearTimeout(window.__initialRevealFallback);
  window.__initialRevealAt ||= performance.now();
  document.documentElement.classList.remove("is-initial-fallback-expired");
  document.documentElement.classList.remove("is-initial-loading");
  document.documentElement.classList.add("is-initial-ready");
}

function leaveCurrentPage() {
  cleanupCurrentPage?.();
  cleanupCurrentPage = undefined;
  projectSceneController = undefined;
}

function commitRoute() {
  const route = location.hash.slice(1).toLowerCase();
  const decorationId = decorationGroupId(route);
  const isResumeRoute = route === "resume";
  const isWorkInProgressRoute = route === "about";
  const isOperationRoute = route === "operation";
  const isProjectRoute = ["project", "visual", "video"].some(
    (chapter) => route === chapter || route.startsWith(`${chapter}/`),
  );

  if (isProjectRoute && projectSceneController) {
    projectSceneController.update(route);
    mountDecorationGroup(app, decorationId);
    return;
  }

  leaveCurrentPage();

  if (isProjectRoute) {
    projectSceneController = ProjectSceneV3(app, route);
    cleanupCurrentPage = () => {
      projectSceneController?.destroy();
      projectSceneController = undefined;
    };
    mountDecorationGroup(app, decorationId);
    return;
  }

  if (isResumeRoute) {
    cleanupCurrentPage = ResumeSceneV3(app);
    mountDecorationGroup(app, decorationId);
    return;
  }

  if (isWorkInProgressRoute) {
    cleanupCurrentPage = WorkInProgressV3(app);
    mountDecorationGroup(app, decorationId);
    return;
  }

  if (isOperationRoute) {
    cleanupCurrentPage = OperationSceneV3(app);
    mountDecorationGroup(app, decorationId);
    return;
  }

  cleanupCurrentPage = CraftTableHomeV3(app);
  mountDecorationGroup(app, decorationId);
}

function playRouteEntry() {
  window.clearTimeout(routeEntryTimer);
  app.classList.remove("is-route-entering");
  document.body.classList.remove("is-route-transitioning");
  document.body.classList.add("is-route-refocusing");
  void app.offsetWidth;
  app.classList.add("is-route-entering");
  routeEntryTimer = window.setTimeout(() => {
    app.classList.remove("is-route-entering");
    document.body.classList.remove("is-route-refocusing");
  }, ROUTE_FOCUS_IN_MS + 30);
}

function transitionRoute() {
  const token = ++routeTransitionToken;
  prepareDecorationGroup(decorationGroupId(location.hash.slice(1).toLowerCase()));
  window.clearTimeout(routeTransitionTimer);
  window.clearTimeout(routeEntryTimer);
  app.classList.remove("is-route-entering");
  document.body.classList.remove("is-route-refocusing");
  document.body.classList.add("is-route-transitioning");
  app.classList.add("is-route-leaving");

  routeTransitionTimer = window.setTimeout(() => {
    if (token !== routeTransitionToken) return;
    resetDocumentScroll();
    commitRoute();
    requestAnimationFrame(resetDocumentScroll);
    app.classList.remove("is-route-leaving");
    playRouteEntry();
  }, ROUTE_FOCUS_OUT_MS);
}

window.addEventListener("hashchange", transitionRoute);
prepareDecorationGroup(decorationGroupId(location.hash.slice(1).toLowerCase()));
resetDocumentScroll();
commitRoute();
requestAnimationFrame(resetDocumentScroll);
revealInitialPage();
