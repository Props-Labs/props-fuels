contract;

mod errors;
mod interface;

use errors::{SetError};
use interface::{OctaneFeeSplitter, Constructor};
use standards::{src5::{SRC5, State},};
use sway_libs::{
    ownership::{
        _owner,
        initialize_ownership,
        only_owner,
    },
    pausable::{
        _is_paused,
        _pause,
        _unpause,
        Pausable,
        require_not_paused,
    },
};
use std::{
    hash::Hash,
    asset::{transfer},
    context::msg_amount,
    address::Address,
    storage::storage_vec::*,
};

storage {
    /// The fee amount for the contract.
    ///
    /// # Description
    /// This storage variable holds the fee amount that is set by the contract owner.
    /// It is used to determine the fee that will be applied to transactions.
    fee: u64 = 0,

    /// The total number of shares.
    ///
    /// # Description
    /// This storage variable holds the total number of shares that have been allocated
    /// to recipients. It is used to calculate the distribution of funds.
    total_shares: u64 = 0,

    /// The shares allocated to each recipient.
    ///
    /// # Description
    /// This storage map holds the shares allocated to each recipient, identified by their address.
    /// The key is the recipient's address, and the value is the number of shares allocated to them.
    shares: StorageVec<(Address, u64)> = StorageVec {},
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

impl OctaneFeeSplitter for Contract {
    /// Sets the fee amount for the contract.
    ///
    /// # Arguments
    ///
    /// * `fee`: [u64] - The fee amount to be set by the contract owner.
    ///
    /// # Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    #[storage(read, write)]
    fn set_fee(fee: u64) {
        only_owner();
        storage.fee.write(fee);
    }

    /// Returns the current fee amount.
    ///
    /// # Returns
    ///
    /// * [Option<u64>] - The current fee amount, or `None` if not set.
    ///
    /// # Storage Accesses
    ///
    /// * Reads: `1`
    #[storage(read)]
    fn fee() -> Option<u64> {
        Some(storage.fee.try_read().unwrap_or(0))
    }

    /// Sets the shares for recipients.
    ///
    /// # Arguments
    ///
    /// * `recipients`: [Vec<Address>] - A vector of recipient addresses.
    /// * `shares`: [Vec<u64>] - A vector of shares corresponding to each recipient.
    ///
    /// # Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    ///
    /// # Panics
    ///
    /// * If the length of `recipients` and `shares` do not match.
    #[storage(write)]
    fn set_shares(recipients: Vec<Address>, shares: Vec<u64>) {
        only_owner();
        assert(recipients.len() == shares.len());
        let mut total_shares = 0;
        let mut i = 0;
        while i < recipients.len() {
            storage.shares.push((recipients.get(i).unwrap(), shares.get(i).unwrap_or(0)));
            total_shares += shares.get(i).unwrap();
            i += 1;
        }
        storage.total_shares.write(total_shares);
    }

    /// Distributes the received funds to recipients based on their shares.
    ///
    /// # Arguments
    ///
    /// * `amount`: [u64] - The total amount of funds to be distributed.
    ///
    /// # Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    #[storage(read, write)]
    fn distribute_funds(amount: u64) {
        let total_shares = storage.total_shares.read();
        let mut i = 0;
        while i < storage.shares.len() {
            let (recipient, share) = storage.shares.get(i).unwrap().read();
            let amount_to_send = (amount * share) / total_shares;
            transfer(Identity::Address(recipient), AssetId::base(), amount_to_send);
            i += 1;
        }
    }

    /// Receives funds and distributes them according to shares.
    ///
    /// # Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    ///
    /// # Payable
    ///
    /// This function is payable and will automatically receive funds.
    #[storage(write), payable]
    fn receive_funds() {
        require_not_paused();
        // The contract automatically receives funds when this function is called.
        let amount_received = msg_amount();
        // distribute_funds(amount_received); //- @TODO I wish this would work need to find out how to call my self
    }
}

impl Pausable for Contract {
    /// Pauses the contract.
    ///
    /// # Reverts
    ///
    /// * When the caller is not the contract owner.
    ///
    /// # Storage Accesses
    ///
    /// * Writes: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::pausable::Pausable;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let pausable_abi = abi(Pausable, contract_id);
    ///     pausable_abi.pause();
    ///     assert(pausable_abi.is_paused());
    /// }
    /// ```
    #[storage(write)]
    fn pause() {
        only_owner();
        _pause();
    }

    /// Returns whether the contract is paused.
    ///
    /// # Returns
    ///
    /// * [bool] - The pause state for the contract.
    ///
    /// # Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::pausable::Pausable;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let pausable_abi = abi(Pausable, contract_id);
    ///     assert(!pausable_abi.is_paused());
    /// }
    /// ```
    #[storage(read)]
    fn is_paused() -> bool {
        _is_paused()
    }

    /// Unpauses the contract.
    ///
    /// # Reverts
    ///
    /// * When the caller is not the contract owner.
    ///
    /// # Storage Accesses
    ///
    /// * Writes: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::pausable::Pausable;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let pausable_abi = abi(Pausable, contract_id);
    ///     pausable_abi.unpause();
    ///     assert(!pausable_abi.is_paused());
    /// }
    /// ```
    #[storage(write)]
    fn unpause() {
        only_owner();
        _unpause();
    }
}

impl Constructor for Contract {
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