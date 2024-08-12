library;

use std::string::String;

pub enum MintError {
    CannotMintMoreThanOneNFTWithSubId: (),
    MaxNFTsMinted: (),
    NFTAlreadyMinted: (),
    NotEnoughTokens: u64,
    InvalidAsset: (),
    OutsideMintingPeriod: String,
    InvalidProof: (),
}

pub enum SetError {
    ValueAlreadySet: (),
}
