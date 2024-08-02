contract;

mod errors;
mod interface;

use errors::{MintError, SetError};
use interface::{Props721Edition, SetMintMetadata, SRC3PayableExtension};
use standards::{src20::SRC20, src3::SRC3, src5::{SRC5, State}, src7::{Metadata, SRC7},};
use sway_libs::{
    asset::{
        base::{
            _name,
            _set_name,
            _set_symbol,
            _symbol,
            _total_assets,
            _total_supply,
            SetAssetAttributes,
        },
        metadata::*,
        supply::{
            _burn,
            _mint,
        },
    },
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
    reentrancy::reentrancy_guard,
};
use std::{hash::Hash, storage::storage_string::*, storage::storage_vec::*, string::String};
use std::logging::log;
use std::context::msg_amount;
use std::call_frames::msg_asset_id;
use std::asset::{transfer};

use libraries::{PropsFeeSplitter};

const FEE_CONTRACT_ID = 0xd65987a6b981810a28559d57e5083d47a10ce269cbf96316554d5b4a1b78485a;

storage {
    /// The total number of unique assets minted by this contract.
    ///
    /// # Additional Information
    ///
    /// This is the number of NFTs that have been minted.
    total_assets: u64 = 0,
    /// The total number of coins minted for a particular asset.
    ///
    /// # Additional Information
    ///
    /// This should always be 1 for any asset as this is an NFT contract.
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    /// The metadata associated with a particular asset.
    ///
    /// # Additional Information
    ///
    /// In this NFT contract, there is no metadata provided at compile time. All metadata
    /// is added by users and stored into storage.
    metadata: StorageMetadata = StorageMetadata {},
    last_minted_id: u64 = 0,
    name: StorageString = StorageString {},
    symbol: StorageString = StorageString {},
    price: u64 = 0
}

configurable {
    /// The maximum number of NFTs that may be minted.
    /// 
    /// # Type
    /// 
    /// `u64`
    MAX_SUPPLY: u64 = 3,

    /// The address to which the builder fee will be sent.
    /// 
    /// # Type
    /// 
    /// `Address`
    BUILDER_FEE_ADDRESS: Address = Address::from(0x0000000000000000000000000000000000000000000000000000000000000000),

    /// The fee amount to be paid to the builder.
    /// 
    /// # Type
    /// 
    /// `u64`
    BUILDER_FEE: u64 = 0, 

    /// The address to which the builder's revenue share will be sent.
    /// 
    /// # Type
    /// 
    /// `Address`
    BUILDER_REVENUE_SHARE_ADDRESS: Address = Address::from(0x0000000000000000000000000000000000000000000000000000000000000000),

    /// The percentage of revenue to be shared with the builder.
    /// 
    /// This needs to be a value between 0 and 100.
    ///
    /// # Type
    /// 
    /// `u64`
    BUILDER_REVENUE_SHARE_PERCENTAGE: u64 = 0,

    /// The percentage of revenue to be shared with the affiliate.
    /// 
    /// This needs to be a value between 0 and 100.
    ///
    /// # Type
    /// 
    /// `u64`
    AFFILIATE_FEE_PERCENTAGE: u64 = 0,
}

impl SRC20 for Contract {
    /// Returns the total number of individual NFTs for this contract.
    ///
    /// # Returns
    ///
    /// * [u64] - The number of assets that this contract has minted.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src20::SRC20;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let contract_abi = abi(SRC20, contract_id);
    ///     let total_assets = contract_abi.total_assets();
    ///     assert(total_assets != 0);
    /// }
    /// ```
    #[storage(read)]
    fn total_assets() -> u64 {
        _total_assets(storage.total_assets)
    }

