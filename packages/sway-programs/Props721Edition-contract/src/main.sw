contract;

mod errors;
mod interface;

use errors::{MintError, SetError};
use interface::{Props721Edition, SRC7MetadataExtension};
use standards::{src20::SRC20, src3::SRC3, src5::{SRC5, State}, src7::{Metadata, SRC7},};
use standards::src20::{SetNameEvent, SetSymbolEvent, SetDecimalsEvent, TotalSupplyEvent};
use standards::src7::{SetMetadataEvent};
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
    merkle::binary_proof::*,
};
use std::{hash::*, storage::storage_string::*, storage::storage_vec::*, string::String, bytes::Bytes, bytes_conversions::{b256::*, u16::*, u256::*, u32::*, u64::*,}, block::height};
use std::logging::log;
use std::context::msg_amount;
use std::auth::msg_sender;
use std::call_frames::msg_asset_id;
use std::asset::{transfer};
use std::block::timestamp;

use libraries::*;

// release
const FEE_CONTRACT_ID = 0xe63564f83a2b82b97ea3f42d1680eeca825e3596b76da197ea4f6f6595810562;

// debug
// const FEE_CONTRACT_ID = 0xd65987a6b981810a28559d57e5083d47a10ce269cbf96316554d5b4a1b78485a;
// const FEE_CONTRACT_ID = 0xd92c81da30e4fba3dcaaf3cc363b8b22a08fa34ef3f1a37fa06bfbc5f651014a;

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

    /// The keys for the metadata associated with assets.
    metadata_keys: StorageVec<StorageString> = StorageVec {},

    /// The ID of the last minted asset.
    last_minted_id: u64 = 0,

    /// The name of the NFT collection.
    name: StorageString = StorageString {},

    /// The symbol of the NFT collection.
    symbol: StorageString = StorageString {},

    /// The price of minting an NFT.
    price: u64 = 0,

    /// The start date for minting.
    ///
    /// # Type
    ///
    /// `u64`
    start_date: u64 = 0,

    /// The end date for minting.
    ///
    /// # Type
    ///
    /// `u64`
    end_date: u64 = 0,

    /// The Merkle root for the allowlist.
    ///
    /// # Type
    ///
    /// `b256`
    merkle_root: b256 = 0x0000000000000000000000000000000000000000000000000000000000000000,

    /// A mapping to track the number of NFTs minted by each address.
    ///
    /// # Type
    ///
    /// `StorageMap<Identity, u64>`
    minted_by_address: StorageMap<Identity, u64> = StorageMap {},

    /// The Merkle URI for the allowlist.
    ///
    /// # Type
    ///
    /// `StorageString`
    merkle_uri: StorageString = StorageString {},
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

    /// A flag to disable the airdrop functionality.
    ///
    /// # Type
    ///
    /// `bool`
    DISABLE_AIRDROP: bool = false,
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

