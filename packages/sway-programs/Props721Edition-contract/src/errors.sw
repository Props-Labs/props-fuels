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
    ExceededMaxMintLimit: (),
}

pub enum SetError {
    ValueAlreadySet: (),
}
