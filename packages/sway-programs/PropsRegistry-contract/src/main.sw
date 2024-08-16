contract;

mod errors;
mod interface;
mod events;

use libraries::{PropsRegistry};
use events::{RegisterEvent, DeregisterEvent};
use std::hash::Hash;

use standards::{src5::{SRC5, State}};

use sway_libs::{
    ownership::{
        _owner,
        initialize_ownership,
        only_owner,
    }
};

/// Storage for the PropsRegistry contract
storage {
    /// A mapping of contract IDs to their respective owners
    registry: StorageMap<ContractId, Identity> = StorageMap {},
}

impl SRC5 for Contract {
    /// Returns the owner.
    ///
    /// # Return Values
    ///
    /// * [State] - Represents the state of ownership for this contract.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use standards::src5::SRC5;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let ownership_abi = abi(contract_id, SRC_5);
    ///
    ///     match ownership_abi.owner() {
    ///         State::Uninitalized => log("The ownership is uninitalized"),
    ///         State::Initialized(owner) => log("The ownership is initalized"),
    ///         State::Revoked => log("The ownership is revoked"),
    ///     }
    /// }
    /// ```
    #[storage(read)]
    fn owner() -> State {
        _owner()
    }
}

impl PropsRegistry for Contract {
    /// Registers a contract with its owner
    ///
    /// # Arguments
    ///
    /// * `contractId`: The ID of the contract to be registered
    /// * `owner`: The Identity of the contract owner
    ///
    /// # Effects
    ///
    /// Inserts the contract ID and owner pair into the registry
    #[storage(read, write)]
    fn register(contractId: ContractId, owner: Identity) {
        storage.registry.insert(contractId, owner);

        // Log the RegisterEvent
        log(RegisterEvent {
            contract_id: contractId,
            owner: owner,
        });
    }

    /// Deregisters a contract
    ///
    /// # Arguments
    ///
    /// * `contractId`: The ID of the contract to be deregistered
    ///
    /// # Effects
    ///
    /// Removes the contract ID from the registry
    #[storage(read, write)]
    fn deregister(contractId: ContractId) {
        only_owner();
        storage.registry.remove(contractId);

        // Log the DeregisterEvent
        log(DeregisterEvent {
            contract_id: contractId,
        });
    }

    /// Sets the defaults for the contract.
    ///
    /// # Arguments
    ///
    /// * `owner`: [Identity] - The `Identity` that will be the first owner.
    ///
    /// # Reverts
    ///
    /// * When ownership has been set before.
    ///
    /// # Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use standards::src5::SRC5;
    /// use nft::Constructor;
    ///
    /// fn foo(contract: ContractId, owner: Identity) {
    ///     let src_5_abi = abi(SRC5, contract.bits());
    ///     assert(src_5_abi.owner() == State::Uninitialized);
    ///
    ///     let constructor_abi = abi(Constructor, contract.bits());
    ///     constructor_abi.constructor(owner);
    ///     assert(src_5_abi.owner() == State::Initialized(owner));
    /// }
    /// ```
    #[storage(read, write)]
    fn constructor(owner: Identity) {
        initialize_ownership(owner);
    }
}
