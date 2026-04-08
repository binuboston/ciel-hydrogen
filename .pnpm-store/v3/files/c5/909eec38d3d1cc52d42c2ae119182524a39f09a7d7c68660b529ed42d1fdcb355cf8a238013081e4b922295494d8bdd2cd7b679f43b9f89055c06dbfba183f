import Command from '@shopify/cli-kit/node/base-command';
import { renderConfirmationPrompt } from '@shopify/cli-kit/node/ui';
import { pluralize } from '@shopify/cli-kit/common/string';
import colors from '@shopify/cli-kit/node/colors';
import { outputNewline, outputInfo, outputContent } from '@shopify/cli-kit/node/output';
import { linkStorefront } from '../link.js';
import { commonFlags } from '../../../lib/flags.js';
import { getStorefrontEnvironments } from '../../../lib/graphql/admin/list-environments.js';
import { renderMissingLink, renderMissingStorefront } from '../../../lib/render-errors.js';
import { login } from '../../../lib/auth.js';
import { getCliCommand } from '../../../lib/shell.js';

class EnvList extends Command {
  static description = "List the environments on your linked Hydrogen storefront.";
  static flags = {
    path: commonFlags.path
  };
  async run() {
    const { flags } = await this.parse(EnvList);
    await runEnvList(flags);
  }
}
async function runEnvList({ path: root = process.cwd() }) {
  const [{ session, config }, cliCommand] = await Promise.all([
    login(root),
    getCliCommand()
  ]);
  let configStorefront = config.storefront;
  if (!configStorefront?.id) {
    renderMissingLink({ session, cliCommand });
    const runLink = await renderConfirmationPrompt({
      message: ["Run", { command: `${cliCommand} link` }, "?"]
    });
    if (!runLink) {
      return;
    }
    configStorefront = await linkStorefront(root, session, config, {
      cliCommand
    });
  }
  if (!configStorefront)
    return;
  const storefront = await getStorefrontEnvironments(
    session,
    configStorefront.id
  );
  if (!storefront) {
    renderMissingStorefront({
      session,
      storefront: configStorefront,
      cliCommand
    });
    return;
  }
  const previewEnvironmentIndex = storefront.environments.findIndex(
    (env) => env.type === "PREVIEW"
  );
  const previewEnvironment = storefront.environments.splice(
    previewEnvironmentIndex,
    1
  );
  storefront.environments.push(previewEnvironment[0]);
  outputNewline();
  outputInfo(
    pluralizedEnvironments({
      environments: storefront.environments,
      storefrontTitle: configStorefront.title
    }).toString()
  );
  storefront.environments.forEach(({ name, branch, type, url }) => {
    outputNewline();
    const environmentUrl = type === "PRODUCTION" ? storefront.productionUrl : url;
    outputInfo(
      outputContent`${colors.whiteBright(name)}${branch ? ` ${colors.dim(`(Branch: ${branch})`)}` : ""}`.value
    );
    if (environmentUrl) {
      outputInfo(
        outputContent`    ${colors.whiteBright(environmentUrl)}`.value
      );
    }
  });
}
const pluralizedEnvironments = ({
  environments,
  storefrontTitle
}) => {
  return pluralize(
    environments,
    (environments2) => `Showing ${environments2.length} environments for the Hydrogen storefront ${storefrontTitle}`,
    (_environment) => `Showing 1 environment for the Hydrogen storefront ${storefrontTitle}`,
    () => `There are no environments for the Hydrogen storefront ${storefrontTitle}`
  );
};

export { EnvList as default, runEnvList };
