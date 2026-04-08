import { useEffect } from "react";
import { stringify } from "worktop/cookie";
import { SHOPIFY_Y, SHOPIFY_S } from "./cart-constants.mjs";
import { getShopifyCookies, buildUUID } from "./cookies-utils.mjs";
const longTermLength = 60 * 60 * 24 * 360 * 1;
const shortTermLength = 60 * 30;
function useShopifyCookies(options) {
  const { hasUserConsent = false, domain = "" } = options || {};
  useEffect(() => {
    const cookies = getShopifyCookies(document.cookie);
    if (hasUserConsent) {
      setCookie(
        SHOPIFY_Y,
        cookies[SHOPIFY_Y] || buildUUID(),
        longTermLength,
        domain
      );
      setCookie(
        SHOPIFY_S,
        cookies[SHOPIFY_S] || buildUUID(),
        shortTermLength,
        domain
      );
    } else {
      setCookie(SHOPIFY_Y, "", 0, domain);
      setCookie(SHOPIFY_S, "", 0, domain);
    }
  });
}
function setCookie(name, value, maxage, domain) {
  document.cookie = stringify(name, value, {
    maxage,
    domain,
    samesite: "Lax",
    path: "/"
  });
}
export {
  useShopifyCookies
};
//# sourceMappingURL=useShopifyCookies.mjs.map
