import { spawnSync } from 'child_process';
import { outputDebug } from '@shopify/cli-kit/node/output';

const EXPERIMENTAL_VM_MODULES_FLAG = "--experimental-vm-modules";
const hook = async function(options) {
  if (options.id && ["hydrogen:dev", "hydrogen:preview"].includes(options.id) && !process.execArgv.includes(EXPERIMENTAL_VM_MODULES_FLAG) && !(process.env.NODE_OPTIONS ?? "").includes(EXPERIMENTAL_VM_MODULES_FLAG)) {
    outputDebug(
      `Restarting CLI process with ${EXPERIMENTAL_VM_MODULES_FLAG} flag.`
    );
    const [command, ...args] = process.argv;
    args.unshift(EXPERIMENTAL_VM_MODULES_FLAG);
    spawnSync(command, args, { stdio: "inherit" });
    process.exit(0);
  }
};
var init_default = hook;

export { init_default as default };