    /// Returns the total supply of coins for an asset.
    ///
    /// # Additional Information
    ///
    /// This must always be at most 1 for NFTs.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the total supply.
    ///
    /// # Returns
    ///
    /// * [Option<u64>] - The total supply of coins for `asset`.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src20::SRC20;
    ///
    /// fn foo(contract_id: ContractId, asset: AssetId) {
    ///     let contract_abi = abi(SRC20, contract_id);
    ///     let total_supply = contract_abi.total_supply(asset).unwrap();
    ///     assert(total_supply == 1);
    /// }
    /// ```
    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        _total_supply(storage.total_supply, asset)
    }

    /// Returns the name of the asset, such as “Ether”.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the name.
    ///
    /// # Returns
    ///
    /// * [Option<String>] - The name of `asset`.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src20::SRC20;
    /// use std::string::String;
    ///
    /// fn foo(contract_ic: ContractId, asset: AssetId) {
    ///     let contract_abi = abi(SRC20, contract_id);
    ///     let name = contract_abi.name(asset).unwrap();
    ///     assert(name.len() != 0);
    /// }
    /// ```
    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        Some(storage.name.read_slice().unwrap())
    }
    /// Returns the symbol of the asset, such as “ETH”.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the symbol.
    ///
    /// # Returns
    ///
    /// * [Option<String>] - The symbol of `asset`.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src20::SRC20;
    /// use std::string::String;
    ///
    /// fn foo(contract_id: ContractId, asset: AssetId) {
    ///     let contract_abi = abi(SRC20, contract_id);
    ///     let symbol = contract_abi.symbol(asset).unwrap();
    ///     assert(symbol.len() != 0);
    /// }
    /// ```
    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        Some(storage.symbol.read_slice().unwrap())
    }
    /// Returns the number of decimals the asset uses.
    ///
    /// # Additional Information
    ///
    /// The standardized decimals for NFTs is 0u8.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the decimals.
    ///
    /// # Returns
    ///
    /// * [Option<u8>] - The decimal precision used by `asset`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src20::SRC20;
    ///
    /// fn foo(contract_id: ContractId, asset: AssedId) {
    ///     let contract_abi = abi(SRC20, contract_id);
    ///     let decimals = contract_abi.decimals(asset).unwrap();
    ///     assert(decimals == 0u8);
    /// }
    /// ```
    #[storage(read)]
    fn decimals(_asset: AssetId) -> Option<u8> {
        Some(0u8)
    }
}

impl SRC3PayableExtension for Contract {
    /// Mints new assets using the `sub_id` sub-identifier in a sequential manner.
    ///
    /// # Additional Information
    ///
    /// This conforms to the SRC-20 NFT portion of the standard for a maximum
    /// mint amount of 1 coin per asset. The minting process is sequential, meaning
    /// each new asset is assigned a unique identifier incrementally.
    ///
    /// # Arguments
    ///
    /// * `recipient`: [Identity] - The user to which the newly minted assets are transferred to.
    /// * `sub_id`: [SubId] - The sub-identifier of the newly minted asset.
    /// * `amount`: [u64] - The quantity of coins to mint.
    ///
    /// # Reverts
    ///
    /// * When the contract is paused.
    /// * When amount is greater than one.
    /// * When the asset has already been minted.
    /// * When more than the MAX_SUPPLY NFTs have been minted.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `3`
    /// * Writes: `2`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src3::SRC3;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let contract_abi = abi(SR3, contract_id);
    ///     contract_abi.mint(Identity::ContractId(ContractId::this()), ZERO_B256, 1);
    /// }
    /// ```
    #[storage(read, write), payable]
    fn mint(recipient: Identity, _sub_id: SubId, amount: u64, affiliate: Option<Identity>) {
        reentrancy_guard();
        require_not_paused();

        let mut total_price: u64 = 0;
        let mut total_fee: u64 = 0;

        let price = storage.price.try_read().unwrap_or(0);
        let total_assets = storage.total_assets.try_read().unwrap_or(0);
        let mut last_minted_id = storage.last_minted_id.try_read().unwrap_or(0);

        let stored_owner = _owner();
        let price_amount = msg_amount();
        let asset_id = msg_asset_id();

        require(asset_id == AssetId::base(), MintError::InvalidAsset);

        // require(amount > 0, MintError::CannotMintMoreThanOneNFTWithSubId);
        require(
            total_assets + amount <= MAX_SUPPLY,
            MintError::MaxNFTsMinted,
        );

        let mut minted_count = 0;

        while minted_count < amount {
            let new_minted_id = last_minted_id + 1;
            let new_sub_id = new_minted_id.as_u256().as_b256();
            let asset = AssetId::new(ContractId::this(), new_sub_id);

            // Mint the NFT
            let _ = _mint(
                storage
                    .total_assets,
                storage
                    .total_supply,
                recipient,
                new_sub_id,
                1,
            );

            last_minted_id = new_minted_id;
            minted_count += 1;
        }

        // Update last minted id in storage
        storage.last_minted_id.write(last_minted_id);

        // Check and transfer builder fee
        if BUILDER_FEE_ADDRESS != Address::from(0x0000000000000000000000000000000000000000000000000000000000000000) {
            if BUILDER_FEE > 0 {
                // Fixed fee mode
                require(price_amount >= BUILDER_FEE, MintError::NotEnoughTokens(price_amount));
                total_fee += BUILDER_FEE;
                transfer(Identity::Address(BUILDER_FEE_ADDRESS), AssetId::base(), BUILDER_FEE);
            }
        }

        if BUILDER_REVENUE_SHARE_ADDRESS != Address::from(0x0000000000000000000000000000000000000000000000000000000000000000) {
            if BUILDER_REVENUE_SHARE_PERCENTAGE > 0 {
                // Calculate the builder revenue share fee
                let builder_fee = (price * BUILDER_REVENUE_SHARE_PERCENTAGE) / 100;
                require(price_amount >= builder_fee, MintError::NotEnoughTokens(price_amount));
                total_fee += builder_fee;
                transfer(Identity::Address(BUILDER_REVENUE_SHARE_ADDRESS), AssetId::base(), builder_fee);
            }
        }

        // Check and transfer affiliate fee
        if let Some(Identity::Address(affiliate_address)) = affiliate {
            if AFFILIATE_FEE_PERCENTAGE > 0 {
                let affiliate_fee = (price * AFFILIATE_FEE_PERCENTAGE) / 100;
                require(price_amount >= affiliate_fee, MintError::NotEnoughTokens(price_amount));
                total_fee += affiliate_fee;
                transfer(Identity::Address(affiliate_address), AssetId::base(), affiliate_fee);
            }
        }

        let fee_splitter = abi(PropsFeeSplitter, FEE_CONTRACT_ID);
        let fee = fee_splitter.fee().unwrap_or(0);

        total_price = price.multiply(amount) + fee + BUILDER_FEE;
        total_fee += fee;

        require(price_amount >= total_price, MintError::NotEnoughTokens(total_price));

        if fee > 0 {
            fee_splitter.receive_funds {
                coins: fee,
                asset_id: AssetId::base().bits(),
                gas: 1_000_000
            }();
        }

        let creator_price = price_amount - total_fee; // Allows giving tips to the creator

        // Transfer the remaining amount to the owner
        if creator_price > 0 {
            if let State::Initialized(owner_identity) = stored_owner {
                if let Identity::Address(owner_address) = owner_identity {
                    transfer(Identity::Address(owner_address), AssetId::base(), creator_price);
                }
            }
        }

    }

