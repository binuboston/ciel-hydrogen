"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockProxyServer = exports.sendRequest = exports.createFixture = void 0;
const path_1 = require("path");
const http_1 = __importDefault(require("http"));
const fs_extra_1 = require("fs-extra");
async function createFixture(name) {
    const directory = (0, path_1.resolve)(__dirname, 'fixtures', name);
    const paths = {
        root: directory,
        config: (0, path_1.join)(directory, 'mini-oxygen.config.json'),
        workerFile: (0, path_1.join)(directory, 'worker.mjs'),
        assets: (0, path_1.join)(directory, 'assets'),
    };
    await (0, fs_extra_1.ensureDir)(directory);
    await (0, fs_extra_1.ensureDir)(paths.assets);
    await (0, fs_extra_1.writeFile)((0, path_1.join)(directory, '.gitignore'), '*');
    await (0, fs_extra_1.writeFile)((0, path_1.join)(directory, 'mini-oxygen.config.json'), JSON.stringify({
        workerFile: 'worker.mjs',
        watch: true,
        env: { TESTING: 123, HELLO: 12345 },
    }, null, 2));
    await (0, fs_extra_1.writeFile)((0, path_1.join)(directory, 'package.json'), JSON.stringify({
        name: 'test-worker',
        version: '1.0.0',
        description: 'A test worker',
        main: 'worker.mjs',
        license: 'MIT',
        type: 'module',
    }, null, 2));
    await (0, fs_extra_1.writeFile)((0, path_1.join)(directory, 'worker.mjs'), `
export default {
  async fetch(request, environment, context) {
    if (new URL(request.url).pathname === '/html') {
      return new Response('<html><body>Hello, world</body>', {
        headers: {"Content-Type": "text/html"}
      });
    }

    return new Response(JSON.stringify(environment), {
      headers: {"Content-Type": "application/json"}
    });
  }
}
    `.trim());
    await (0, fs_extra_1.writeFile)((0, path_1.join)(paths.assets, 'star.svg'), `<svg><polygon points="100,10 40,198 190,78 10,78 160,198" style="fill:gold;"/></svg>`.trim());
    return {
        paths,
        destroy: async () => {
            await (0, fs_extra_1.remove)(paths.assets);
            await (0, fs_extra_1.remove)(directory);
        },
        updateWorker: () => {
            return (0, fs_extra_1.writeFile)((0, path_1.join)(directory, 'worker.mjs'), `
export default {
  async fetch(request, environment, context) {
    return new Response('<html><body><q>Forty-two</q> said Deep Thought, with infinite majesty and calm.</body>', {
      headers: {"Content-Type": "text/html"}
    });
  }
}
        `);
        },
    };
}
exports.createFixture = createFixture;
async function sendRequest(port, path) {
    return new Promise((resolve, _reject) => {
        http_1.default.get(`http://localhost:${port}${path}`, (response) => {
            let data = '';
            response
                .on('data', (chunk) => {
                data += chunk;
            })
                .on('end', () => {
                resolve({
                    mimeType: response.headers['content-type'],
                    data,
                });
            });
        });
    });
}
exports.sendRequest = sendRequest;
function createMockProxyServer(port) {
    const onRequest = (_req, res) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('bogus content', 'utf8');
    };
    return http_1.default.createServer(onRequest).listen(port);
}
exports.createMockProxyServer = createMockProxyServer;
