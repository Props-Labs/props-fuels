library;

use std::string::String;
use std::vec::Vec;
use standards::src7::Metadata;

abi SetMintMetadata {
    #[storage(write)]
    fn set_price(price: u64);

    #[storage(read)]
    fn price() -> Option<u64>;

    #[storage(read)]
    fn total_price() -> Option<u64>;

    fn fees() -> Option<(u64, u64)>;
}

abi SetTokenUri {
    #[storage(write)]
    fn set_base_uri(uri: String);

    #[storage(read)]
    fn base_uri() -> Option<String>;

}

abi Props721Collection {
    #[storage(read, write)]
    fn constructor(owner: Identity, name: String, symbol: String, baseUri: String, price: u64);
}
