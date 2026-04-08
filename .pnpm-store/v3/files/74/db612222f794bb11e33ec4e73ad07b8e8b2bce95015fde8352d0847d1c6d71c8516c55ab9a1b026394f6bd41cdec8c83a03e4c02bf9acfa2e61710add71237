import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { Source } from '@graphql-tools/utils';
import { OperationDefinitionNode, FragmentDefinitionNode } from 'graphql';

type OperationOrFragment = {
    initialName: string;
    definition: OperationDefinitionNode | FragmentDefinitionNode;
};
type SourceWithOperations = {
    source: Source;
    operations: Array<OperationOrFragment>;
};
declare const plugin: PluginFunction<{
    sourcesWithOperations: Array<SourceWithOperations>;
    interfaceExtensionCode: string;
}>;
declare const GENERATED_QUERY_INTERFACE_NAME = "GeneratedQueryTypes";
declare const GENERATED_MUTATION_INTERFACE_NAME = "GeneratedMutationTypes";

export { GENERATED_MUTATION_INTERFACE_NAME, GENERATED_QUERY_INTERFACE_NAME, OperationOrFragment, SourceWithOperations, plugin };
