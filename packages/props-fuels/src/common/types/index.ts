import { Account, BN, TransactionResult } from "fuels";
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
    /**
     * The external URL to the NFT.
     */
    external_url?: string;
    /**
     * The background color of the NFT item.
     */
    background_color?: string;
    /**
     * The URL to a multimedia attachment for the NFT.
     */
    animation_url?: string;
    /**
     * The URL to a YouTube video associated with the NFT.
     */
    youtube_url?: string;
    /**
     * Attributes associated with the NFT.
     */
    attributes?: Array<{
        /**
         * The trait type of the attribute.
         */
        trait_type: string;
        /**
         * The value of the attribute.
         */
        value: string | number;
        /**
         * The display type of the attribute (optional).
         */
        display_type?: string;
        /**
         * The maximum value of the attribute (optional).
         */
        max_value?: number;
    }>;

    [key: string]: any;
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

export type CollectionCreateOptions = {
    /**
     * The name of the collection to create.
     */
    name: string;
    /**
     * The symbol of the collection.
     */
    symbol: string;
    /**
     * The base URI for the collection's token metadata.
     */
    baseUri: string;
    /**
     * The price of tokens in the collection (optional).
     */
    price?: number;
    /**
     * The configuration options for the collection creation.
     */
    options: CollectionCreateConfigurationOptions;
};

export type CollectionCreateConfigurationOptions = {
    /**
     * The account associated with the collection creation. Cannot be changed after deployment.
     */
    owner: Account;
    /**
     * The maximum number of tokens that can be minted for the collection. Defaults to unlimited. Cannot be changed after deployment.
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
    /**
     * Flag to disable airdrop functionality (optional). Cannot be changed after deployment.
     */
    disableAirdrop?: boolean;
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
export type MintResult = {
    /**
     * The unique identifier for the minted edition.
     */
    id: string;
    /**
     * The result of the transaction associated with the mint operation.
     */
    transactionResult: TransactionResult;
};

