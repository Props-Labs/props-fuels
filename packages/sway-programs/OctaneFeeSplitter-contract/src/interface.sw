library;

abi OctaneFeeSplitter {
    #[storage(read, write)]
    fn set_fee(amount: u64);

    #[storage(read)]
    fn fee() -> Option<u64>;

    #[storage(write)]
    fn set_shares(recipients: Vec<Address>, shares: Vec<u64>);

    #[storage(write), payable]
    fn receive_funds();

    #[storage(read, write)]
    fn distribute_funds(amount: u64);
}

abi Constructor {
    #[storage(read, write)]
    fn constructor(owner: Identity);
}