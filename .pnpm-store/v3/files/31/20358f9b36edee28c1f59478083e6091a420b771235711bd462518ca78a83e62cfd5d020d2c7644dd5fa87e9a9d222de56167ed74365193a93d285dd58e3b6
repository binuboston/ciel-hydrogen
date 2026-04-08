import * as addPlugin from '@graphql-codegen/add';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptOperationPlugin from '@graphql-codegen/typescript-operations';
import { processSources } from './sources.js';
import { GENERATED_QUERY_INTERFACE_NAME, GENERATED_MUTATION_INTERFACE_NAME, plugin } from './plugin.js';

const defaultInterfaceExtensionCode = `
declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends ${GENERATED_QUERY_INTERFACE_NAME} {}
  interface StorefrontMutations extends ${GENERATED_MUTATION_INTERFACE_NAME} {}
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
    const sourcesWithOperations = processSources(options.documents);
    const sources = sourcesWithOperations.map(({ source }) => source);
    const importTypes = options.presetConfig.importTypes ?? true;
    const namespacedImportName = options.presetConfig.namespacedImportName ?? "StorefrontAPI";
    const importTypesFrom = options.presetConfig.importTypesFrom ?? "@shopify/hydrogen/storefront-api-types";
    const interfaceExtensionCode = options.presetConfig.interfaceExtension?.({
      queryType: GENERATED_QUERY_INTERFACE_NAME,
      mutationType: GENERATED_MUTATION_INTERFACE_NAME
    }) ?? defaultInterfaceExtensionCode;
    const pluginMap = {
      ...options.pluginMap,
      [`add`]: addPlugin,
      [`typescript`]: typescriptPlugin,
      [`typescript-operations`]: typescriptOperationPlugin,
      [`gen-dts`]: { plugin: plugin }
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

export { defaultInterfaceExtensionCode, preset };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=preset.js.map