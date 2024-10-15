import { EditionCreateConfigurationOptions, Network } from "./types";

export const availableNetworks: Network[] = [
  {
    id: "testnet",
    name: "Testnet",
    url: "https://testnet.fuel.network/v1",
    graphqlUrl: "https://testnet.fuel.network/v1/graphql",
  },
  {
    id: "mainnet",
    name: "Mainnet",
    url: "https://mainnet.fuel.network/v1",
    graphqlUrl: "https://mainnet.fuel.network/v1/graphql",
  },
];

export const defaultNetwork: Network = {
  id: "testnet",
  name: "Testnet",
  url: "https://testnet.fuel.network/v1",
  graphqlUrl: "https://testnet.fuel.network/v1/graphql",
};

export const defaultStartDate: string = '4611686018427387904'; // TAI64 timestamp for Unix epoch (1970-01-01T00:00:00Z)
export const defaultEndDate: string = '4764231219200000000'; // TAI64 timestamp for 2099-12-31T23:59:59Z

// mainnet
// export const registryContractAddress =
//   "0xc6e6c19f5a8bc4d505eb0725e4b93b5494bcbf7d53253be303c83a921df9ea70";

// test
export const registryContractAddress =
  "0x386162f4c6bbec1c5d868b1e7c67068c9854e09b3338c4adb221ff488140456e";

export const registryContractAddresses: Record<string, string> = {
  testnet: "0xc6e6c19f5a8bc4d505eb0725e4b93b5494bcbf7d53253be303c83a921df9ea70",
  mainnet: "0xc6e6c19f5a8bc4d505eb0725e4b93b5494bcbf7d53253be303c83a921df9ea70",
  // Add other network IDs and their corresponding addresses here
};

// export const feeSplitterContractAddress =
//   "0xe63564f83a2b82b97ea3f42d1680eeca825e3596b76da197ea4f6f6595810562";

export const feeSplitterContractAddress =
  "0xd92c81da30e4fba3dcaaf3cc363b8b22a08fa34ef3f1a37fa06bfbc5f651014a";

export const feeSplitterContractAddresses: Record<string, string> = {
  testnet: "0xe63564f83a2b82b97ea3f42d1680eeca825e3596b76da197ea4f6f6595810562",
  mainnet: "0xe63564f83a2b82b97ea3f42d1680eeca825e3596b76da197ea4f6f6595810562",
  // Add other network IDs and their corresponding addresses here
};