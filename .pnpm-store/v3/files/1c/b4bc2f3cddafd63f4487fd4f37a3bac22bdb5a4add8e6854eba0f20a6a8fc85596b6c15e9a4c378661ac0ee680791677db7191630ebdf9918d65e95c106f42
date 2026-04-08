"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiniOxygen = void 0;
const core_1 = require("@miniflare/core");
const cache_1 = require("@miniflare/cache");
const runner_vm_1 = require("@miniflare/runner-vm");
const shared_1 = require("@miniflare/shared");
const queues_1 = require("@miniflare/queues");
const source_map_support_1 = __importDefault(require("source-map-support"));
const server_1 = require("./server");
const storage_1 = require("./storage");
const PLUGINS = {
    CorePlugin: core_1.CorePlugin,
    CachePlugin: cache_1.CachePlugin,
    BuildPlugin: core_1.BuildPlugin,
    BindingsPlugin: core_1.BindingsPlugin,
};
class MiniOxygen extends core_1.MiniflareCore {
    constructor(options, env) {
        if (options.sourceMap) {
            // Node has the --enable-source-maps flag, but this doesn't work for VM scripts.
            // It also doesn't expose a way of flushing the source map cache, which we need
            // so previous versions of worker code don't end up in stack traces.
            source_map_support_1.default.install({ emptyCacheBetweenOperations: true });
        }
        const storageFactory = new storage_1.StorageFactory();
        super(PLUGINS, {
            log: new shared_1.Log(shared_1.LogLevel.VERBOSE),
            storageFactory,
            scriptRunner: new runner_vm_1.VMScriptRunner(),
            queueBroker: new queues_1.QueueBroker(),
        }, {
            bindings: env,
            ...options,
        });
    }
    async dispose() {
        return super.dispose();
    }
    createServer(options) {
        return (0, server_1.createServer)(this, options);
    }
}
exports.MiniOxygen = MiniOxygen;
