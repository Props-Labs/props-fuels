library;

use std::string::String;
use std::vec::Vec;
use standards::src7::Metadata;

abi PropsRegistry {
    #[storage(read, write)]
    fn register(contractId: ContractId, owner: Identity);

    #[storage(read, write)]
    fn deregister(contractId: ContractId);

    #[storage(read, write)]
    fn constructor(owner: Identity);

    #[storage(read, write)]
    fn init_edition(contract_id: ContractId, owner: Identity, name: String, symbol: String, metadata_keys: Vec<String>, metadata_values: Vec<Metadata>, price: u64, start_date: u64, end_date: u64);

    #[storage(read, write)]
    fn init_collection(contract_id: ContractId, owner: Identity, name: String, symbol: String, baseUri: String, price: u64, startDate: u64, endDate: u64);
}