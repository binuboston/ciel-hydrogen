"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const loadScript = require("./load-script.js");
function ModelViewer(props) {
  var _a, _b, _c;
  const [modelViewer, setModelViewer] = React.useState(
    void 0
  );
  const callbackRef = React.useCallback((node) => {
    setModelViewer(node);
  }, []);
  const { data, children, className, ...passthroughProps } = props;
  const modelViewerLoadedStatus = loadScript.useLoadScript(
    "https://unpkg.com/@google/model-viewer@v1.12.1/dist/model-viewer.min.js",
    {
      module: true
    }
  );
  React.useEffect(() => {
    if (!modelViewer) {
      return;
    }
    if (passthroughProps.onError)
      modelViewer.addEventListener("error", passthroughProps.onError);
    if (passthroughProps.onLoad)
      modelViewer.addEventListener("load", passthroughProps.onLoad);
    if (passthroughProps.onPreload)
      modelViewer.addEventListener("preload", passthroughProps.onPreload);
    if (passthroughProps.onModelVisibility)
      modelViewer.addEventListener(
        "model-visibility",
        passthroughProps.onModelVisibility
      );
    if (passthroughProps.onProgress)
      modelViewer.addEventListener("progress", passthroughProps.onProgress);
    if (passthroughProps.onArStatus)
      modelViewer.addEventListener("ar-status", passthroughProps.onArStatus);
    if (passthroughProps.onArTracking)
      modelViewer.addEventListener(
        "ar-tracking",
        passthroughProps.onArTracking
      );
    if (passthroughProps.onQuickLookButtonTapped)
      modelViewer.addEventListener(
        "quick-look-button-tapped",
        passthroughProps.onQuickLookButtonTapped
      );
    if (passthroughProps.onCameraChange)
      modelViewer.addEventListener(
        "camera-change",
        passthroughProps.onCameraChange
      );
    if (passthroughProps.onEnvironmentChange)
      modelViewer.addEventListener(
        "environment-change",
        passthroughProps.onEnvironmentChange
      );
    if (passthroughProps.onPlay)
      modelViewer.addEventListener("play", passthroughProps.onPlay);
    if (passthroughProps.onPause)
      modelViewer.addEventListener("ar-status", passthroughProps.onPause);
    if (passthroughProps.onSceneGraphReady)
      modelViewer.addEventListener(
        "scene-graph-ready",
        passthroughProps.onSceneGraphReady
      );
    return () => {
      if (modelViewer == null) {
        return;
      }
      if (passthroughProps.onError)
        modelViewer.removeEventListener("error", passthroughProps.onError);
      if (passthroughProps.onLoad)
        modelViewer.removeEventListener("load", passthroughProps.onLoad);
      if (passthroughProps.onPreload)
        modelViewer.removeEventListener("preload", passthroughProps.onPreload);
      if (passthroughProps.onModelVisibility)
        modelViewer.removeEventListener(
          "model-visibility",
          passthroughProps.onModelVisibility
        );
      if (passthroughProps.onProgress)
        modelViewer.removeEventListener(
          "progress",
          passthroughProps.onProgress
        );
      if (passthroughProps.onArStatus)
        modelViewer.removeEventListener(
          "ar-status",
          passthroughProps.onArStatus
        );
      if (passthroughProps.onArTracking)
        modelViewer.removeEventListener(
          "ar-tracking",
          passthroughProps.onArTracking
        );
      if (passthroughProps.onQuickLookButtonTapped)
        modelViewer.removeEventListener(
          "quick-look-button-tapped",
          passthroughProps.onQuickLookButtonTapped
        );
      if (passthroughProps.onCameraChange)
        modelViewer.removeEventListener(
          "camera-change",
          passthroughProps.onCameraChange
        );
      if (passthroughProps.onEnvironmentChange)
        modelViewer.removeEventListener(
          "environment-change",
          passthroughProps.onEnvironmentChange
        );
      if (passthroughProps.onPlay)
        modelViewer.removeEventListener("play", passthroughProps.onPlay);
      if (passthroughProps.onPause)
        modelViewer.removeEventListener("ar-status", passthroughProps.onPause);
      if (passthroughProps.onSceneGraphReady)
        modelViewer.removeEventListener(
          "scene-graph-ready",
          passthroughProps.onSceneGraphReady
        );
    };
  }, [
    modelViewer,
    passthroughProps.onArStatus,
    passthroughProps.onArTracking,
    passthroughProps.onCameraChange,
    passthroughProps.onEnvironmentChange,
    passthroughProps.onError,
    passthroughProps.onLoad,
    passthroughProps.onModelVisibility,
    passthroughProps.onPause,
    passthroughProps.onPlay,
    passthroughProps.onPreload,
    passthroughProps.onProgress,
    passthroughProps.onQuickLookButtonTapped,
    passthroughProps.onSceneGraphReady
  ]);
  if (modelViewerLoadedStatus !== "done") {
    return null;
  }
  if (!((_b = (_a = data.sources) == null ? void 0 : _a[0]) == null ? void 0 : _b.url)) {
    const sourcesUrlError = `<ModelViewer/> requires 'data.sources' prop to be an array, with an object that has a property 'url' on it. Rendering 'null'`;
    {
      console.error(sourcesUrlError);
      return null;
    }
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "model-viewer",
    {
      ref: callbackRef,
      ...passthroughProps,
      class: className,
      id: passthroughProps.id ?? data.id,
      src: data.sources[0].url,
      alt: data.alt ?? null,
      "camera-controls": passthroughProps.cameraControls ?? true,
      poster: (passthroughProps.poster || ((_c = data.previewImage) == null ? void 0 : _c.url)) ?? null,
      autoplay: passthroughProps.autoplay ?? true,
      loading: passthroughProps.loading,
      reveal: passthroughProps.reveal,
      ar: passthroughProps.ar,
      "ar-modes": passthroughProps.arModes,
      "ar-scale": passthroughProps.arScale,
      "ar-placement": passthroughProps.arPlacement,
      "ios-src": passthroughProps.iosSrc,
      "touch-action": passthroughProps.touchAction,
      "disable-zoom": passthroughProps.disableZoom,
      "orbit-sensitivity": passthroughProps.orbitSensitivity,
      "auto-rotate": passthroughProps.autoRotate,
      "auto-rotate-delay": passthroughProps.autoRotateDelay,
      "rotation-per-second": passthroughProps.rotationPerSecond,
      "interaction-policy": passthroughProps.interactionPolicy,
      "interaction-prompt": passthroughProps.interactionPrompt,
      "interaction-prompt-style": passthroughProps.interactionPromptStyle,
      "interaction-prompt-threshold": passthroughProps.interactionPromptThreshold,
      "camera-orbit": passthroughProps.cameraOrbit,
      "camera-target": passthroughProps.cameraTarget,
      "field-of-view": passthroughProps.fieldOfView,
      "max-camera-orbit": passthroughProps.maxCameraOrbit,
      "min-camera-orbit": passthroughProps.minCameraOrbit,
      "max-field-of-view": passthroughProps.maxFieldOfView,
      "min-field-of-view": passthroughProps.minFieldOfView,
      bounds: passthroughProps.bounds,
      "interpolation-decay": passthroughProps.interpolationDecay ?? 100,
      "skybox-image": passthroughProps.skyboxImage,
      "environment-image": passthroughProps.environmentImage,
      exposure: passthroughProps.exposure,
      "shadow-intensity": passthroughProps.shadowIntensity ?? 0,
      "shadow-softness": passthroughProps.shadowSoftness ?? 0,
      "animation-name": passthroughProps.animationName,
      "animation-crossfade-duration": passthroughProps.animationCrossfadeDuration,
      "variant-name": passthroughProps.variantName,
      orientation: passthroughProps.orientation,
      scale: passthroughProps.scale,
      children
    }
  );
}
exports.ModelViewer = ModelViewer;
//# sourceMappingURL=ModelViewer.js.map
