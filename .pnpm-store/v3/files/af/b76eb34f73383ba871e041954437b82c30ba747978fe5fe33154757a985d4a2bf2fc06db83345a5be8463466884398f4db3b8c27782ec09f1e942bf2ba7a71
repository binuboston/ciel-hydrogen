/// <reference types="node" />
import http from 'http';
export interface Fixture {
    destroy(): Promise<void>;
    paths: {
        root: string;
        config: string;
        assets: string;
        workerFile: string;
    };
    updateWorker: () => Promise<void>;
}
export declare function createFixture(name: string): Promise<Fixture>;
export declare function sendRequest(port: number, path: string): Promise<unknown>;
export declare function createMockProxyServer(port: number): http.Server;
