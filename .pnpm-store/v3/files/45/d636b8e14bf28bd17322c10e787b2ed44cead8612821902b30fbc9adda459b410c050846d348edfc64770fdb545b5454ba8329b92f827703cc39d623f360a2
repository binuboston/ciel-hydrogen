import { jsx } from "react/jsx-runtime";
import { createElement } from "react";
import { shopifyLoader } from "./Image.mjs";
function Video(props) {
  var _a;
  const {
    data,
    previewImageOptions,
    id = data.id,
    playsInline = true,
    controls = true,
    sourceProps = {},
    ...passthroughProps
  } = props;
  const posterUrl = shopifyLoader({
    src: ((_a = data.previewImage) == null ? void 0 : _a.url) ?? "",
    ...previewImageOptions
  });
  if (!data.sources) {
    throw new Error(`<Video/> requires a 'data.sources' array`);
  }
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    /* @__PURE__ */ jsx(
      "video",
      {
        ...passthroughProps,
        id,
        playsInline,
        controls,
        poster: posterUrl,
        children: data.sources.map((source) => {
          if (!((source == null ? void 0 : source.url) && (source == null ? void 0 : source.mimeType))) {
            throw new Error(`<Video/> needs 'source.url' and 'source.mimeType'`);
          }
          return /* @__PURE__ */ createElement(
            "source",
            {
              ...sourceProps,
              key: source.url,
              src: source.url,
              type: source.mimeType
            }
          );
        })
      }
    )
  );
}
export {
  Video
};
//# sourceMappingURL=Video.mjs.map