#[storage(read, write), payable]
fn _mint_core(
    recipient: Identity,
    _sub_id: SubId,
    amount: u64,
    affiliate: Option<Identity>,
    proof: Option<Vec<b256>>,
    key: Option<u64>,
    num_leaves: Option<u64>,
    max_amount: Option<u64>,
    start_date: StorageKey<u64>,
    end_date: StorageKey<u64>,
    merkle_root: StorageKey<b256>,
    minted_by_address: StorageKey<StorageMap<Identity, u64>>,
    price: StorageKey<u64>,
    total_assets: StorageKey<u64>,
    last_minted_id: StorageKey<u64>,
    total_supply: StorageKey<StorageMap<AssetId, u64>>,
    name: StorageKey<StorageString>,
    symbol: StorageKey<StorageString>,
    metadata_keys: StorageKey<StorageVec<StorageString>>,
    metadata: StorageKey<StorageMetadata>
) {
    reentrancy_guard();
    require_not_paused();

    // Checking mint dates
    let current_time = timestamp();
    let start_date = start_date.try_read().unwrap_or(0);
    let end_date = end_date.try_read().unwrap_or(0);

    require(
        current_time >= start_date,
        MintError::OutsideMintingPeriod(String::from_ascii_str("Minting has not started yet."))
    );

    require(
        current_time <= end_date,
        MintError::OutsideMintingPeriod(String::from_ascii_str("Minting has ended."))
    );

    // Checking merkle proof
    let root = merkle_root.try_read().unwrap_or(b256::zero());
    if root != b256::zero() {
        let recipient_bits:b256 = recipient.bits();
        let mut recipient_bytes:Bytes = recipient_bits.to_le_bytes();
        let amount_bytes = max_amount.unwrap_or(amount).to_le_bytes();
        recipient_bytes.append(amount_bytes);

        let hashed_leaf = leaf_digest(sha256(recipient_bytes));

        // Verify the Merkle proof
        require(
            verify_proof(
                key.unwrap_or(0),
                hashed_leaf,
                root,
                num_leaves.unwrap_or(0),
                proof.unwrap()
            ),
            MintError::InvalidProof
        );

        // Check if the recipient has not exceeded their maximum minting limit
        let minted_count: u64 = minted_by_address.get(recipient).try_read().unwrap_or(0);
        require(
            minted_count + amount <= max_amount.unwrap_or(0),
            MintError::ExceededMaxMintLimit
        );
    }

    let mut total_price: u64 = 0;
    let mut total_fee: u64 = 0;
    let mut affiliate_fee: u64 = 0;

    let price = price.try_read().unwrap_or(0);
    let _total_assets = total_assets.try_read().unwrap_or(0);
    let mut last_minted_id_value = last_minted_id.try_read().unwrap_or(0);

    let stored_owner = _owner();
    let price_amount = msg_amount();
    let asset_id = msg_asset_id();

    require(asset_id == AssetId::base(), MintError::InvalidAsset);
    require(
        _total_assets + amount <= MAX_SUPPLY,
        MintError::MaxNFTsMinted,
    );

    // Check and transfer builder fee
    if BUILDER_FEE_ADDRESS != Address::from(0x0000000000000000000000000000000000000000000000000000000000000000) {
        if BUILDER_FEE > 0 {
            // Fixed fee mode
            total_fee += BUILDER_FEE;
            transfer(Identity::Address(BUILDER_FEE_ADDRESS), AssetId::base(), BUILDER_FEE);
        }
    }

    if BUILDER_REVENUE_SHARE_ADDRESS != Address::from(0x0000000000000000000000000000000000000000000000000000000000000000) {
        if BUILDER_REVENUE_SHARE_PERCENTAGE > 0 {
            // Calculate the builder revenue share fee
            let builder_fee = (price * BUILDER_REVENUE_SHARE_PERCENTAGE) / 100;
            total_fee += builder_fee;
            transfer(Identity::Address(BUILDER_REVENUE_SHARE_ADDRESS), AssetId::base(), builder_fee);
        }
    }

    // Check and transfer affiliate fee
    if let Some(Identity::Address(affiliate_address)) = affiliate {
        if AFFILIATE_FEE_PERCENTAGE > 0 {
            affiliate_fee = (price * AFFILIATE_FEE_PERCENTAGE) / 100;
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

    let mut minted_count = 0;

    while minted_count < amount {
        let new_minted_id = last_minted_id_value + 1;
        let new_sub_id = new_minted_id.as_u256().as_b256();
        let asset = AssetId::new(ContractId::this(), new_sub_id);

        // Mint the NFT
        let _ = _mint(
            total_assets,
            total_supply,
            recipient,
            new_sub_id,
            1,
        );

        log(MintEvent{
            recipient,
            amount,
            affiliate: affiliate.unwrap_or(Identity::Address(Address::from(0x0000000000000000000000000000000000000000000000000000000000000000))),
            max_amount: max_amount.unwrap_or(0),
            total_price,
            total_fee,
            price_amount,
            builder_fee: BUILDER_FEE,
            affiliate_fee,
            fee,
            creator_price,
            asset_id: asset,
            new_minted_id
        });

        let name_value = name.read_slice().unwrap();
        let symbol_value = symbol.read_slice().unwrap();

        let sender = msg_sender().unwrap();

        SetNameEvent::new(asset, Some(name_value), sender).log();
        SetSymbolEvent::new(asset, Some(symbol_value), sender).log();
        SetDecimalsEvent::new(asset, 0u8, sender).log();
        TotalSupplyEvent::new(asset, 1, sender).log();

        let mut i = 0;
        while i < metadata_keys.len() {
            let key = metadata_keys.get(i).unwrap();
            if let Some(metadata) = metadata.get(AssetId::from(SubId::zero()), key.read_slice().unwrap()) {
                SetMetadataEvent::new(asset, Some(metadata), key.read_slice().unwrap(), sender).log();
            }
            i += 1;
        }

        last_minted_id_value = new_minted_id;
        minted_count += 1;
    }

    // Update last minted id in storage
    last_minted_id.write(last_minted_id_value);
    let existing_count: u64 = minted_by_address.get(recipient).try_read().unwrap_or(0);
    minted_by_address.insert(recipient, existing_count + minted_count);
}

#[storage(read, write), payable]
fn _airdrop(
    recipient: Identity,
    amount: u64,
    total_assets: StorageKey<u64>,
    last_minted_id: StorageKey<u64>,
    total_supply: StorageKey<StorageMap<AssetId, u64>>,
    name: StorageKey<StorageString>,
    symbol: StorageKey<StorageString>,
    metadata_keys: StorageKey<StorageVec<StorageString>>,
    metadata: StorageKey<StorageMetadata>
) {
    require(!DISABLE_AIRDROP, "Airdrop is disabled");
    only_owner();
    require_not_paused();

    let total_assets_value = total_assets.try_read().unwrap_or(0);
    let mut last_minted_id_value = last_minted_id.try_read().unwrap_or(0);

    require(
        total_assets_value + amount <= MAX_SUPPLY,
        MintError::MaxNFTsMinted,
    );

    let mut minted_count = 0;

    while minted_count < amount {
        let new_minted_id = last_minted_id_value + 1;
        let new_sub_id = new_minted_id.as_u256().as_b256();
        let asset = AssetId::new(ContractId::this(), new_sub_id);

        // Mint the NFT
        let _ = _mint(
            total_assets,
            total_supply,
            recipient,
            new_sub_id,
            1,
        );

        log(AirdropEvent{
            recipient,
            amount,
            new_minted_id
        });

        let name_value = name.read_slice().unwrap();
        let symbol_value = symbol.read_slice().unwrap();

        let sender = msg_sender().unwrap();

        SetNameEvent::new(asset, Some(name_value), sender).log();
        SetSymbolEvent::new(asset, Some(symbol_value), sender).log();
        SetDecimalsEvent::new(asset, 0u8, sender).log();
        TotalSupplyEvent::new(asset, 1, sender).log();

        let mut i = 0;
        while i < metadata_keys.len() {
            let key = metadata_keys.get(i).unwrap();
            if let Some(metadata) = metadata.get(AssetId::from(SubId::zero()), key.read_slice().unwrap()) {
                SetMetadataEvent::new(asset, Some(metadata), key.read_slice().unwrap(), sender).log();
            }
            i += 1;
        }

        last_minted_id_value = new_minted_id;
        minted_count += 1;
    }

    // Update last minted id in storage
    last_minted_id.write(last_minted_id_value);
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
    #[storage(read,write), payable]
    fn mint(recipient: Identity, _sub_id: SubId, amount: u64, affiliate: Option<Identity>, proof: Option<Vec<b256>>, key: Option<u64>, num_leaves: Option<u64>, max_amount: Option<u64>) {
        _mint_core(
            recipient,
            _sub_id,
            amount,
            affiliate,
            proof,
            key,
            num_leaves,
            max_amount,
            storage.start_date,
            storage.end_date,
            storage.merkle_root,
            storage.minted_by_address,
            storage.price,
            storage.total_assets,
            storage.last_minted_id,
            storage.total_supply,
            storage.name,
            storage.symbol,
            storage.metadata_keys,
            storage.metadata
        );
    }

    /// Mints new assets to a recipient in a sequential manner. Only callable by the owner.
    ///
    /// # Arguments
    ///
    /// * `recipient`: [Identity] - The user to which the newly minted assets are transferred to.
    /// * `amount`: [u64] - The quantity of coins to mint.
    ///
    /// # Reverts
    ///
    /// * When the contract is paused.
    /// * When more than the MAX_SUPPLY NFTs have been minted.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `2`
    /// * Writes: `2`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src3::SRC3;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let contract_abi = abi(SR3, contract_id);
    ///     contract_abi.airdrop(Identity::ContractId(ContractId::this()), 1);
    /// }
    /// ```
    #[storage(read, write)]
    fn airdrop(recipient: Identity, amount: u64) {
        _airdrop(recipient, amount, storage.total_assets, storage.last_minted_id, storage.total_supply, storage.name, storage.symbol, storage.metadata_keys, storage.metadata)
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
        log(BurnEvent{
            amount,
            sub_id
        });
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

impl SRC7MetadataExtension for Contract {
    /// Returns all metadata for the corresponding `asset`.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query all metadata.
    ///
    /// # Returns
    ///
    /// * [Option<Vec<(String, Metadata)>>] - A vector of key-metadata pairs if any metadata exists, otherwise `None`.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `N` where `N` is the number of keys in `metadata_keys`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src_7::{SRC7MetadataExtension, Metadata};
    /// use std::string::String;
    /// use std::vec::Vec;
    ///
    /// fn foo(contract_id: ContractId, asset: AssetId) {
    ///     let contract_abi = abi(SRC7MetadataExtension, contract_id);
    ///     let data = contract_abi.total_metadata(asset);
    ///     assert(data.is_some());
    /// }
    /// ```
    #[storage(read)]
    fn total_metadata(asset: AssetId) -> Option<Vec<(String, Metadata)>> {
        let mut all_metadata = Vec::new();
        let keys = storage.metadata_keys;

        let mut i = 0;
        while i < keys.len() {
            let key = keys.get(i).unwrap();
            if let Some(metadata) = storage.metadata.get(AssetId::from(SubId::zero()), key.read_slice().unwrap()) {
                all_metadata.push((key.read_slice().unwrap(), metadata));
            }
            i += 1;
        }

        if all_metadata.is_empty() {
            None
        } else {
            Some(all_metadata)
        }
    }

    /// Returns all metadata keys for the contract.
    ///
    /// # Returns
    ///
    /// * [Vec<String>] - A vector containing all metadata keys.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src_7::SRC7MetadataExtension;
    /// use std::string::String;
    /// use std::vec::Vec;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let contract_abi = abi(SRC7MetadataExtension, contract_id);
    ///     let keys = contract_abi.metadata_keys();
    ///     assert(!keys.is_empty());
    /// }
    /// ```
    #[storage(read)]
    fn metadata_keys() -> Vec<String> {
        let keys = storage.metadata_keys;
        let mut result = Vec::new();

        let mut i = 0;
        while i < keys.len() {
            let key = keys.get(i).unwrap();
            result.push(key.read_slice().unwrap());
            i += 1;
        }

        result
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
        let sender = msg_sender().unwrap();
        SetMetadataEvent::new(asset, Some(metadata), key, sender).log();
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
        log(SetMintPriceEvent{
            price
        });
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
    /// * [Option<(u64, u64, u64)>] - A tuple containing the builder fee, and base fee.
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
    ///     let (builder_fee, base_fee) = mint_abi.fees().unwrap();
    /// }
    /// ```
    fn fees() -> Option<(u64, u64)> {
        let fee_splitter = abi(PropsFeeSplitter, FEE_CONTRACT_ID);
        let fee:u64 = fee_splitter.fee().unwrap_or(0);
        Some((fee, BUILDER_FEE))
    }

    /// Returns the start date of the contract.
    ///
    /// # Returns
    ///
    /// * [Option<u64>] - The start date if set, otherwise `None`.
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
    ///     let start = mint_abi.start_date();
    ///     assert(start.is_some());
    /// }
    /// ```
    #[storage(read)]
    fn start_date() -> Option<u64> {
        Some(storage.start_date.try_read().unwrap_or(0))
    }

    /// Returns the end date of the contract.
    ///
    /// # Returns
    ///
    /// * [Option<u64>] - The end date if set, otherwise `None`.
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
    ///     let end = mint_abi.end_date();
    ///     assert(end.is_some());
    /// }
    /// ```
    #[storage(read)]
    fn end_date() -> Option<u64> {
        Some(storage.end_date.try_read().unwrap_or(0))
    }

    /// Sets the start and end dates for the contract.
    ///
    /// # Arguments
    ///
    /// * `start`: [u64] - The start date to set.
    /// * `end`: [u64] - The end date to set.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Writes: `2`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::mint::SetMintMetadata;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let mint_abi = abi(SetMintMetadata, contract_id);
    ///     mint_abi.set_dates(1000, 2000);
    ///     assert_eq!(mint_abi.start_date(), Some(1000));
    ///     assert_eq!(mint_abi.end_date(), Some(2000));
    /// }
    /// ```
    #[storage(write)]
    fn set_dates(start: u64, end: u64) {
        only_owner();
        storage.start_date.write(start);
        storage.end_date.write(end);
        log(SetMintDatesEvent{
            start,
            end
        });
    }

    /// Sets the Merkle root for the contract.
    ///
    /// # Arguments
    ///
    /// * `root`: [b256] - The Merkle root to set.
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
    /// fn foo(contract_id: ContractId) {
    ///     let mint_abi = abi(SetMintMetadata, contract_id);
    ///     let root = 0x1234567890123456789012345678901234567890123456789012345678901234;
    ///     mint_abi.set_merkle_root(root);
    /// }
    /// ```
    #[storage(write)]
    fn set_merkle_root(root: b256) {
        only_owner();
        storage.merkle_root.write(root);
    }

    /// Returns the Merkle root for the contract.
    ///
    /// # Returns
    ///
    /// * [Option<b256>] - The Merkle root if set, or None if not set.
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
    ///     let root = mint_abi.merkle_root();
    ///     assert(root.is_some());
    /// }
    /// ```
    #[storage(read)]
    fn merkle_root() -> Option<b256> {
        Some(storage.merkle_root.read())
    }

    /// Returns the Merkle URI for the contract.
    ///
    /// # Returns
    ///
    /// * [Option<String>] - The Merkle URI if set, or None if not set.
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
    ///     let uri = mint_abi.merkle_uri();
    ///     assert(uri.is_some());
    /// }
    /// ```
    #[storage(read)]
    fn merkle_uri() -> Option<String> {
        Some(storage.merkle_uri.read_slice().unwrap())
    }

    /// Sets the Merkle root and URI for the contract.
    ///
    /// # Arguments
    ///
    /// * `root`: [b256] - The Merkle root to set.
    /// * `uri`: [String] - The Merkle URI to set.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Writes: `2`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::mint::SetMintMetadata;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let mint_abi = abi(SetMintMetadata, contract_id);
    ///     let root = 0x1234567890123456789012345678901234567890123456789012345678901234;
    ///     let uri = "https://example.com/merkle";
    ///     mint_abi.set_merkle(root, uri);
    /// }
    /// ```
    #[storage(write)]
    fn set_merkle(root: b256, uri: String) {
        only_owner();
        storage.merkle_root.write(root);
        storage.merkle_uri.write_slice(uri);
        log(SetMerkleRootEvent{
            root,
            uri
        });
    }

    /// Returns the maximum supply of tokens that can be minted.
    ///
    /// # Returns
    ///
    /// * [Option<u64>] - The maximum supply of tokens.
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
    ///     let max_supply = mint_abi.max_supply();
    ///     assert(max_supply.is_some());
    /// }
    /// ```
    fn max_supply() -> Option<u64> {
        Some(MAX_SUPPLY)
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
    fn constructor(owner: Identity, name: String, symbol: String, metadata_keys: Vec<String>, metadata_values: Vec<Metadata>, price: u64, start_date: u64, end_date: u64) {
        initialize_ownership(owner);

        storage.name.write_slice(name);
        storage.symbol.write_slice(symbol);

        let mut i = 0;
        while i < metadata_keys.len() {
            let key = metadata_keys.get(i).unwrap();
            let value = metadata_values.get(i).unwrap();
            _set_metadata(storage.metadata, AssetId::from(SubId::zero()), key, value);
            storage.metadata_keys.push(StorageString{});
            storage.metadata_keys.get(i).unwrap().write_slice(key);
            i += 1;
        }

        storage.price.write(price);
        storage.start_date.write(start_date);
        storage.end_date.write(end_date);
    }
}
