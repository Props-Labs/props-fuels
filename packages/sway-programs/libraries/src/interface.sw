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