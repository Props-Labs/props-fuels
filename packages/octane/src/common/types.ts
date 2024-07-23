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