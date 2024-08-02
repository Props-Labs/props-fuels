import { EditionCreateConfigurationOptions, Network } from "./types";

export const defaultNetwork: Network = {
  id: "testnet",
  name: "Testnet",
  url: "https://testnet.fuel.network",
  graphqlUrl: "https://testnet.fuel.network/graphql",
};

// export const defaultEditionCreateConfigurationOptions: EditionCreateConfigurationOptions = {
//     maxSupply: 100,
// };