'use strict';

var addPlugin = require('@graphql-codegen/add');
var typescriptPlugin = require('@graphql-codegen/typescript');
var typescriptOperationPlugin = require('@graphql-codegen/typescript-operations');
var sources_js = require('./sources.cjs');
var plugin_js = require('./plugin.cjs');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var addPlugin__namespace = /*#__PURE__*/_interopNamespaceDefault(addPlugin);
var typescriptPlugin__namespace = /*#__PURE__*/_interopNamespaceDefault(typescriptPlugin);
var typescriptOperationPlugin__namespace = /*#__PURE__*/_interopNamespaceDefault(typescriptOperationPlugin);

const defaultInterfaceExtensionCode = `
declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends ${plugin_js.GENERATED_QUERY_INTERFACE_NAME} {}
  interface StorefrontMutations extends ${plugin_js.GENERATED_MUTATION_INTERFACE_NAME} {}
}`;
const preset = {
  buildGeneratesSection: (options) => {
    if (!options.baseOutputDir.endsWith(".d.ts")) {
      throw new Error("[hydrogen-preset] target output should be a .d.ts file");
    }
    if (options.plugins?.length > 0 && Object.keys(options.plugins).some((p) => p.startsWith("typescript"))) {
      throw new Error(
        "[hydrogen-preset] providing additional typescript-based `plugins` leads to duplicated generated types"
      );
    }
    const sourcesWithOperations = sources_js.processSources(options.documents);
    const sources = sourcesWithOperations.map(({ source }) => source);
    const importTypes = options.presetConfig.importTypes ?? true;
    const namespacedImportName = options.presetConfig.namespacedImportName ?? "StorefrontAPI";
    const importTypesFrom = options.presetConfig.importTypesFrom ?? "@shopify/hydrogen/storefront-api-types";
    const interfaceExtensionCode = options.presetConfig.interfaceExtension?.({
      queryType: plugin_js.GENERATED_QUERY_INTERFACE_NAME,
      mutationType: plugin_js.GENERATED_MUTATION_INTERFACE_NAME
    }) ?? defaultInterfaceExtensionCode;
    const pluginMap = {
      ...options.pluginMap,
      [`add`]: addPlugin__namespace,
      [`typescript`]: typescriptPlugin__namespace,
      [`typescript-operations`]: typescriptOperationPlugin__namespace,
      [`gen-dts`]: { plugin: plugin_js.plugin }
    };
    const plugins = [
      {
        [`add`]: {
          content: `/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */`
        }
      },
      importTypes ? {
        [`add`]: {
          content: `import * as ${namespacedImportName} from '${importTypesFrom}';
`
        }
      } : {
        [`typescript`]: {
          useTypeImports: true,
          useImplementingTypes: true,
          enumsAsTypes: true
        }
      },
      {
        [`typescript-operations`]: {
          useTypeImports: true,
          preResolveTypes: false,
          mergeFragmentTypes: true,
          skipTypename: options.presetConfig.skipTypenameInOperations ?? true,
          namespacedImportName: importTypes ? namespacedImportName : void 0
        }
      },
      { [`gen-dts`]: { sourcesWithOperations, interfaceExtensionCode } },
      ...options.plugins
    ];
    return [
      {
        filename: options.baseOutputDir,
        plugins,
        pluginMap,
        schema: options.schema,
        config: {
          defaultScalarType: "unknown",
          ...options.config
        },
        documents: sources,
        documentTransforms: options.documentTransforms
      }
    ];
  }
};

exports.defaultInterfaceExtensionCode = defaultInterfaceExtensionCode;
exports.preset = preset;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=preset.cjs.map