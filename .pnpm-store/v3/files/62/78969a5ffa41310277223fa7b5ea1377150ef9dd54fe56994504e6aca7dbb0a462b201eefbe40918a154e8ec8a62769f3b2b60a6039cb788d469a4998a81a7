'use strict';

var serverRuntime = require('@remix-run/server-runtime');

var i=new TextEncoder,u=async(e,t)=>{let r=await d(t,["sign"]),o=i.encode(e),a=await crypto.subtle.sign("HMAC",r,o),n=btoa(String.fromCharCode(...new Uint8Array(a))).replace(/=+$/,"");return e+"."+n},p=async(e,t)=>{let r=e.lastIndexOf("."),o=e.slice(0,r),a=e.slice(r+1),n=await d(t,["verify"]),s=i.encode(o),y=g(atob(a));return await crypto.subtle.verify("HMAC",n,y,s)?o:!1};async function d(e,t){return await crypto.subtle.importKey("raw",i.encode(e),{name:"HMAC",hash:"SHA-256"},!1,t)}function g(e){let t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}var c=serverRuntime.createCookieFactory({sign:u,unsign:p}),f=serverRuntime.createCookieSessionStorageFactory(c),l=serverRuntime.createSessionStorageFactory(c),H=serverRuntime.createMemorySessionStorageFactory(l);function F({build:e,mode:t,poweredByHeader:r=!0,getLoadContext:o}){let a=serverRuntime.createRequestHandler(e,t);return async n=>{let s=await a(n,await o?.(n));return r&&s.headers.append("powered-by","Shopify, Hydrogen"),s}}function M(e){return e.headers.get("oxygen-buyer-ip")??void 0}function A(e){let t=e.headers;return {requestGroupId:t.get("request-id"),buyerIp:t.get("oxygen-buyer-ip"),cookie:t.get("cookie")}}

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
exports.createCookie = c;
exports.createCookieSessionStorage = f;
exports.createMemorySessionStorage = H;
exports.createRequestHandler = F;
exports.createSessionStorage = l;
exports.getBuyerIp = M;
exports.getStorefrontHeaders = A;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map