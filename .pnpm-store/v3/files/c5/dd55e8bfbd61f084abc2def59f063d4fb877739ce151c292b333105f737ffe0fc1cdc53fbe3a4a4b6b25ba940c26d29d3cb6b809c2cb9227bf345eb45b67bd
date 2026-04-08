"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const cookie = require("worktop/cookie");
const cartConstants = require("./cart-constants.js");
const cookiesUtils = require("./cookies-utils.js");
const longTermLength = 60 * 60 * 24 * 360 * 1;
const shortTermLength = 60 * 30;
function useShopifyCookies(options) {
  const { hasUserConsent = false, domain = "" } = options || {};
  React.useEffect(() => {
    const cookies = cookiesUtils.getShopifyCookies(document.cookie);
    if (hasUserConsent) {
      setCookie(
        cartConstants.SHOPIFY_Y,
        cookies[cartConstants.SHOPIFY_Y] || cookiesUtils.buildUUID(),
        longTermLength,
        domain
      );
      setCookie(
        cartConstants.SHOPIFY_S,
        cookies[cartConstants.SHOPIFY_S] || cookiesUtils.buildUUID(),
        shortTermLength,
        domain
      );
    } else {
      setCookie(cartConstants.SHOPIFY_Y, "", 0, domain);
      setCookie(cartConstants.SHOPIFY_S, "", 0, domain);
    }
  });
}
function setCookie(name, value, maxage, domain) {
  document.cookie = cookie.stringify(name, value, {
    maxage,
    domain,
    samesite: "Lax",
    path: "/"
  });
}
exports.useShopifyCookies = useShopifyCookies;
//# sourceMappingURL=useShopifyCookies.js.map
