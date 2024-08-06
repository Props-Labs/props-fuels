import { EditionCreateConfigurationOptions, Network } from "./types";

export const defaultNetwork: Network = {
  id: "testnet",
  name: "Testnet",
  url: "https://testnet.fuel.network/v1",
  graphqlUrl: "https://testnet.fuel.network/v1/graphql",
};

// export const defaultEditionCreateConfigurationOptions: EditionCreateConfigurationOptions = {
//     maxSupply: 100,
// };