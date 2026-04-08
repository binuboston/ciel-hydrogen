import { Types } from '@graphql-codegen/plugin-helpers';

type HydrogenPresetConfig = {
    /**
     * Name for the variable that contains the imported types.
     * @default 'StorefrontAPI'
     */
    namespacedImportName?: string;
    /**
     * Module to import the types from.
     * @default '@shopify/hydrogen/storefront-api-types'
     */
    importTypesFrom?: string;
    /**
     * Whether types should be imported from the `importTypesFrom` module, or generated inline.
     * @default true
     */
    importTypes?: boolean;
    /**
     * Whether to skip adding `__typename` to generated operation types.
     * @default true
     */
    skipTypenameInOperations?: boolean;
    /**
     * Override the default interface extension.
     */
    interfaceExtension?: (options: {
        queryType: string;
        mutationType: string;
    }) => string;
};
declare const defaultInterfaceExtensionCode: string;
declare const preset: Types.OutputPreset<HydrogenPresetConfig>;

export { HydrogenPresetConfig, defaultInterfaceExtensionCode, preset };
