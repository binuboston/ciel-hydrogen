import { useState, useEffect } from "react";
const SCRIPTS_LOADED = {};
function loadScript(src, options) {
  const isScriptLoaded = SCRIPTS_LOADED[src];
  if (isScriptLoaded) {
    return isScriptLoaded;
  }
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    if (options == null ? void 0 : options.module) {
      script.type = "module";
    } else {
      script.type = "text/javascript";
    }
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      reject(false);
    };
    if ((options == null ? void 0 : options.in) === "head") {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  });
  SCRIPTS_LOADED[src] = promise;
  return promise;
}
function useLoadScript(url, options) {
  const [status, setStatus] = useState("loading");
  const stringifiedOptions = JSON.stringify(options);
  useEffect(() => {
    async function loadScriptWrapper() {
      try {
        setStatus("loading");
        await loadScript(url, options);
        setStatus("done");
      } catch (error) {
        setStatus("error");
      }
    }
    loadScriptWrapper().catch(() => {
      setStatus("error");
    });
  }, [url, stringifiedOptions, options]);
  return status;
}
export {
  loadScript,
  useLoadScript
};
//# sourceMappingURL=load-script.mjs.map
