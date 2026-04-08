"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const storefrontApiConstants = require("./storefront-api-constants.js");
function createStorefrontClient(props) {
  const {
    storeDomain,
    privateStorefrontToken,
    publicStorefrontToken,
    storefrontApiVersion = storefrontApiConstants.SFAPI_VERSION,
    contentType
  } = props;
  if (!storeDomain) {
    throw new Error(
      H2_PREFIX_ERROR + `\`storeDomain\` is required when creating a new Storefront client.
Received "${storeDomain}".`
    );
  }
  if (storefrontApiVersion !== storefrontApiConstants.SFAPI_VERSION) {
    warnOnce(
      `The Storefront API version that you're using is different than the version this build of Hydrogen React is targeting.
You may run into unexpected errors if these versions don't match. Received verion: "${storefrontApiVersion}"; expected version "${storefrontApiConstants.SFAPI_VERSION}"`
    );
  }
  const isMockShop = (domain) => domain.includes("mock.shop");
  const getShopifyDomain = (overrideProps) => {
    const domain = (overrideProps == null ? void 0 : overrideProps.storeDomain) ?? storeDomain;
    return domain.includes("://") ? domain : `https://${domain}`;
  };
  return {
    getShopifyDomain,
    getStorefrontApiUrl(overrideProps) {
      const domain = getShopifyDomain(overrideProps);
      const apiUrl = domain + (domain.endsWith("/") ? "api" : "/api");
      if (isMockShop(domain))
        return apiUrl;
      return `${apiUrl}/${(overrideProps == null ? void 0 : overrideProps.storefrontApiVersion) ?? storefrontApiVersion}/graphql.json`;
    },
    getPrivateTokenHeaders(overrideProps) {
      if (!privateStorefrontToken && !(overrideProps == null ? void 0 : overrideProps.privateStorefrontToken) && !isMockShop(storeDomain)) {
        throw new Error(
          H2_PREFIX_ERROR + "You did not pass in a `privateStorefrontToken` while using `createStorefrontClient()` or `getPrivateTokenHeaders()`"
        );
      }
      const finalContentType = (overrideProps == null ? void 0 : overrideProps.contentType) ?? contentType;
      return {
        // default to json
        "content-type": finalContentType === "graphql" ? "application/graphql" : "application/json",
        "X-SDK-Variant": "hydrogen-react",
        "X-SDK-Variant-Source": "react",
        "X-SDK-Version": storefrontApiVersion,
        "Shopify-Storefront-Private-Token": (overrideProps == null ? void 0 : overrideProps.privateStorefrontToken) ?? privateStorefrontToken ?? "",
        ...(overrideProps == null ? void 0 : overrideProps.buyerIp) ? { "Shopify-Storefront-Buyer-IP": overrideProps.buyerIp } : {}
      };
    },
    getPublicTokenHeaders(overrideProps) {
      if (!publicStorefrontToken && !(overrideProps == null ? void 0 : overrideProps.publicStorefrontToken) && !isMockShop(storeDomain)) {
        throw new Error(
          H2_PREFIX_ERROR + "You did not pass in a `publicStorefrontToken` while using `createStorefrontClient()` or `getPublicTokenHeaders()`"
        );
      }
      const finalContentType = (overrideProps == null ? void 0 : overrideProps.contentType) ?? contentType ?? "json";
      return getPublicTokenHeadersRaw(
        finalContentType,
        storefrontApiVersion,
        (overrideProps == null ? void 0 : overrideProps.publicStorefrontToken) ?? publicStorefrontToken ?? ""
      );
    }
  };
}
function getPublicTokenHeadersRaw(contentType, storefrontApiVersion, accessToken) {
  return {
    // default to json
    "content-type": contentType === "graphql" ? "application/graphql" : "application/json",
    "X-SDK-Variant": "hydrogen-react",
    "X-SDK-Variant-Source": "react",
    "X-SDK-Version": storefrontApiVersion,
    "X-Shopify-Storefront-Access-Token": accessToken
  };
}
const warnings = /* @__PURE__ */ new Set();
const H2_PREFIX_ERROR = "[h2:error:createStorefrontClient] ";
const H2_PREFIX_WARN = "[h2:warn:createStorefrontClient] ";
const warnOnce = (string) => {
  if (!warnings.has(string)) {
    console.warn(H2_PREFIX_WARN + string);
    warnings.add(string);
  }
};
exports.createStorefrontClient = createStorefrontClient;
exports.getPublicTokenHeadersRaw = getPublicTokenHeadersRaw;
//# sourceMappingURL=storefront-client.js.map
