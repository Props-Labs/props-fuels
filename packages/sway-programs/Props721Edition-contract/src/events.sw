library;
use std::{string::String};
use standards::{src5::{State}, src7::{Metadata}};

pub struct ContractCreatedEvent {
    pub current_time: u64,
    pub block_height: u32,
    pub contract_id: ContractId,
    pub owner: Identity,
    pub name: String,
    pub symbol: String,
    pub metadata_keys: Vec<String>,
    pub metadata_values: Vec<Metadata>,
    pub price: u64,
    pub start: u64,
    pub end: u64
}

pub struct MintEvent {
    pub current_time: u64,
    pub block_height: u32,
    pub recipient: Identity,
    pub contract_id: ContractId,
    pub amount: u64,
    pub affiliate: Option<Identity>,
    pub proof: Option<Vec<b256>>,
    pub key: Option<u64>,
    pub num_leaves: Option<u64>,
    pub max_amount: Option<u64>,
    pub total_price: u64,
    pub total_fee: u64,
    pub stored_owner: State,
    pub price_amount: u64,
    pub builder_fee: u64,
    pub affiliate_fee: u64,
    pub fee: u64,
    pub creator_price: u64,
    pub new_sub_id: b256,
    pub is_airdrop: bool
}

pub struct AirdropEvent {
    pub current_time: u64,
    pub block_height: u32,
    pub recipient: Identity,
    pub contract_id: ContractId,
    pub amount: u64,
    pub stored_owner: State,
    pub new_sub_id: b256,
    pub is_airdrop: bool
}

pub struct BurnEvent {
    pub current_time: u64,
    pub block_height: u32,
    pub recipient: Identity,
    pub contract_id: ContractId,
    pub amount: u64,
    pub sub_id: SubId
}

pub struct SetMetadataEvent {
    pub current_time: u64,
    pub block_height: u32,
    pub sender: Identity,
    pub contract_id: ContractId,
    pub asset: AssetId,
    pub key: String,
    pub metadata: Metadata
}

pub struct SetMintPriceEvent {
    pub current_time: u64,
    pub block_height: u32,
    pub sender: Identity,
    pub contract_id: ContractId,
    pub price: u64
}

pub struct SetMintDatesEvent {
    pub current_time: u64,
    pub block_height: u32,
    pub sender: Identity,
    pub contract_id: ContractId,
    pub start: u64,
    pub end: u64
}

pub struct SetMerkleRootEvent {
    pub current_time: u64,
    pub block_height: u32,
    pub sender: Identity,
    pub contract_id: ContractId,
    pub root: b256,
    pub uri: String
}