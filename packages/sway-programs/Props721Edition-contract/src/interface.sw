library;

use std::string::String;
use std::vec::Vec;
use standards::src7::Metadata;

abi SRC3PayableExtension {
    #[payable]
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: SubId, amount: u64, affiliate: Option<Identity>);

    #[storage(read, write)]
    fn airdrop(recipient: Identity, amount: u64);

    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64);
}

abi SRC7MetadataExtension {
    #[storage(read)]
    fn total_metadata(asset: AssetId) -> Option<Vec<(String, Metadata)>>;

    #[storage(read)]
    fn metadata_keys() -> Vec<String>;
}

abi SetMintMetadata {
    #[storage(write)]
    fn set_price(price: u64);

    #[storage(read)]
    fn price() -> Option<u64>;

    #[storage(read)]
    fn total_price() -> Option<u64>;

    fn fees() -> Option<(u64, u64)>;
}

abi Props721Edition {
    #[storage(read, write)]
    fn constructor(owner: Identity, name: String, symbol: String, metadata_keys: Vec<String>, metadata_values: Vec<Metadata>, price: u64);
}
