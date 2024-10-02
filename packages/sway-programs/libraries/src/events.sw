library;
use std::{string::String};
use standards::{src5::{State}, src7::{Metadata}};

pub struct MintEvent {
    pub recipient: Identity,
    pub amount: u64,
    pub affiliate: Identity,
    pub max_amount: u64,
    pub total_price: u64,
    pub total_fee: u64,
    pub price_amount: u64,
    pub builder_fee: u64,
    pub affiliate_fee: u64,
    pub fee: u64,
    pub creator_price: u64,
    pub asset_id: AssetId,
    pub new_minted_id: u64
}

pub struct AirdropEvent {
    pub recipient: Identity,
    pub amount: u64,
    pub new_minted_id: u64
}

pub struct BurnEvent {
    pub amount: u64,
    pub sub_id: SubId
}

pub struct SetMetadataEvent {
    pub asset: AssetId,
    pub key: String,
    pub metadata: Metadata
}

pub struct SetMintPriceEvent {
    pub price: u64
}

pub struct SetMintDatesEvent {
    pub start: u64,
    pub end: u64
}

pub struct SetMerkleRootEvent {
    pub root: b256,
    pub uri: String
}

pub struct SetBaseUriEvent {
    pub base_uri: String
}
