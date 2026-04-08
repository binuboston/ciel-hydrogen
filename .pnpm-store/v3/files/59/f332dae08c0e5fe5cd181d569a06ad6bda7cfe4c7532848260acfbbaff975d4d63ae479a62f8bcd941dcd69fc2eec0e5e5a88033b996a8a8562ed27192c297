import { diffLines } from 'diff';
import Command from '@shopify/cli-kit/node/base-command';
import { renderConfirmationPrompt, renderInfo, renderWarning, renderSuccess } from '@shopify/cli-kit/node/ui';
import { outputContent, outputToken, outputInfo } from '@shopify/cli-kit/node/output';
import { fileExists, readFile, writeFile } from '@shopify/cli-kit/node/fs';
import { resolvePath } from '@shopify/cli-kit/node/path';
import { patchEnvFile } from '@shopify/cli-kit/node/dot-env';
import colors from '@shopify/cli-kit/node/colors';
import { commonFlags, flagsToCamelObject } from '../../../lib/flags.js';
import { login } from '../../../lib/auth.js';
import { getCliCommand } from '../../../lib/shell.js';
import { renderMissingLink, renderMissingStorefront } from '../../../lib/render-errors.js';
import { linkStorefront } from '../link.js';
import { getStorefrontEnvVariables } from '../../../lib/graphql/admin/pull-variables.js';

class EnvPull extends Command {
  static description = "Populate your .env with variables from your Hydrogen storefront.";
  static flags = {
    ["env-branch"]: commonFlags.envBranch,
    path: commonFlags.path,
    force: commonFlags.force
  };
  async run() {
    const { flags } = await this.parse(EnvPull);
    await runEnvPull({ ...flagsToCamelObject(flags) });
  }
}
async function runEnvPull({
  envBranch,
  path: root = process.cwd(),
  force
}) {
  const [{ session, config }, cliCommand] = await Promise.all([
    login(root),
    getCliCommand()
  ]);
  if (!config.storefront?.id) {
    renderMissingLink({ session, cliCommand });
    const runLink = await renderConfirmationPrompt({
      message: outputContent`Run ${outputToken.genericShellCommand(
        `${cliCommand} link`
      )}?`.value
    });
    if (!runLink)
      return;
    config.storefront = await linkStorefront(root, session, config, {
      cliCommand
    });
  }
  if (!config.storefront?.id)
    return;
  const storefront = await getStorefrontEnvVariables(
    session,
    config.storefront.id,
    envBranch
  );
  if (!storefront) {
    renderMissingStorefront({
      session,
      storefront: config.storefront,
      cliCommand
    });
    return;
  }
  if (!storefront.environmentVariables.length) {
    outputInfo(`No environment variables found.`);
    return;
  }
  const variables = storefront.environmentVariables;
  if (!variables.length)
    return;
  const fileName = colors.whiteBright(`.env`);
  const dotEnvPath = resolvePath(root, ".env");
  const fetchedEnv = {};
  variables.forEach(({ isSecret, key, value }) => {
    fetchedEnv[key] = isSecret ? `""` : value;
  });
  if (await fileExists(dotEnvPath) && !force) {
    const existingEnv = await readFile(dotEnvPath);
    const patchedEnv = patchEnvFile(existingEnv, fetchedEnv);
    if (existingEnv === patchedEnv) {
      renderInfo({
        body: `No changes to your ${fileName} file`
      });
      return;
    }
    const diff = diffLines(existingEnv, patchedEnv);
    const overwrite = await renderConfirmationPrompt({
      confirmationMessage: `Yes, confirm changes`,
      cancellationMessage: `No, make changes later`,
      message: outputContent`We'll make the following changes to your .env file:

${outputToken.linesDiff(diff)}
Continue?`.value
    });
    if (!overwrite) {
      return;
    }
    await writeFile(dotEnvPath, patchedEnv);
  } else {
    const newEnv = patchEnvFile(null, fetchedEnv);
    await writeFile(dotEnvPath, newEnv);
  }
  const hasSecretVariables = variables.some(({ isSecret }) => isSecret);
  if (hasSecretVariables) {
    renderWarning({
      body: `${config.storefront.title} contains environment variables marked as secret, so their values weren\u2019t pulled.`
    });
  }
  renderSuccess({
    body: ["Changes have been made to your", { filePath: fileName }, "file"]
  });
}

export { EnvPull as default, runEnvPull };
