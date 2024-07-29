export type NFTMetadata = {
    name: string;
    description: string;
    image: string;
};

export type Edition = {
    id: string;
    name: string;
    metadata: NFTMetadata;
    tokens: string[];
};

export type Network = {
    id: string;
    name: string;
    url: string;
    port?: number;
    graphqlUrl?: string;
};