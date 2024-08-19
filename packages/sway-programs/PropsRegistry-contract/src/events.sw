library;
use std::{string::String};

pub struct InitContractEvent {
    pub contract_id: ContractId,
    pub owner: Identity,
    pub name: String
}