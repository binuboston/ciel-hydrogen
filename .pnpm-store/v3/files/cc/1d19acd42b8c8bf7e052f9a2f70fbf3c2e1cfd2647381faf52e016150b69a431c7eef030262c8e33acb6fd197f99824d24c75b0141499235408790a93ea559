'use strict';

//! import {createRequire} from 'module'; const require = createRequire(import.meta.url);
const getSchema = () => require.resolve("@shopify/hydrogen-react/storefront.schema.json");
let staticSchema = "";
try {
  staticSchema = getSchema();
} catch (error) {
  console.warn(
    "[hydrogen-codegen] storefront.schema.json not found. Is `@shopify/hydrogen` installed?\n",
    error.message
  );
}
const schema = staticSchema;

exports.getSchema = getSchema;
exports.schema = schema;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=schema.cjs.map