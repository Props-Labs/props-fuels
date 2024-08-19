library;
use std::string::String;
use standards::{src7::{Metadata}};

abi PropsRegistry {
    #[storage(read, write)]
    fn init_contract(contract_id: ContractId, owner: Identity, name: String);

    #[storage(read, write)]
    fn constructor(owner: Identity);
}