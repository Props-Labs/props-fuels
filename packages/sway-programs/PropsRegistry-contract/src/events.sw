library;
use std::{string::String};
use standards::{src5::{State}, src7::{Metadata}};

pub struct RegisterContractEvent {
    pub contract_id: ContractId,
    pub owner: Identity
}

pub struct DeregisterEvent {
    pub contract_id: ContractId,
}
