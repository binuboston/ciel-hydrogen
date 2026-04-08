'use strict';

var serverRuntime = require('@remix-run/server-runtime');

// src/implementations.ts

// src/crypto.ts
var encoder = new TextEncoder();
var sign = async (value, secret) => {
  const key = await createKey(secret, ["sign"]);
  const data = encoder.encode(value);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const hash = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(
    /=+$/,
    ""
  );
  return value + "." + hash;
};
var unsign = async (signed, secret) => {
  const index = signed.lastIndexOf(".");
  const value = signed.slice(0, index);
  const hash = signed.slice(index + 1);
  const key = await createKey(secret, ["verify"]);
  const data = encoder.encode(value);
  const signature = byteStringToUint8Array(atob(hash));
  const valid = await crypto.subtle.verify("HMAC", key, signature, data);
  return valid ? value : false;
};
async function createKey(secret, usages) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usages
  );
  return key;
}
function byteStringToUint8Array(byteString) {
  const array = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    array[i] = byteString.charCodeAt(i);
  }
  return array;
}

// src/implementations.ts
var createCookie = serverRuntime.createCookieFactory({ sign, unsign });
var createCookieSessionStorage = serverRuntime.createCookieSessionStorageFactory(createCookie);
var createSessionStorage = serverRuntime.createSessionStorageFactory(createCookie);
var createMemorySessionStorage = serverRuntime.createMemorySessionStorageFactory(createSessionStorage);
function createRequestHandler({
  build,
  mode,
  poweredByHeader = true,
  getLoadContext
}) {
  const handleRequest = serverRuntime.createRequestHandler(build, mode);
  return async (request) => {
    const response = await handleRequest(
      request,
      await getLoadContext?.(request)
    );
    if (poweredByHeader) {
      response.headers.append("powered-by", "Shopify, Hydrogen");
    }
    return response;
  };
}
function getBuyerIp(request) {
  return request.headers.get("oxygen-buyer-ip") ?? void 0;
}
function getStorefrontHeaders(request) {
  const headers = request.headers;
  return {
    requestGroupId: headers.get("request-id"),
    buyerIp: headers.get("oxygen-buyer-ip"),
    cookie: headers.get("cookie")
  };
}

Object.defineProperty(exports, 'MaxPartSizeExceededError', {
  enumerable: true,
  get: function () { return serverRuntime.MaxPartSizeExceededError; }
});
Object.defineProperty(exports, 'createSession', {
  enumerable: true,
  get: function () { return serverRuntime.createSession; }
});
Object.defineProperty(exports, 'defer', {
  enumerable: true,
  get: function () { return serverRuntime.defer; }
});
Object.defineProperty(exports, 'isCookie', {
  enumerable: true,
  get: function () { return serverRuntime.isCookie; }
});
Object.defineProperty(exports, 'isSession', {
  enumerable: true,
  get: function () { return serverRuntime.isSession; }
});
Object.defineProperty(exports, 'json', {
  enumerable: true,
  get: function () { return serverRuntime.json; }
});
Object.defineProperty(exports, 'redirect', {
  enumerable: true,
  get: function () { return serverRuntime.redirect; }
});
Object.defineProperty(exports, 'unstable_composeUploadHandlers', {
  enumerable: true,
  get: function () { return serverRuntime.unstable_composeUploadHandlers; }
});
Object.defineProperty(exports, 'unstable_createMemoryUploadHandler', {
  enumerable: true,
  get: function () { return serverRuntime.unstable_createMemoryUploadHandler; }
});
Object.defineProperty(exports, 'unstable_parseMultipartFormData', {
  enumerable: true,
  get: function () { return serverRuntime.unstable_parseMultipartFormData; }
});
exports.createCookie = createCookie;
exports.createCookieSessionStorage = createCookieSessionStorage;
exports.createMemorySessionStorage = createMemorySessionStorage;
exports.createRequestHandler = createRequestHandler;
exports.createSessionStorage = createSessionStorage;
exports.getBuyerIp = getBuyerIp;
exports.getStorefrontHeaders = getStorefrontHeaders;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map