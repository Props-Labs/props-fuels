library;

use std::string::String;
use std::vec::Vec;
use standards::src7::Metadata;

abi SRC7MetadataExtension {
    #[storage(read)]
    fn total_metadata(asset: AssetId) -> Option<Vec<(String, Metadata)>>;

    #[storage(read)]
    fn metadata_keys() -> Vec<String>;
}

abi Props721Edition {
    #[storage(read, write)]
    fn constructor(owner: Identity, name: String);
}
