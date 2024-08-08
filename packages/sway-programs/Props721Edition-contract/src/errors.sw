library;

pub enum MintError {
    CannotMintMoreThanOneNFTWithSubId: (),
    MaxNFTsMinted: (),
    NFTAlreadyMinted: (),
    NotEnoughTokens: u64,
    InvalidAsset: (),
    InvalidProof: (),
}

pub enum SetError {
    ValueAlreadySet: (),
}
