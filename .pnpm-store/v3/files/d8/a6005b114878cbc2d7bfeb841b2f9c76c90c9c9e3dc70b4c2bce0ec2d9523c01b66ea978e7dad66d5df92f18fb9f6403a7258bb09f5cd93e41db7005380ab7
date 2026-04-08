'use strict';

var fs = require('fs/promises');
var path = require('path');
var node_module = require('node:module');
var node_url = require('node:url');

async function patchGqlPluck() {
  const require2 = node_module.createRequire((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('out.js', document.baseURI).href)));
  const realGqlTagPluck = require2.resolve("@graphql-tools/graphql-tag-pluck");
  const depth = path.extname((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('out.js', document.baseURI).href))) === ".ts" ? "../" : "../../";
  const vendorGqlTagPluck = node_url.fileURLToPath(
    new URL(depth + "/vendor/graphql-tag-pluck", (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('out.js', document.baseURI).href)))
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

exports.patchGqlPluck = patchGqlPluck;
exports.pluckConfig = pluckConfig;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=pluck.cjs.map