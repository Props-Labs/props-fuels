contract;

mod errors;
mod interface;

use errors::{MintError, SetError};
use interface::{Props721Collection, SetTokenUri};
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
    merkle::binary_proof::*,
};
use std::{hash::*, storage::storage_string::*, storage::storage_vec::*, string::String, bytes::Bytes, bytes_conversions::{b256::*, u16::*, u256::*, u32::*, u64::*,}};
use std::logging::log;
use std::context::msg_amount;
use std::call_frames::msg_asset_id;
use std::asset::{transfer};
use std::block::timestamp;

use libraries::*;

const FEE_CONTRACT_ID = 0xe63564f83a2b82b97ea3f42d1680eeca825e3596b76da197ea4f6f6595810562;

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

    /// The total number of coins minted for a particular asset.
    ///
    /// # Additional Information
    ///
    /// This should always be 1 for any asset as this is an NFT contract.
    assets_to_sub_id: StorageMap<AssetId, SubId> = StorageMap {},

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

    /// The base URI for the NFT collection.
    base_uri: StorageString = StorageString {},

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

pub fn concat(a: String, b: String) -> String {
    let mut a = a.as_bytes();
    let b = b.as_bytes();
    a.append(b);
    String::from_ascii(a)
}

pub fn concat_with_bytes(a: String, b: Bytes) -> String {
    let mut a = a.as_bytes();
    a.append(b);
    String::from_ascii(a)
}

fn convert_num_to_ascii_bytes(num: u64) -> Bytes {
    let mut bytes = Bytes::new();
    let mut n = num;
    if n == 0 {
        bytes.push(48);
        return bytes;
    }
    while n != 0 {
        // 48 - is an ASCII offset for digits
        bytes.push(((n % 10) + 48).try_as_u8().unwrap());
        n /= 10;
    }
    let mut reversed_bytes = Bytes::with_capacity(bytes.len());
    while !bytes.is_empty() {
        reversed_bytes.push(bytes.pop().unwrap());
    }
    return reversed_bytes;
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
    fn mint(recipient: Identity, _sub_id: SubId, amount: u64, affiliate: Option<Identity>, proof: Option<Vec<b256>>, key: Option<u64>, num_leaves: Option<u64>, max_amount: Option<u64>) {
        reentrancy_guard();
        require_not_paused();

        let current_time = timestamp();
        let start_date = storage.start_date.try_read().unwrap_or(0);
        let end_date = storage.end_date.try_read().unwrap_or(0);

        require(
            current_time >= start_date,
            MintError::OutsideMintingPeriod(String::from_ascii_str("Minting has not started yet."))
        );

        require(
            current_time <= end_date,
            MintError::OutsideMintingPeriod(String::from_ascii_str("Minting has ended."))
        );

        // Checking merkle proof
        let root = storage.merkle_root.try_read().unwrap_or(b256::zero());
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
            let minted_count: u64 = storage.minted_by_address.get(recipient).try_read().unwrap_or(0);
            require(
                minted_count + amount <= max_amount.unwrap_or(0),
                MintError::ExceededMaxMintLimit
            );
        }

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

        let mut minted_count = 0;

        while minted_count < amount {
            let new_minted_id = last_minted_id + 1;
            let new_sub_id = new_minted_id.as_u256().as_b256();
            let asset = AssetId::new(ContractId::this(), new_sub_id);

            storage.assets_to_sub_id.insert(asset, new_sub_id);

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
        require(!DISABLE_AIRDROP, "Airdrop is disabled");
        only_owner();
        require_not_paused();

        let total_assets = storage.total_assets.try_read().unwrap_or(0);
        let mut last_minted_id = storage.last_minted_id.try_read().unwrap_or(0);

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
        let base_uri = storage.base_uri.read_slice().unwrap();
        let sub_id_option = storage.assets_to_sub_id.get(asset).try_read();
        
        if sub_id_option.is_none() {
            revert(0); // Asset not minted yet
        }

        let sub_id = sub_id_option.unwrap();
        
        if key == String::from_ascii_str("uri") {
            let token_id = <u64 as TryFrom<u256>>::try_from(sub_id.as_u256());
            let token_id_bytes = convert_num_to_ascii_bytes(token_id.unwrap());
            let mut full_uri = concat_with_bytes(base_uri, token_id_bytes);
            // full_uri = concat(full_uri, String::from_ascii_str(".json")); //@dev TODO: remove this line
            Some(Metadata::String(full_uri))
        } else {
            storage.metadata.get(asset, key)
        }
    }
}

impl SetTokenUri for Contract { 
    /// Sets the base URI for the token metadata.
    ///
    /// # Arguments
    ///
    /// * `uri`: [String] - The base URI to be set.
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
    /// use src20::SetTokenUri;
    /// use std::string::String;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let contract_abi = abi(SetTokenUri, contract_id);
    ///     let new_uri = String::from_ascii_str("https://example.com/metadata/");
    ///     contract_abi.set_base_uri(new_uri);
    /// }
    /// ```
    #[storage(write)]
    fn set_base_uri(uri: String) {
        only_owner();
        storage.base_uri.write_slice(uri);
    }

    /// Returns the base URI for the token metadata.
    ///
    /// # Returns
    ///
    /// * [Option<String>] - The base URI if set, or None if not set.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use src20::SetTokenUri;
    /// use std::string::String;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let contract_abi = abi(SetTokenUri, contract_id);
    ///     let base_uri = contract_abi.base_uri();
    ///     if let Some(uri) = base_uri {
    ///         log(uri);
    ///     } else {
    ///         log("Base URI not set");
    ///     }
    /// }
    /// ```
    #[storage(read)]
    fn base_uri() -> Option<String> {
        storage.base_uri.read_slice()
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

impl Props721Collection for Contract {
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
    fn constructor(owner: Identity, name: String, symbol: String, base_uri: String, price: u64, start_date: u64, end_date: u64) {
        initialize_ownership(owner);

        storage.name.write_slice(name);
        storage.symbol.write_slice(symbol);
        storage.price.write(price);
        storage.base_uri.write_slice(base_uri);
        storage.start_date.write(start_date);
        storage.end_date.write(end_date);
    }
}
