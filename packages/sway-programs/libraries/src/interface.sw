library;

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
    fn mint(recipient: Identity, sub_id: SubId, amount: u64, affiliate: Option<Identity>);

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
}