import { CraftTableHomeV3 } from "./CraftTableHomeV3.js";
import { ProjectSceneV3 } from "./ProjectSceneV3.js";
import { ResumeSceneV3 } from "./ResumeSceneV3.js";
import { WorkInProgressV3 } from "./WorkInProgressV3.js";
import { OperationSceneV3 } from "./OperationSceneV3.js";
import {
  decorationGroupId,
  mountDecorationGroup,
  prepareDecorationGroup,
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
const INITIAL_REVEAL_TIMEOUT_MS = 1700;
const HOME_REVEAL_TIMEOUT_MS = 3500;
const HOME_MIN_LOADING_MS = 650;

function decodeImage(src, priority = "auto") {
  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = priority;
  image.src = src;
  return image.decode().catch(() => undefined);
}

async function revealInitialPage() {
  const loadingStartedAt = performance.now();
  const route = location.hash.slice(1).toLowerCase();
  const sources = ["/assets/wood-desk-background.jpg"];
  if (!route) {
    sources.push("/assets/craft-table-object-sprites-polished.png", "/assets/notebook-only-v3.png");
  } else {
    const firstVisibleImage = app.querySelector('img[loading="eager"], img:not([loading])');
    if (firstVisibleImage?.currentSrc || firstVisibleImage?.src) {
      sources.push(firstVisibleImage.currentSrc || firstVisibleImage.src);
    }
  }

  const criticalImagesReady = Promise.all(sources.map((src) => decodeImage(src, "high")));
  const pageReady = route
    ? criticalImagesReady
    : Promise.all([criticalImagesReady, waitForDecorationGroup("home")]);
  const timeoutMs = route ? INITIAL_REVEAL_TIMEOUT_MS : HOME_REVEAL_TIMEOUT_MS;

  await Promise.race([
    pageReady,
    new Promise((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
  if (!route) {
    const remainingMinimum = HOME_MIN_LOADING_MS - (performance.now() - loadingStartedAt);
    if (remainingMinimum > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, remainingMinimum));
    }
  }
  window.clearTimeout(window.__initialRevealFallback);
  window.__initialRevealAt ||= performance.now();
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
    commitRoute();
    app.classList.remove("is-route-leaving");
    playRouteEntry();
  }, ROUTE_FOCUS_OUT_MS);
}

window.addEventListener("hashchange", transitionRoute);
prepareDecorationGroup(decorationGroupId(location.hash.slice(1).toLowerCase()));
commitRoute();
revealInitialPage();
