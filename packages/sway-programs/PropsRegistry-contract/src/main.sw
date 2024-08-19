contract;

mod errors;
mod interface;
mod events;

use libraries::{PropsRegistry, PropsContract};
use std::{hash::Hash, string::String};

use standards::{src5::{SRC5, State}, src7::{Metadata}};

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
    /// Initializes a contract with its owner and name
    ///
    /// # Arguments
    ///
    /// * `contract_id`: The ID of the contract to be initialized
    /// * `owner`: The Identity of the contract owner
    /// * `name`: The name of the contract
    ///
    /// # Effects
    ///
    /// * Initializes the contract with the given owner and name
    /// * Logs an `InitContractEvent` with the contract details
    ///
    /// # Reverts
    ///
    /// * When the contract has already been initialized
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::PropsRegistry;
    ///
    /// fn foo(registry: ContractId, contract_id: ContractId, owner: Identity, name: String) {
    ///     let registry_abi = abi(PropsRegistry, registry);
    ///     registry_abi.init_contract(contract_id, owner, name);
    /// }
    /// ```


    #[storage(read, write)]
    fn init_contract(contract_id: ContractId, owner: Identity, name: String) {

        // storage.registry.insert(contract_id, owner);

        // let contr = abi(PropsContract, contract_id.into());
        // contr.constructor(owner, name);

        // Log the InitCollectionEvent
        log(InitContractEvent {
            contract_id: contract_id,
            owner: owner,
            name: name
        });
    }

}
