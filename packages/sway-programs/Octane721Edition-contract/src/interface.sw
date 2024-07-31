library;

use std::string::String;
use std::vec::Vec;
use standards::src7::Metadata;

abi SRC3PayableExtension {
    #[payable]
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: SubId, amount: u64);

    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64);
}

abi SetMintMetadata {
    #[storage(write)]
    fn set_price(price: u64);

    #[storage(read)]
    fn price() -> Option<u64>;
}

abi SetAffiliate {
    #[storage(write)]
    fn set_affiliate_fee(mode: u64, fee: u64);

    #[storage(read)]
    fn affiliate() -> Option<(u64,u64)>;
}

abi Octane721Edition {
    #[storage(read, write)]
    fn constructor(owner: Identity, name: String, symbol: String, metadata_keys: Vec<String>, metadata_values: Vec<Metadata>, price: u64);
}
