"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const mime_1 = __importDefault(require("mime"));
const core_1 = require("@miniflare/core");
const connect_1 = __importDefault(require("connect"));
const body_parser_1 = __importDefault(require("body-parser"));
// https://shopify.dev/docs/custom-storefronts/oxygen/worker-runtime-apis#custom-headers
const OXYGEN_HEADERS_MAP = {
    ip: { name: 'oxygen-buyer-ip', defaultValue: '127.0.0.1' },
    longitude: { name: 'oxygen-buyer-longitude', defaultValue: '-122.40140' },
    latitude: { name: 'oxygen-buyer-latitude', defaultValue: '37.78855' },
    continent: { name: 'oxygen-buyer-continent', defaultValue: 'NA' },
    country: { name: 'oxygen-buyer-country', defaultValue: 'US' },
    region: { name: 'oxygen-buyer-region', defaultValue: 'California' },
    regionCode: { name: 'oxygen-buyer-region-code', defaultValue: 'CA' },
    city: { name: 'oxygen-buyer-city', defaultValue: 'San Francisco' },
    isEuCountry: { name: 'oxygen-buyer-is-eu-country', defaultValue: '' },
    timezone: {
        name: 'oxygen-buyer-timezone',
        defaultValue: 'America/Los_Angeles',
    },
    // Not documented but available in Oxygen:
    deploymentId: { name: 'oxygen-buyer-deployment-id', defaultValue: 'local' },
    shopId: { name: 'oxygen-buyer-shop-id', defaultValue: 'development' },
    storefrontId: {
        name: 'oxygen-buyer-storefront-id',
        defaultValue: 'development',
    },
};
const SSEUrl = '/__minioxygen_events';
const autoReloadScript = `<script defer type="application/javascript">
(function () {
  // MiniOxygen Auto Reload
  var source = new EventSource('${SSEUrl}');
  source.addEventListener('open', function(e) { console.log('Auto Reload Enabled') }, false);
  source.onmessage = function(e) { if (e.data === 'connected') {console.log('Listening for events...');} else if (e.data === 'reload') {location.reload();} };
})();
</script>`;
const autoReloadScriptLength = Buffer.byteLength(autoReloadScript);
function createAssetMiddleware({ assetsDir, publicPath, proxyServer, }) {
    return (req, res, next) => {
        var _a;
        if (assetsDir === undefined) {
            return next();
        }
        if (shouldProxy(req, proxyServer)) {
            return next();
        }
        const url = new URL(req.url || '/', `http://${req.headers.host}`);
        let filePath;
        if (publicPath === undefined || publicPath === '') {
            const pathname = url.pathname.substring(1);
            if (pathname === '') {
                return next();
            }
            filePath = path_1.default.join(assetsDir, pathname);
        }
        else {
            let pathname = url.pathname;
            // publicPath must always have a trailing slash
            if (pathname.startsWith(publicPath)) {
                pathname = pathname.substring(publicPath.length);
                filePath = path_1.default.join(assetsDir, pathname);
            }
            else {
                return next();
            }
        }
        if ((_a = fs_1.default.lstatSync(filePath, { throwIfNoEntry: false })) === null || _a === void 0 ? void 0 : _a.isFile()) {
            const rs = fs_1.default.createReadStream(filePath);
            const { size } = fs_1.default.statSync(filePath);
            res.setHeader('Content-Type', mime_1.default.getType(filePath) || 'application/octet-stream');
            res.setHeader('Content-Length', size);
            return rs.pipe(res);
        }
        next();
    };
}
function writeSSE(res, data) {
    const id = new Date().toLocaleTimeString();
    res.write(`id: ${id}\n`);
    res.write(`data: ${data}\n\n`);
}
function createAutoReloadMiddleware(mf) {
    return (req, res) => {
        if (req.headers.accept && req.headers.accept === 'text/event-stream') {
            mf.addEventListener('reload', () => writeSSE(res, 'reload'));
            res.writeHead(200, {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'text/event-stream',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            });
            return writeSSE(res, 'connected');
        }
        else {
            res.writeHead(400).end('Bad Request');
        }
    };
}
function createRequestMiddleware(mf, { autoReload, proxyServer, oxygenHeaders, onRequest, onResponse, onResponseError, }) {
    return async (req, res) => {
        var _a;
        if (shouldProxy(req, proxyServer)) {
            return sendProxyRequest(req, res, proxyServer);
        }
        let response;
        let status = 500;
        const headers = {};
        const reqHeaders = {};
        // eslint-disable-next-line guard-for-in
        for (const key in req.headers) {
            const val = req.headers[key];
            if (Array.isArray(val)) {
                reqHeaders[key] = val.join(',');
            }
            else if (val !== undefined) {
                reqHeaders[key] = val;
            }
        }
        for (const [key, { name, defaultValue }] of Object.entries(OXYGEN_HEADERS_MAP)) {
            if (!reqHeaders[name]) {
                reqHeaders[name] =
                    (_a = oxygenHeaders === null || oxygenHeaders === void 0 ? void 0 : oxygenHeaders[key]) !== null && _a !== void 0 ? _a : defaultValue;
            }
        }
        const request = new core_1.Request(urlFromRequest(req), {
            method: req.method,
            headers: reqHeaders,
            body: req.method !== 'GET' && req.method !== 'HEAD'
                ? req.body
                : null,
        });
        try {
            if (onRequest)
                await onRequest(request);
            response = await mf.dispatchFetch(request);
            if (onResponse)
                await onResponse(request, response);
            status = response.status;
            for (const key of response.headers.keys()) {
                const val = key.toLowerCase() === 'set-cookie'
                    ? response.headers.getAll(key)
                    : response.headers.get(key);
                headers[key] = val;
            }
            const shouldAutoreload = autoReload && response.headers.get('content-type') === 'text/html';
            if (shouldAutoreload) {
                const contentLength = response.headers.get('content-length');
                if (contentLength) {
                    headers['content-length'] =
                        parseInt(contentLength, 10) + autoReloadScriptLength;
                }
            }
            res.writeHead(status, headers);
            if (response.body) {
                for await (const chunk of response.body) {
                    res.write(chunk);
                }
                if (shouldAutoreload) {
                    res.write(autoReloadScript);
                }
            }
            res.end();
        }
        catch (err) {
            onResponseError === null || onResponseError === void 0 ? void 0 : onResponseError(request, err);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            res.writeHead(status, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.end(err.stack, 'utf8');
        }
    };
}
function sendProxyRequest(req, res, proxyServer) {
    const proxyRequest = new Promise(function (_resolve, reject) {
        const url = urlFromRequest(req);
        const options = {
            host: proxyServer.split(':')[0],
            port: parseInt(proxyServer.split(':')[1], 10),
            path: `${url.protocol}//${url.host}${url.pathname}`,
            headers: {
                ...req.headers,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'mini-Oxygen-Proxy': 'true',
            },
            timeout: 3000,
        };
        const request = http_1.default.get(options, (response) => {
            const statusCode = response.statusCode || 0;
            res.writeHead(statusCode, response.statusMessage);
            response.pipe(res);
            return response;
        });
        request.on('timeout', () => {
            request.destroy();
            const error = new Error('connection to proxy timed out');
            reject(error);
        });
    });
    proxyRequest.catch((err) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end(err.stack, 'utf8');
        return res;
    });
}
function createServer(mf, { assetsDir, publicPath, autoReload = false, proxyServer, ...rest }) {
    const app = (0, connect_1.default)();
    if (assetsDir) {
        app.use(createAssetMiddleware({ assetsDir, publicPath, proxyServer }));
    }
    if (autoReload) {
        app.use(SSEUrl, createAutoReloadMiddleware(mf));
    }
    app.use(body_parser_1.default.raw({ type: '*/*' }));
    app.use(createRequestMiddleware(mf, { autoReload, proxyServer, ...rest }));
    const server = http_1.default.createServer(app);
    return server;
}
exports.createServer = createServer;
function urlFromRequest(req) {
    var _a, _b;
    const protocol = req.socket.encrypted ? 'https' : 'http';
    const origin = `${protocol}://${(_a = req.headers.host) !== null && _a !== void 0 ? _a : 'localhost'}`;
    const url = new URL((_b = req.url) !== null && _b !== void 0 ? _b : '', origin);
    return url;
}
function shouldProxy(req, proxyServer) {
    return (typeof proxyServer !== 'undefined' &&
        proxyServer !== '' &&
        !req.headers['mini-oxygen-proxy']);
}
