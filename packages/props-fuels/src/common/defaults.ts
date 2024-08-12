import { EditionCreateConfigurationOptions, Network } from "./types";

export const defaultNetwork: Network = {
  id: "testnet",
  name: "Testnet",
  url: "https://testnet.fuel.network/v1",
  graphqlUrl: "https://testnet.fuel.network/v1/graphql",
};

export const defaultStartDate: number = 4611686018427387904; // TAI64 timestamp for Unix epoch (1970-01-01T00:00:00Z)
export const defaultEndDate: number = 4764231219200000000; // TAI64 timestamp for 2099-12-31T23:59:59Z

// export const defaultEditionCreateConfigurationOptions: EditionCreateConfigurationOptions = {
//     maxSupply: 100,
// };