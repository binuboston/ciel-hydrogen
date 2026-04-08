import { adminRequest } from './client.js';

const PullVariablesQuery = `#graphql
  query PullVariables($id: ID!, $branch: String) {
    hydrogenStorefront(id: $id) {
      id
      environmentVariables(branchName: $branch) {
        id
        isSecret
        key
        value
      }
    }
  }
`;
async function getStorefrontEnvVariables(adminSession, storefrontId, envBranch) {
  const { hydrogenStorefront } = await adminRequest(
    PullVariablesQuery,
    adminSession,
    {
      id: storefrontId,
      branch: envBranch
    }
  );
  return hydrogenStorefront;
}

export { getStorefrontEnvVariables };
