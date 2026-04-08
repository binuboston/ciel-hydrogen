import { readFile, writeFile, fileExists } from '@shopify/cli-kit/node/fs';
import { joinPath } from '@shopify/cli-kit/node/path';
import { renderConfirmationPrompt } from '@shopify/cli-kit/node/ui';
import { readAndParsePackageJson, writePackageJSON } from '@shopify/cli-kit/node/node-package-manager';
import { GENERATOR_SETUP_ASSETS_SUB_DIRS, getAssetDir } from '../../build.js';

const SETUP_CSS_STRATEGIES = GENERATOR_SETUP_ASSETS_SUB_DIRS;
function copyAssets(feature, assets, rootDirectory, replacer = (content, filename) => content) {
  const setupAssetsPath = getAssetDir(feature);
  return Promise.all(
    Object.entries(assets).map(async ([source, destination]) => {
      const content = await readFile(joinPath(setupAssetsPath, source));
      await writeFile(
        joinPath(rootDirectory, destination),
        replacer(content, source)
      );
    })
  );
}
async function canWriteFiles(assetMap, directory, force) {
  const fileExistPromises = Object.values(assetMap).map(
    (file) => fileExists(joinPath(directory, file)).then(
      (exists) => exists ? file : null
    )
  );
  const existingFiles = (await Promise.all(fileExistPromises)).filter(
    Boolean
  );
  if (existingFiles.length > 0) {
    if (!force) {
      const overwrite = await renderConfirmationPrompt({
        message: `Some files already exist (${existingFiles.join(
          ", "
        )}). Overwrite?`,
        defaultValue: false
      });
      if (!overwrite) {
        return false;
      }
    }
  }
  return true;
}
const MANAGED_PACKAGE_JSON_KEYS = Object.freeze([
  "dependencies",
  "devDependencies",
  "peerDependencies"
]);
async function mergePackageJson(feature, projectDir) {
  const targetPkgJson = await readAndParsePackageJson(
    joinPath(projectDir, "package.json")
  );
  const sourcePkgJson = await readAndParsePackageJson(
    joinPath(getAssetDir(feature), "package.json")
  );
  delete sourcePkgJson.comment;
  const unmanagedKeys = Object.keys(sourcePkgJson).filter(
    (key) => !MANAGED_PACKAGE_JSON_KEYS.includes(key)
  );
  for (const key of unmanagedKeys) {
    const sourceValue = sourcePkgJson[key];
    const targetValue = targetPkgJson[key];
    const newValue = Array.isArray(sourceValue) && Array.isArray(targetValue) ? [...targetValue, ...sourceValue] : typeof sourceValue === "object" && typeof targetValue === "object" ? { ...targetValue, ...sourceValue } : sourceValue;
    targetPkgJson[key] = newValue;
  }
  const remixVersion = Object.entries(targetPkgJson.dependencies || {}).find(
    ([dep]) => dep.startsWith("@remix-run/")
  )?.[1];
  for (const key of MANAGED_PACKAGE_JSON_KEYS) {
    if (sourcePkgJson[key]) {
      targetPkgJson[key] = [
        .../* @__PURE__ */ new Set([
          ...Object.keys(targetPkgJson[key] ?? {}),
          ...Object.keys(sourcePkgJson[key] ?? {})
        ])
      ].sort().reduce((acc, dep) => {
        let version = sourcePkgJson[key]?.[dep] ?? targetPkgJson[key]?.[dep];
        if (dep.startsWith("@remix-run/") && remixVersion) {
          version = remixVersion;
        }
        acc[dep] = version;
        return acc;
      }, {});
    }
  }
  await writePackageJSON(projectDir, targetPkgJson);
}

export { SETUP_CSS_STRATEGIES, canWriteFiles, copyAssets, mergePackageJson };
