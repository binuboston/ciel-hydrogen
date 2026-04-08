import type { MiniOxygenServerOptions } from './mini-oxygen/server';
export declare type MiniOxygenPreviewOptions = MiniOxygenServerOptions & Partial<{
    log(message: string): unknown;
    port: number;
    workerFile: string;
    watch: boolean;
    modules: boolean;
    buildCommand: string;
    buildWatchPaths: string[];
    sourceMap: boolean;
    envPath: string;
    env: {
        [key: string]: unknown;
    };
}>;
export declare const configFileName = "mini-oxygen.config.json";
interface MiniOxygenPublicInstance {
    port: number;
    close: () => Promise<void>;
    reload: (options?: Partial<Pick<MiniOxygenPreviewOptions, 'env'>>) => Promise<void>;
}
export declare function preview(opts: MiniOxygenPreviewOptions): Promise<MiniOxygenPublicInstance>;
export {};
