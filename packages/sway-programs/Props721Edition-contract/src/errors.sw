library;

pub enum MintError {
    CannotMintMoreThanOneNFTWithSubId: (),
    MaxNFTsMinted: (),
    NFTAlreadyMinted: (),
    NotEnoughTokens: u64,
    InvalidAsset: ()
}

pub enum SetError {
    ValueAlreadySet: (),
}
