contract;

mod errors;
mod interface;
mod events;

use libraries::{PropsRegistry, Props721Collection, Props721Edition};
use events::{RegisterEvent, DeregisterEvent, InitCollectionEvent, InitEditionEvent};
use standards::{src20::SRC20, src3::SRC3, src5::{SRC5, State}, src7::{Metadata, SRC7},};
use std::hash::Hash;
use std::{hash::*, storage::storage_string::*, storage::storage_vec::*, string::String, bytes::Bytes, bytes_conversions::{b256::*, u16::*, u256::*, u32::*, u64::*,}, block::height};

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

    /// Initializes a new edition in the registry.
    ///
    /// # Arguments
    ///
    /// * `owner`: [Identity] - The owner of the edition.
    /// * `name`: [String] - The name of the edition.
    /// * `symbol`: [String] - The symbol of the edition.
    /// * `metadata_keys`: [Vec<String>] - The keys for the metadata.
    /// * `metadata_values`: [Vec<Metadata>] - The values for the metadata.
    /// * `price`: [u64] - The price of the edition.
    /// * `start_date`: [u64] - The start date of the edition.
    /// * `end_date`: [u64] - The end date of the edition.
    ///
    /// # Effects
    ///
    /// Initializes a new edition with the given parameters.
    #[storage(read, write)]
    fn init_edition(contract_id: ContractId, owner: Identity, name: String, symbol: String, metadata_keys: Vec<String>, metadata_values: Vec<Metadata>, price: u64, start_date: u64, end_date: u64) {
        // Implementation details would go here
        // This might involve creating a new Props721Edition contract and registering it

        let registry = abi(Props721Edition, contract_id.into());
        registry.constructor(owner, name, symbol, metadata_keys, metadata_values, price, start_date, end_date);
        
        // Log the InitEditionEvent
        log(InitEditionEvent {
            contract_id: contract_id,
            owner: owner,
            name: name,
            symbol: symbol,
            metadata_keys: metadata_keys,
            metadata_values: metadata_values,
            price: price,
            start_date: start_date,
            end_date: end_date,
        });
    }

    /// Initializes a new collection in the registry.
    ///
    /// # Arguments
    ///
    /// * `owner`: [Identity] - The owner of the collection.
    /// * `name`: [String] - The name of the collection.
    /// * `symbol`: [String] - The symbol of the collection.
    /// * `baseUri`: [String] - The base URI for the collection.
    /// * `price`: [u64] - The price of the collection.
    /// * `startDate`: [u64] - The start date of the collection.
    /// * `endDate`: [u64] - The end date of the collection.
    ///
    /// # Effects
    ///
    /// Initializes a new collection with the given parameters.
    #[storage(read, write)]
    fn init_collection(contract_id: ContractId, owner: Identity, name: String, symbol: String, baseUri: String, price: u64, startDate: u64, endDate: u64) {

        let registry = abi(Props721Collection, contract_id.into());
        registry.constructor(owner, name, symbol, baseUri, price, startDate, endDate);

        // Log the InitCollectionEvent
        log(InitCollectionEvent {
            contract_id: contract_id,
            owner: owner,
            name: name,
            symbol: symbol,
            base_uri: baseUri,
            price: price,
            start_date: startDate,
            end_date: endDate,
        });
    }
}
