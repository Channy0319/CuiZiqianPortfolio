import { CraftTableHomeV3 } from "./CraftTableHomeV3.js";
import { ProjectSceneV3 } from "./ProjectSceneV3.js";
import { ResumeSceneV3 } from "./ResumeSceneV3.js";
import { WorkInProgressV3 } from "./WorkInProgressV3.js";
import { OperationSceneV3 } from "./OperationSceneV3.js";
import {
  decorationGroupId,
  getDecorationAssetReport,
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
const SITE_SHELL_REVEAL_DEADLINE_MS = 5000;
const SITE_SHELL_MIN_LOADING_MS = 2000;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetDocumentScroll() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

function decodeImage(src, priority = "auto") {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = priority;
    image.onload = async () => {
      try {
        await image.decode();
      } catch {
        // The loaded image remains usable if decode() is unsupported or interrupted.
      }
      resolve(src);
    };
    image.onerror = () => reject(new Error(`Initial image failed to load: ${src}`));
    image.src = src;
  });
}

async function revealInitialPage() {
  const homeSources = [
    "/assets/wood-desk-background.jpg",
    "/assets/craft-table-object-sprites-polished.png",
    "/assets/notebook-only-v3.png",
  ];
  const homeAssetStates = new Map(homeSources.map((src) => [src, "pending"]));
  const homeAssetsReady = Promise.allSettled(
    homeSources.map((src) =>
      decodeImage(src, "high").then(
        (value) => {
          homeAssetStates.set(src, "fulfilled");
          return value;
        },
        (error) => {
          homeAssetStates.set(src, "rejected");
          throw error;
        },
      ),
    ),
  );
  const siteShellReady = Promise.allSettled([
    homeAssetsReady,
    waitForDecorationGroup("home"),
    prepareSiteShellDecorations(),
  ]);
  const minimumReady = new Promise((resolve) =>
    window.setTimeout(resolve, Math.max(0, SITE_SHELL_MIN_LOADING_MS - performance.now())),
  );
  const completed = Promise.all([minimumReady, siteShellReady]).then(() => "ready");
  const result = await Promise.race([
    completed,
    new Promise((resolve) =>
      window.setTimeout(
        () => resolve("timeout"),
        SITE_SHELL_REVEAL_DEADLINE_MS,
      ),
    ),
  ]);

  const decorationReport = getDecorationAssetReport();
  const failedHomeAssets = [...homeAssetStates]
    .filter(([, status]) => status === "rejected")
    .map(([src]) => src);
  if (result === "timeout" || decorationReport.pending.length || failedHomeAssets.length) {
    console.warn("[initial-preload] Continuing with unresolved assets.", {
      elapsedMs: Math.round(performance.now()),
      pendingDecorations: decorationReport.pending,
      failedDecorations: decorationReport.failed,
      pendingHomeAssets: [...homeAssetStates]
        .filter(([, status]) => status === "pending")
        .map(([src]) => src),
      failedHomeAssets,
    });
  }
  window.siteShellAssetsReady = result === "ready";
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