    /// Burns assets sent with the given `sub_id`.
    ///
    /// # Additional Information
    ///
    /// NOTE: The sha-256 hash of `(ContractId, SubId)` must match the `AssetId` where `ContractId` is the id of
    /// the implementing contract and `SubId` is the given `sub_id` argument.
    ///
    /// # Arguments
    ///
    /// * `sub_id`: [SubId] - The sub-identifier of the asset to burn.
    /// * `amount`: [u64] - The quantity of coins to burn.
    ///
    /// # Reverts
    ///
    /// * When the contract is paused.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src3::SRC3;
    ///
    /// fn foo(contract_id: ContractId, asset_id: AssetId) {
    ///     let contract_abi = abi(SR3, contract_id);
    ///     contract_abi.burn {
    ///         gas: 10000,
    ///         coins: 1,
    ///         asset_id: AssetId,
    ///     } (ZERO_B256, 1);
    /// }
    /// ```
    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64) {
        require_not_paused();
        _burn(storage.total_supply, sub_id, amount);
    }
}

impl SRC7 for Contract {
    /// Returns metadata for the corresponding `asset` and `key`.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the metadata.
    /// * `key`: [String] - The key to the specific metadata.
    ///
    /// # Returns
    ///
    /// * [Option<Metadata>] - `Some` metadata that corresponds to the `key` or `None`.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src_7::{SRC7, Metadata};
    /// use std::string::String;
    ///
    /// fn foo(contract_id: ContractId, asset: AssetId) {
    ///     let contract_abi = abi(SRC7, contract_id);
    ///     let key = String::from_ascii_str("image");
    ///     let data = contract_abi.metadata(asset, key);
    ///     assert(data.is_some());
    /// }
    /// ```
    #[storage(read)]
    fn metadata(asset: AssetId, key: String) -> Option<Metadata> {
        // Return the same metadata for all assets
        storage.metadata.get(AssetId::from(SubId::zero()), key)
    }
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

impl SetAssetMetadata for Contract {
    /// Stores metadata for a specific asset and key pair.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset for the metadata to be stored.
    /// * `key`: [String] - The key for the metadata to be stored.
    /// * `metadata`: [Metadata] - The metadata to be stored.
    ///
    /// # Reverts
    ///
    /// * When the metadata has already been set for an asset.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `2`
    ///
    /// # Example
    ///
    /// ```sway
    /// use asset::metdata::SetAssetMetadata;
    /// use src_7::{SRC7, Metadata};
    ///
    /// fn foo(asset: AssetId, key: String, contract_id: ContractId, metadata: Metadata) {
    ///     let set_abi = abi(SetAssetMetadata, contract_id);
    ///     let src_7_abi = abi(SRC7, contract);
    ///     set_abi.set_metadata(storage.metadata, asset, key, metadata);
    ///     assert(src_7_abi.metadata(asset, key) == metadata);
    /// }
    /// ```
    #[storage(read, write)]
    fn set_metadata(asset: AssetId, key: String, metadata: Metadata) {
        only_owner();
        require(storage.metadata.get(AssetId::from(SubId::zero()), key).is_none(), SetError::ValueAlreadySet);
        _set_metadata(storage.metadata, AssetId::from(SubId::zero()), key, metadata);
    }
}

impl SetMintMetadata for Contract {
    /// Sets the price for minting an NFT.
    ///
    /// # Arguments
    ///
    /// * `price`: [u128] - The price to mint an NFT.
    ///
    /// # Reverts
    ///
    /// * When the caller is not the contract owner.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Writes: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::mint::SetMintMetadata;
    ///
    /// fn foo(contract_id: ContractId, price: u128) {
    ///     let mint_abi = abi(SetMintMetadata, contract_id);
    ///     mint_abi.set_price(price);
    ///     assert(mint_abi.price() == price);
    /// }
    /// ```
    #[storage(write)]
    fn set_price(price: u64) {
        only_owner();
        storage.price.write(price);
    }

