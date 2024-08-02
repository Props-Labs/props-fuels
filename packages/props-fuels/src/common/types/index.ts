import { Account, TransactionResult } from "fuels";
import { supportedNetworks } from "../constants";

export type NFTMetadata = {
    /**
     * The name of the NFT.
     */
    name: string;
    /**
     * The description of the NFT.
     */
    description: string;
    /**
     * The image URL of the NFT.
     */
    image: string;
};

export type Edition = {
    /**
     * The unique identifier for the edition.
     */
    id: string;
    /**
     * The name of the edition.
     */
    name: string;
    /**
     * The metadata associated with the edition.
     */
    metadata: NFTMetadata;
    /**
     * The list of token identifiers associated with the edition.
     */
    tokens: string[];
};

export type EditionCreateOptions = {
    /**
     * The name of the edition to create.
     */
    name: string;
    /**
     * The symbol of the edition to create.
     */
    symbol: string;
    /**
     * The metadata for the edition.
     */
    metadata: NFTMetadata;
    /**
     * The price of the edition on the Base Asset (Wei, ETH).
     */
    price?: number;
    /**
     * The configuration options for the edition creation.
     */
    options: EditionCreateConfigurationOptions;
};

export type EditionCreateConfigurationOptions = {
  /**
   * The account associated with the edition creation. Cannot be changed after deployment.
   */
  owner: Account;
  /**
   * The maximum number of tokens that can be minted for the edition. Defaults to 3. Cannot be changed after deployment.
   */
  maxSupply?: number;
  /**
   * The address where the builder fee will be sent (optional). Cannot be changed after deployment.
   */
  builderFeeAddress?: string;
  /**
   * The percentage of the builder fee (optional). Cannot be changed after deployment.
   */
  builderFee?: number;
  /**
   * The address where the builder's revenue share will be sent (optional). Cannot be changed after deployment.
   */
  builderRevenueShareAddress?: string;
  /**
   * The percentage of the builder's revenue share (optional). Cannot be changed after deployment.
   */
  builderRevenueSharePercentage?: number;
  /**
   * The percentage of the affiliate fee (optional). Cannot be changed after deployment.
   */
  affiliateFeePercentage?: number;
};

export type Network = {
    /**
     * The unique identifier for the network.
     */
    id: string;
    /**
     * The name of the network.
     */
    name: string;
    /**
     * The URL of the network.
     */
    url: string;
    /**
     * The port number for the network (optional).
     */
    port?: number;
    /**
     * The GraphQL URL for the network (optional).
     */
    graphqlUrl?: string;
};

export type PropsConfigurationOptions = {
    /**
     * The API key to authenticate requests. If not provided, a default API key will be used.
     */
    apiKey?: string;
    /**
     * The network to connect to, identified by its unique ID.
     */
    network: typeof supportedNetworks[number]['id'];
};

/**
 * Represents the result of an edition mint operation.
 */
export type EditionMintResult = {
    /**
     * The unique identifier for the minted edition.
     */
    id: string;
    /**
     * The result of the transaction associated with the mint operation.
     */
    transactionResult: TransactionResult;
};