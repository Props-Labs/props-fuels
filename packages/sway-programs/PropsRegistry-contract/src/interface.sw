library;

abi PropsRegistry {
    #[storage(read, write)]
    fn register(contractId: ContractId, owner: Identity);

    #[storage(read, write)]
    fn deregister(contractId: ContractId);

    #[storage(read, write)]
    fn constructor(owner: Identity);
}