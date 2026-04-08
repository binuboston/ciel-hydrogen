import { AbortError } from '@shopify/cli-kit/node/error';
import { copyFile } from '@shopify/cli-kit/node/fs';
import { joinPath } from '@shopify/cli-kit/node/path';
import { renderTasks, renderInfo } from '@shopify/cli-kit/node/ui';
import { getLatestTemplates } from '../template-downloader.js';
import { handleProjectLocation, createAbortHandler, handleLanguage, createInitialCommit, handleDependencies, commitAll, renderProjectReady } from './common.js';

async function setupRemoteTemplate(options, controller) {
  const isOfficialTemplate = options.template === "demo-store" || options.template === "hello-world";
  if (!isOfficialTemplate) {
    throw new AbortError(
      "Only `demo-store` and `hello-world` are supported in --template flag for now.",
      "Skip the --template flag to run the setup flow."
    );
  }
  const appTemplate = options.template;
  const backgroundDownloadPromise = getLatestTemplates({
    signal: controller.signal
  }).catch((error) => {
    throw abort(error);
  });
  const project = await handleProjectLocation({ ...options, controller });
  if (!project)
    return;
  const abort = createAbortHandler(controller, project);
  let backgroundWorkPromise = backgroundDownloadPromise.then(
    ({ templatesDir }) => copyFile(joinPath(templatesDir, appTemplate), project.directory).catch(
      abort
    )
  );
  const { language, transpileProject } = await handleLanguage(
    project.directory,
    controller,
    options.language
  );
  backgroundWorkPromise = backgroundWorkPromise.then(() => transpileProject().catch(abort)).then(
    () => options.git ? createInitialCommit(project.directory) : void 0
  );
  const { packageManager, shouldInstallDeps, installDeps } = await handleDependencies(
    project.directory,
    controller,
    options.installDeps
  );
  const setupSummary = {
    language,
    packageManager,
    depsInstalled: false,
    hasCreatedShortcut: false
  };
  const tasks = [
    {
      title: "Downloading template",
      task: async () => {
        await backgroundDownloadPromise;
      }
    },
    {
      title: "Setting up project",
      task: async () => {
        await backgroundWorkPromise;
      }
    }
  ];
  if (shouldInstallDeps) {
    tasks.push({
      title: "Installing dependencies. This could take a few minutes",
      task: async () => {
        try {
          await installDeps();
          setupSummary.depsInstalled = true;
        } catch (error) {
          setupSummary.depsError = error;
        }
      }
    });
  }
  await renderTasks(tasks);
  if (options.git) {
    await commitAll(project.directory, "Lockfile");
  }
  await renderProjectReady(project, setupSummary);
  if (isOfficialTemplate) {
    renderInfo({
      headline: `Your project will display inventory from ${options.template === "demo-store" ? "the Hydrogen Demo Store" : "Mock.shop"}.`,
      body: `To connect this project to your Shopify store\u2019s inventory, update \`${project.name}/.env\` with your store ID and Storefront API key.`
    });
  }
  return {
    ...project,
    ...setupSummary
  };
}

export { setupRemoteTemplate };
