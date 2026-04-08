declare function patchGqlPluck(): Promise<void>;
/**
 * This is a modified version of graphql-tag-pluck's default config.
 * https://github.com/ardatan/graphql-tools/issues/5127
 */
declare const pluckConfig: {
    /**
     * Hook to determine if a node is a gql template literal.
     * By default, graphql-tag-pluck only looks for leading comments or `gql` tag.
     */
    isGqlTemplateLiteral: (node: any, options: any) => boolean;
    /**
     * Instruct how to extract the gql template literal from the code.
     * By default, embedded expressions in template literals (e.g. ${foo})
     * are removed from the template string. This hook allows us to annotate
     * the template string with the required embedded expressions instead of
     * removing them. Later, we can use this information to reconstruct the
     * embedded expressions.
     */
    pluckStringFromFile: (code: string, { start, end, leadingComments }: any) => string;
};

export { patchGqlPluck, pluckConfig };
