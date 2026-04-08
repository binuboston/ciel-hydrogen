import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

async function patchGqlPluck() {
  const require2 = createRequire(import.meta.url);
  const realGqlTagPluck = require2.resolve("@graphql-tools/graphql-tag-pluck");
  const depth = path.extname(import.meta.url) === ".ts" ? "../" : "../../";
  const vendorGqlTagPluck = fileURLToPath(
    new URL(depth + "/vendor/graphql-tag-pluck", import.meta.url)
  );
  await fs.copyFile(
    path.join(vendorGqlTagPluck, "visitor.cjs"),
    realGqlTagPluck.replace(/index\.js$/, "visitor.js")
  );
  await fs.copyFile(
    path.join(vendorGqlTagPluck, "visitor.mjs"),
    realGqlTagPluck.replace("cjs", "esm").replace(/index\.js$/, "visitor.js")
  );
}
const pluckConfig = {
  isGqlTemplateLiteral: (node, options) => {
    const hasInternalGqlComment = node.type === "TemplateLiteral" && /\s*#graphql\s*\n/i.test(node.quasis[0]?.value?.raw || "");
    if (hasInternalGqlComment)
      return true;
    const { leadingComments } = node;
    const leadingComment = leadingComments?.[leadingComments?.length - 1];
    const leadingCommentValue = leadingComment?.value?.trim().toLowerCase();
    return leadingCommentValue === options?.gqlMagicComment;
  },
  pluckStringFromFile: (code, { start, end, leadingComments }) => {
    let gqlTemplate = code.slice(start + 1, end - 1).replace(/\$\{([^}]*)\}/g, (_, m1) => "#REQUIRED_VAR=" + m1).split("\\`").join("`");
    const chunkStart = leadingComments?.[0]?.start ?? start;
    const codeBeforeNode = code.slice(0, chunkStart);
    const [, varName] = codeBeforeNode.match(/\s(\w+)\s*=\s*$/) || [];
    if (varName) {
      gqlTemplate += "#VAR_NAME=" + varName;
    }
    return gqlTemplate;
  }
};

export { patchGqlPluck, pluckConfig };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=pluck.js.map