    /// Returns the price for minting an NFT.
    ///
    /// # Returns
    ///
    /// * [u128] - The price to mint an NFT.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::mint::SetMintMetadata;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let mint_abi = abi(SetMintMetadata, contract_id);
    ///     let price = mint_abi.price();
    ///     assert(price != 0);
    /// }
    /// ```
    #[storage(read)]
    fn price() -> Option<u64> {
        Some(storage.price.try_read().unwrap_or(0))
    }

    /// Returns the total price for minting an NFT, including any applicable fees.
    ///
    /// # Returns
    ///
    /// * [Option<u64>] - The total price to mint an NFT.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::mint::SetMintMetadata;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let mint_abi = abi(SetMintMetadata, contract_id);
    ///     let total_price = mint_abi.total_price();
    ///     assert(total_price != 0);
    /// }
    /// ```
    #[storage(read)]
    fn total_price() -> Option<u64> {
        let base_price = storage.price.try_read().unwrap_or(0);
        let fee_splitter = abi(PropsFeeSplitter, FEE_CONTRACT_ID);
        let fee = fee_splitter.fee().unwrap_or(0);
        Some(base_price + fee + BUILDER_FEE)
    }

    /// Returns the breakdown of fees for minting an NFT.
    ///
    /// # Returns
    ///
    /// * [Option<(u64, u64, u64)>] - A tuple containing the base price, builder fee, and total fee.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::mint::SetMintMetadata;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let mint_abi = abi(SetMintMetadata, contract_id);
    ///     let (base_price, builder_fee, total_fee) = mint_abi.fee_breakdown().unwrap();
    ///     assert(base_price != 0);
    /// }
    /// ```
    fn fee_breakdown() -> Option<(u64, u64)> {
        let fee_splitter = abi(PropsFeeSplitter, FEE_CONTRACT_ID);
        let fee = fee_splitter.fee().unwrap_or(0);
        Some((fee, BUILDER_FEE))
    }

}

impl Pausable for Contract {
    /// Pauses the contract.
    ///
    /// # Reverts
    ///
    /// * When the caller is not the contract owner.
    ///
    /// # Number of Storage Accesses
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
    /// # Number of Storage Accesses
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
    /// # Number of Storage Accesses
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

impl Props721Edition for Contract {
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
    /// # Number of Storage Acesses
    ///
    /// * Reads: `1`
    /// * Write: `1`
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
    #[storage(read, write)]
    fn constructor(owner: Identity, name: String, symbol: String, metadata_keys: Vec<String>, metadata_values: Vec<Metadata>, price: u64) {
        initialize_ownership(owner);

        storage.name.write_slice(name);
        storage.symbol.write_slice(symbol);

        let mut i = 0;
        while i < metadata_keys.len() {
            let key = metadata_keys.get(i).unwrap();
            let value = metadata_values.get(i).unwrap();
            _set_metadata(storage.metadata, AssetId::from(SubId::zero()), key, value);
            i += 1;
        }

        // let final_price = if BUILDER_FEE_ADDRESS != Address::from(0x0000000000000000000000000000000000000000000000000000000000000000) {
        //     price + BUILDER_FEE
        // } else {
        //     price
        // };
        storage.price.write(price);
    }
}