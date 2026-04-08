import { jsx } from "react/jsx-runtime";
function ExternalVideo(props) {
  const {
    data,
    options,
    id = data.id,
    frameBorder = "0",
    allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen = true,
    loading = "lazy",
    ...passthroughProps
  } = props;
  if (!data.embedUrl) {
    throw new Error(`<ExternalVideo/> requires the 'embedUrl' property`);
  }
  let finalUrl = data.embedUrl;
  if (options) {
    const urlObject = new URL(data.embedUrl);
    for (const key of Object.keys(options)) {
      urlObject.searchParams.set(key, options[key]);
    }
    finalUrl = urlObject.toString();
  }
  return /* @__PURE__ */ jsx(
    "iframe",
    {
      ...passthroughProps,
      id: id ?? data.embedUrl,
      title: data.alt ?? data.id ?? "external video",
      frameBorder,
      allow,
      allowFullScreen,
      src: finalUrl,
      loading
    }
  );
}
export {
  ExternalVideo
};
//# sourceMappingURL=ExternalVideo.mjs.map
