"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const eventsource_1 = __importDefault(require("eventsource"));
const preview_1 = require("../preview");
const utils_1 = require("./utils");
const testPort = 1337;
// get-port does not detect a released port correctly in the testing environment
vitest_1.vi.mock('get-port', () => {
    return {
        default: () => testPort,
    };
});
(0, vitest_1.describe)('preview()', () => {
    let fixture;
    const defaultOptions = {
        log: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(async () => {
        fixture = await (0, utils_1.createFixture)('basic-fixture');
    });
    (0, vitest_1.afterEach)(async () => {
        await fixture.destroy();
    });
    const mockLogger = vitest_1.vi.fn();
    (0, vitest_1.it)('displays a message when the server is running', async () => {
        const miniOxygen = await (0, preview_1.preview)({
            ...defaultOptions,
            log: mockLogger,
            port: testPort,
            workerFile: fixture.paths.workerFile,
        });
        await miniOxygen.close();
        (0, vitest_1.expect)(mockLogger).toHaveBeenCalledWith(`\nStarted miniOxygen server. Listening at http://localhost:${testPort}\n`);
    });
    (0, vitest_1.it)('receives HTML from test worker', async () => {
        const miniOxygen = await (0, preview_1.preview)({
            ...defaultOptions,
            log: mockLogger,
            port: testPort,
            workerFile: fixture.paths.workerFile,
        });
        let receivedData;
        let mimeType;
        await (0, utils_1.sendRequest)(testPort, '/html').then(async (response) => {
            receivedData = response.data;
            mimeType = response.mimeType;
            await miniOxygen.close();
        });
        (0, vitest_1.expect)(receivedData).toBe('<html><body>Hello, world</body>');
        (0, vitest_1.expect)(mimeType).toBe('text/html');
    });
    (0, vitest_1.it)('serves a static asset', async () => {
        const miniOxygen = await (0, preview_1.preview)({
            ...defaultOptions,
            log: mockLogger,
            port: testPort,
            workerFile: fixture.paths.workerFile,
            assetsDir: fixture.paths.assets,
        });
        let receivedData;
        let mimeType;
        await (0, utils_1.sendRequest)(testPort, '/star.svg').then(async (response) => {
            receivedData = response.data;
            mimeType = response.mimeType;
            await miniOxygen.close();
        });
        (0, vitest_1.expect)(receivedData).toBe('<svg><polygon points="100,10 40,198 190,78 10,78 160,198" style="fill:gold;"/></svg>');
    });
    (0, vitest_1.it)('includes the auto-reload script and sends reload event on worker change', async () => {
        const miniOxygen = await (0, preview_1.preview)({
            ...defaultOptions,
            log: mockLogger,
            port: testPort,
            workerFile: fixture.paths.workerFile,
            autoReload: true,
            watch: true,
        });
        let receivedData;
        await (0, utils_1.sendRequest)(testPort, '/html').then((response) => {
            receivedData = response.data;
        });
        (0, vitest_1.expect)(receivedData).toContain('// MiniOxygen Auto Reload');
        const eventStream = new eventsource_1.default(`http://localhost:${testPort}/__minioxygen_events`);
        const eventsCaught = [];
        eventStream.addEventListener('message', (event) => eventsCaught.push(event));
        fixture.updateWorker();
        // we need a short timeout to allow the "reload" event on the MiniOxygen instance to fire
        await new Promise((resolve, _reject) => {
            setTimeout(() => resolve(null), 500);
        });
        (0, vitest_1.expect)(eventsCaught.length).toBe(2);
        (0, vitest_1.expect)(eventsCaught[0].data).toBe('connected');
        (0, vitest_1.expect)(eventsCaught[1].data).toBe('reload');
        await miniOxygen.close();
    });
    (0, vitest_1.it)('proxies requests to a proxy server', async () => {
        const mockLogger = vitest_1.vi.fn();
        const proxyPort = 1338;
        const proxyServer = (0, utils_1.createMockProxyServer)(proxyPort);
        proxyServer.on('connection', () => {
            mockLogger('Proxy request received');
        });
        const miniOxygen = await (0, preview_1.preview)({
            ...defaultOptions,
            port: testPort,
            workerFile: fixture.paths.workerFile,
            proxyServer: `localhost:${proxyPort}`,
        });
        let receivedData;
        await (0, utils_1.sendRequest)(testPort, '/html').then((response) => {
            receivedData = response.data;
        });
        (0, vitest_1.expect)(mockLogger).toHaveBeenLastCalledWith(`Proxy request received`);
        (0, vitest_1.expect)(receivedData).toBe('bogus content');
        await miniOxygen.close();
        proxyServer.close();
    });
    (0, vitest_1.it)('reloads environment variables', async () => {
        const miniOxygen = await (0, preview_1.preview)({
            ...defaultOptions,
            log: mockLogger,
            port: testPort,
            workerFile: fixture.paths.workerFile,
            env: { test: 'foo' },
        });
        let response = (await (0, utils_1.sendRequest)(testPort, '/'));
        (0, vitest_1.expect)(response.data).toEqual(JSON.stringify({ test: 'foo' }));
        await miniOxygen.reload({ env: { test: 'bar' } });
        response = (await (0, utils_1.sendRequest)(testPort, '/'));
        (0, vitest_1.expect)(response.data).toEqual(JSON.stringify({ test: 'bar' }));
        await miniOxygen.close();
    });
});
