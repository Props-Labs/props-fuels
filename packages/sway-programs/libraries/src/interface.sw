library;

use std::string::String;
use std::bytes::Bytes;
use standards::{src5::{State}, src7::{Metadata}};

abi PropsRegistry {
    #[storage(read, write)]
    fn register(contractId: ContractId, owner: Identity);

    #[storage(read, write)]
    fn deregister(contractId: ContractId);

    #[storage(read, write)]
    fn constructor(owner: Identity);
}

abi PropsFeeSplitter {
    #[storage(read, write)]
    fn set_fee(amount: u64);

    #[storage(read)]
    fn fee() -> Option<u64>;

    #[storage(write)]
    fn set_shares(recipients: Vec<Identity>, shares: Vec<u64>);

    #[storage(read)]
    fn get_share() -> Option<u64>;

    #[storage(read)]
    fn total_shares() -> Option<u64>;

    #[storage(write), payable]
    fn receive_funds();

    #[storage(read, write)]
    fn distribute_funds(amount: u64);
}

abi SRC3PayableExtension {
    #[payable]
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: SubId, amount: u64, affiliate: Option<Identity>, proof: Option<Vec<b256>>, key: Option<u64>, num_leaves: Option<u64>, max_amount: Option<u64>);

    #[storage(read, write)]
    fn airdrop(recipient: Identity, amount: u64);

    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64);
}

abi SetMintMetadata {
    #[storage(write)]
    fn set_price(price: u64);

    #[storage(read)]
    fn price() -> Option<u64>;

    #[storage(read)]
    fn total_price() -> Option<u64>;

    fn fees() -> Option<(u64, u64)>;

    #[storage(read)]
    fn start_date() -> Option<u64>;

    #[storage(read)]
    fn end_date() -> Option<u64>;

    #[storage(write)]
    fn set_dates(start: u64, end: u64);

    #[storage(write)]
    fn set_merkle_root(root: b256);

    #[storage(read)]
    fn merkle_root() -> Option<b256>;

    #[storage(read)]
    fn merkle_uri() -> Option<String>;

    #[storage(write)]
    fn set_merkle(root: b256, uri: String);
}

pub fn concat(a: String, b: String) -> String {
    let mut a = a.as_bytes();
    let b = b.as_bytes();
    a.append(b);
    String::from_ascii(a)
}

pub fn concat_with_bytes(a: String, b: Bytes) -> String {
    let mut a = a.as_bytes();
    a.append(b);
    String::from_ascii(a)
}

pub fn convert_num_to_ascii_bytes(num: u64) -> Bytes {
    let mut bytes = Bytes::new();
    let mut n = num;
    if n == 0 {
        bytes.push(48);
        return bytes;
    }
    while n != 0 {
        // 48 - is an ASCII offset for digits
        bytes.push(((n % 10) + 48).try_as_u8().unwrap());
        n /= 10;
    }
    let mut reversed_bytes = Bytes::with_capacity(bytes.len());
    while !bytes.is_empty() {
        reversed_bytes.push(bytes.pop().unwrap());
    }
    return reversed_bytes;
}



pub struct ContractCreatedEvent {
    pub owner: Identity,
    pub name: String,
    pub symbol: String,
    pub price: u64,
    pub start: u64,
    pub end: u64
}

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
    pub sender: Identity,
    pub recipient: Identity,
    pub amount: u64,
    pub new_minted_id: u64
}

pub struct RegisterContractEvent {
    pub contract_id: ContractId,
    pub owner: Identity
}

pub struct DeregisterEvent {
    pub contract_id: ContractId,
}
