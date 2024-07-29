import { Network } from "./types"

export const supportedNetworks: Network[] = [
  {
    id: "local",
    name: "Local Node",
    url: "https://127.0.0.1",
    port: 4000,
  },
  {
    id: "testnet",
    name: "Testnet",
    url: "https://testnet.fuel.network",
    graphqlUrl: "https://testnet.fuel.network/graphql",
  },
  {
    id: "beta-5",
    name: "Beta-5",
    url: "https://testnet.fuel.network",
    graphqlUrl: "https://testnet.fuel.network/graphql",
  },
];