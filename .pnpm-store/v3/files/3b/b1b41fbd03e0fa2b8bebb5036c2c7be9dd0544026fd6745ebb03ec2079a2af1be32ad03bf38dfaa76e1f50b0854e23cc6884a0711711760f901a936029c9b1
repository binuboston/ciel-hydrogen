/// <reference types="node" />
import { CorePlugin, MiniflareCore, MiniflareCoreOptions, BuildPlugin, BindingsPlugin } from '@miniflare/core';
import { CachePlugin } from '@miniflare/cache';
import { MiniOxygenServerOptions } from './server';
declare const PLUGINS: {
    CorePlugin: typeof CorePlugin;
    CachePlugin: typeof CachePlugin;
    BuildPlugin: typeof BuildPlugin;
    BindingsPlugin: typeof BindingsPlugin;
};
export declare type MiniOxygenType = typeof PLUGINS;
declare type MiniOxygenOptions = MiniflareCoreOptions<MiniOxygenType> & {
    sourceMap?: boolean;
};
export declare class MiniOxygen extends MiniflareCore<MiniOxygenType> {
    constructor(options: MiniOxygenOptions, env: {
        [key: string]: unknown;
    });
    dispose(): Promise<void>;
    createServer(options: MiniOxygenServerOptions): import("http").Server;
}
export {};
