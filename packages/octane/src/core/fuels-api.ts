/**
 * Executes a generic GraphQL query to the Fuel network.
 * @param {string} networkUrl - The URL of the Fuel network's GraphQL endpoint.
 * @param {string} query - The GraphQL query string.
 * @param {Record<string, any>} [variables] - Optional variables for the GraphQL query.
 * @returns {Promise<any>} A promise that resolves to the result of the GraphQL query.
 * @throws {Error} If the network URL is not provided or the fetch request fails.
 */
export async function executeGraphQLQuery(networkUrl: string, query: string, variables?: Record<string, any>): Promise<any> {
  if (!networkUrl) {
    throw new Error('Network URL is required to execute the GraphQL query');
  }

  const response = await fetch(networkUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL query failed with status: ${response.status}`);
  }

  const data = await response.json();
//   console.log('GraphQL Query Result:', data);
  return data;
}

/**
 * Checks the health of the Fuel network.
 * @returns {Promise<any>} A promise that resolves to the health status of the network.
 */
export async function getHealth(): Promise<any> {
  const query = '{ health }';
  const networkUrl = 'https://testnet.fuel.network/v1/graphql';
  return executeGraphQLQuery(networkUrl, query);
}
