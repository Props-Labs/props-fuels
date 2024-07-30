import { Account } from "fuels";
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

export type EditionCreateConfigurationOptions = {
    /**
     * The maximum number of tokens that can be minted for the edition.
     */
    maxSupply: number;
    account: Account;
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

export type OctaneConfigurationOptions = {
    /**
     * The API key to authenticate requests. If not provided, a default API key will be used.
     */
    apiKey?: string;
    /**
     * The network to connect to, identified by its unique ID.
     */
    network: typeof supportedNetworks[number]['id'];
};