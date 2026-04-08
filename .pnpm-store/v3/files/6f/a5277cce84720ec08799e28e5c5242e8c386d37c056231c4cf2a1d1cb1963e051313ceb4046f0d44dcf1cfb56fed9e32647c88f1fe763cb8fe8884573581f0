import path from 'path';
import { fileURLToPath } from 'url';
import recursiveReaddir from 'recursive-readdir';

const VIRTUAL_ROUTES_DIR = "virtual-routes/routes";
const VIRTUAL_ROOT = "virtual-routes/virtual-root";
async function addVirtualRoutes(config) {
  const userRouteList = Object.values(config.routes);
  const distPath = fileURLToPath(new URL("..", import.meta.url));
  const virtualRoutesPath = path.join(distPath, VIRTUAL_ROUTES_DIR);
  for (const absoluteFilePath of await recursiveReaddir(virtualRoutesPath)) {
    const relativeFilePath = path.relative(virtualRoutesPath, absoluteFilePath);
    const routePath = relativeFilePath.replace(/\.[jt]sx?$/, "").replaceAll("\\", "/");
    const isIndex = /(^|\/)index$/.test(routePath);
    const normalizedVirtualRoutePath = isIndex ? routePath.slice(0, -"index".length).replace(/\/$/, "") || void 0 : routePath.replace(/\$/g, ":").replace(/[\[\]]/g, "");
    const hasUserRoute = userRouteList.some(
      (r) => r.parentId === "root" && r.path === normalizedVirtualRoutePath
    );
    if (!hasUserRoute) {
      const id = VIRTUAL_ROUTES_DIR + "/" + routePath;
      config.routes[id] = {
        id,
        parentId: VIRTUAL_ROOT,
        path: normalizedVirtualRoutePath,
        index: isIndex || void 0,
        caseSensitive: void 0,
        file: path.relative(config.appDirectory, absoluteFilePath)
      };
      if (!config.routes[VIRTUAL_ROOT]) {
        config.routes[VIRTUAL_ROOT] = {
          id: VIRTUAL_ROOT,
          path: "",
          file: path.relative(
            config.appDirectory,
            path.join(distPath, VIRTUAL_ROOT + ".jsx")
          )
        };
      }
    }
  }
  return config;
}

export { VIRTUAL_ROOT, VIRTUAL_ROUTES_DIR, addVirtualRoutes };
