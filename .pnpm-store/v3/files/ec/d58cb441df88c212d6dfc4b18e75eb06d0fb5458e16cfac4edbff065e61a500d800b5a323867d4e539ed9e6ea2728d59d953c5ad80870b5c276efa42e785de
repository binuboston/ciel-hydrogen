import { SourceWithOperations } from './plugin.js';
import { Source } from '@graphql-tools/utils';
import { OperationDefinitionNode, FragmentDefinitionNode } from 'graphql';
import '@graphql-codegen/plugin-helpers';

declare function processSources(sources: Array<Source>, buildName?: (node: OperationDefinitionNode | FragmentDefinitionNode) => string): SourceWithOperations[];

export { processSources };
