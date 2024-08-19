import { EditionCreateConfigurationOptions, Network } from "./types";

export const defaultNetwork: Network = {
  id: "testnet",
  name: "Testnet",
  url: "https://testnet.fuel.network/v1",
  graphqlUrl: "https://testnet.fuel.network/v1/graphql",
};

export const defaultStartDate: string = '4611686018427387904'; // TAI64 timestamp for Unix epoch (1970-01-01T00:00:00Z)
export const defaultEndDate: string = '4764231219200000000'; // TAI64 timestamp for 2099-12-31T23:59:59Z

export const registryContractAddress =
  "0x77c67dbb4814fd90085a6cb8880f2618b1e4a701483ee33678cd9fab1b3698e7";
