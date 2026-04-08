import { Flags } from '@oclif/core';
import Command from '@shopify/cli-kit/node/base-command';
import { normalizeStoreFqdn } from '@shopify/cli-kit/node/context/fqdn';
import { commonFlags } from '../../lib/flags.js';
import { login, renderLoginSuccess } from '../../lib/auth.js';

class Login extends Command {
  static description = "Login to your Shopify account.";
  static flags = {
    path: commonFlags.path,
    shop: Flags.string({
      char: "s",
      description: "Shop URL. It can be the shop prefix (janes-apparel) or the full myshopify.com URL (janes-apparel.myshopify.com, https://janes-apparel.myshopify.com).",
      env: "SHOPIFY_SHOP",
      parse: async (input) => normalizeStoreFqdn(input)
    })
  };
  async run() {
    const { flags } = await this.parse(Login);
    await runLogin(flags);
  }
}
async function runLogin({
  path: root = process.cwd(),
  shop: shopFlag
}) {
  const { config } = await login(root, shopFlag ?? true);
  renderLoginSuccess(config);
}

export { Login as default };
