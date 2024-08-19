library;
use std::{string::String};
use standards::{src5::{State}, src7::{Metadata}};

pub struct RegisterEvent {
    pub contract_id: ContractId,
    pub owner: Identity
}

pub struct DeregisterEvent {
    pub contract_id: ContractId,
}

pub struct InitCollectionEvent {
    pub contract_id: ContractId,
    pub owner: Identity,
    pub name: String,
    pub symbol: String,
    pub base_uri: String,
    pub price: u64,
    pub start_date: u64,
    pub end_date: u64,
}

pub struct InitEditionEvent {
    pub contract_id: ContractId,
    pub owner: Identity,
    pub name: String,
    pub symbol: String,
    pub metadata_keys: Vec<String>,
    pub metadata_values: Vec<Metadata>,
    pub price: u64,
    pub start_date: u64,
    pub end_date: u64,
}
