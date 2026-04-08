import * as _remix_run_server_runtime from '@remix-run/server-runtime';
import { ServerBuild } from '@remix-run/server-runtime';
export { ActionArgs, ActionFunction, AppData, AppLoadContext, Cookie, CookieOptions, CookieParseOptions, CookieSerializeOptions, CookieSignatureOptions, DataFunctionArgs, EntryContext, ErrorBoundaryComponent, HandleDataRequestFunction, HandleDocumentRequestFunction, HeadersFunction, HtmlLinkDescriptor, HtmlMetaDescriptor, LinkDescriptor, LinksFunction, LoaderArgs, LoaderFunction, MaxPartSizeExceededError, MemoryUploadHandlerFilterArgs, MemoryUploadHandlerOptions, MetaDescriptor, MetaFunction, PageLinkDescriptor, RequestHandler, RouteComponent, RouteHandle, SerializeFrom, ServerBuild, ServerEntryModule, Session, SessionData, SessionIdStorageStrategy, SessionStorage, SignFunction, TypedResponse, UnsignFunction, UploadHandler, UploadHandlerPart, V2_ServerRuntimeMetaDescriptor as V2_HtmlMetaDescriptor, V2_ServerRuntimeMetaArgs as V2_MetaArgs, V2_ServerRuntimeMetaDescriptor as V2_MetaDescriptor, V2_ServerRuntimeMetaFunction as V2_MetaFunction, createSession, defer, isCookie, isSession, json, redirect, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from '@remix-run/server-runtime';

declare const createCookie: _remix_run_server_runtime.CreateCookieFunction;
declare const createCookieSessionStorage: _remix_run_server_runtime.CreateCookieSessionStorageFunction;
declare const createSessionStorage: _remix_run_server_runtime.CreateSessionStorageFunction;
declare const createMemorySessionStorage: _remix_run_server_runtime.CreateMemorySessionStorageFunction;

declare function createRequestHandler<Context = unknown>({ build, mode, poweredByHeader, getLoadContext, }: {
    build: ServerBuild;
    mode?: string;
    poweredByHeader?: boolean;
    getLoadContext?: (request: Request) => Promise<Context> | Context;
}): (request: Request) => Promise<Response>;
declare function getBuyerIp(request: Request): string | undefined;
type StorefrontHeaders = {
    requestGroupId: string | null;
    buyerIp: string | null;
    cookie: string | null;
};
declare function getStorefrontHeaders(request: Request): StorefrontHeaders;

export { createCookie, createCookieSessionStorage, createMemorySessionStorage, createRequestHandler, createSessionStorage, getBuyerIp, getStorefrontHeaders };
