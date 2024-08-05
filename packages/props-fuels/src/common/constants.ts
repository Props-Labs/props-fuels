import { Address } from "fuels";
import { Network } from "./types"

export const supportedProps721EditionContractConfigurableOptions: Array<string> =
  [
    "maxSupply",
    "builderFeeAddress",
    "builderFee",
    "builderRevenueShareAddress",
    "builderRevenueSharePercentage",
    "disableAirdrop"
  ];

export const supportedProps721EditionContractConfigurableOptionsMapping: Record<
  string,
  string
> = {
  maxSupply: "MAX_SUPPLY",
  builderFeeAddress: "BUILDER_FEE_ADDRESS",
  builderFee: "BUILDER_FEE",
  builderRevenueShareAddress: "BUILDER_REVENUE_SHARE_ADDRESS",
  builderRevenueSharePercentage: "BUILDER_REVENUE_SHARE_PERCENTAGE",
  disableAirdrop: "DISABLE_AIRDROP",
};

export const configurableOptionsTypeMapping: Record<string, (value: any) => any> = {
  maxSupply: (value: number) => {
    if (typeof value !== 'number' || value < 0) {
      throw new Error("Invalid maxSupply: must be a non-negative number");
    }
    return value;
  },
  builderFeeAddress: (value: string) => {
    try {
      return { bits: Address.fromDynamicInput(value).toB256() };
    } catch (error) {
      throw new Error(`Invalid builderFeeAddress: ${error}`);
    }
  },
  builderFee: (value: number) => {
    if (isNaN(value) || value < 0) {
      throw new Error("Invalid builderFee: must be a non-negative number");
    }
    return value;
  },
  builderRevenueShareAddress: (value: string) => {
    try {
      return { bits: Address.fromDynamicInput(value).toB256() };
    } catch (error) {
      throw new Error(`Invalid builderRevenueShareAddress: ${error}`);
    }
  },
  builderRevenueSharePercentage: (value: number) => {
    if (typeof value !== 'number' || value < 0 || value > 100) {
      throw new Error("Invalid builderRevenueSharePercentage: must be a number between 0 and 100");
    }
    return value;
  },
  disableAirdrop: (value: boolean) => {
    if (typeof value !== 'boolean') {
      throw new Error("Invalid disableAirdrop: must be a boolean");
    }
    return value;
  },
};


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