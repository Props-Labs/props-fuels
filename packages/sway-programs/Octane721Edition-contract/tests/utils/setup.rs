use fuels::{
    accounts::ViewOnlyAccount,
    prelude::{
        abigen, launch_custom_provider_and_get_wallets, AssetConfig, Contract, ContractId,
        LoadConfiguration, TxPolicies, WalletUnlocked, WalletsConfig,
    },
    types::{Address, AssetId, Bits256, Bytes32, Identity},
};
use sha2::{Digest, Sha256};

abigen!(Contract(
    name = "Octane721Edition",
    abi = "./Octane721Edition-contract/out/debug/Octane721Edition-contract-abi.json"
),Contract(
    name = "OctaneFeeSplitter",
    abi = "./OctaneFeeSplitter-contract/out/debug/OctaneFeeSplitter-contract-abi.json"
),);

const FEE_SPLITTER_CONTRACT_BINARY_PATH: &str = "../OctaneFeeSplitter-contract/out/debug/OctaneFeeSplitter-contract.bin";

const NFT_CONTRACT_BINARY_PATH: &str = "./out/debug/Octane721Edition-contract.bin";

pub(crate) fn defaults(
    contract_id: ContractId,
    wallet_1: WalletUnlocked,
    wallet_2: WalletUnlocked,
) -> (
    AssetId,
    AssetId,
    AssetId,
    Bits256,
    Bits256,
    Bits256,
    Identity,
    Identity,
) {
    let sub_id_1 = Bytes32::from([0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 1u8]);
    let sub_id_2 = Bytes32::from([0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 2u8]);
    let sub_id_3 = Bytes32::from([0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 3u8]);

    println!("sub_id_1: {:?}", sub_id_1);
    println!("sub_id_2: {:?}", sub_id_2);
    println!("sub_id_3: {:?}", sub_id_3);

    let asset1 = get_asset_id(sub_id_1, contract_id);
    let asset2 = get_asset_id(sub_id_2, contract_id);
    let asset3 = get_asset_id(sub_id_3, contract_id);

    let identity_1 = Identity::Address(Address::from(wallet_1.address()));
    let identity_2 = Identity::Address(Address::from(wallet_2.address()));

    (
        asset1,
        asset2,
        asset3,
        Bits256(*sub_id_1),
        Bits256(*sub_id_2),
        Bits256(*sub_id_3),
        identity_1,
        identity_2,
    )
}

pub(crate) async fn setup() -> (
    WalletUnlocked,
    WalletUnlocked,
    ContractId,
    Octane721Edition<WalletUnlocked>,
    Octane721Edition<WalletUnlocked>,
    ContractId,
    OctaneFeeSplitter<WalletUnlocked>,
) {
    let number_of_coins = 1;
    let coin_amount = 100_000_000;
    let number_of_wallets = 2;

    let base_asset = AssetConfig {
        id: AssetId::zeroed(),
        num_coins: number_of_coins,
        coin_amount,
    };
    let assets = vec![base_asset];

    let wallet_config = WalletsConfig::new_multiple_assets(number_of_wallets, assets);
    let mut wallets = launch_custom_provider_and_get_wallets(wallet_config, None, None)
        .await
        .unwrap();

    let wallet1 = wallets.pop().unwrap();
    let wallet2 = wallets.pop().unwrap();

    let id = Contract::load_from(NFT_CONTRACT_BINARY_PATH, LoadConfiguration::default())
        .unwrap()
        .deploy(&wallet1, TxPolicies::default())
        .await
        .unwrap();

    let instance_1 = Octane721Edition::new(id.clone(), wallet1.clone());
    let instance_2 = Octane721Edition::new(id.clone(), wallet2.clone());

    let fee_id = Contract::load_from(FEE_SPLITTER_CONTRACT_BINARY_PATH, LoadConfiguration::default())
        .unwrap()
        .deploy(&wallet1, TxPolicies::default())
        .await
        .unwrap();

    // println!("fee_id: {:?}", fee_id.toB256());

    let fee_instance_1 = OctaneFeeSplitter::new(fee_id.clone(), wallet1.clone());

    (wallet1, wallet2, id.into(), instance_1, instance_2, fee_id.into(), fee_instance_1)
}

pub(crate) fn get_asset_id(sub_id: Bytes32, contract: ContractId) -> AssetId {
    let mut hasher = Sha256::new();
    hasher.update(*contract);
    hasher.update(*sub_id);
    AssetId::new(*Bytes32::from(<[u8; 32]>::from(hasher.finalize())))
}

pub(crate) async fn get_wallet_balance(wallet: &WalletUnlocked, asset: &AssetId) -> u64 {
    wallet.get_asset_balance(asset).await.unwrap()
}

pub fn default_metadata_keys() -> Vec<String> {
    vec![
        String::from("description"),
        String::from("external_url"),
        String::from("image"),
        String::from("name"),
        String::from("attributes"),
    ]
}

pub fn default_metadata_values() -> Vec<Metadata> {
    vec![
        Metadata::String(String::from("Friendly OpenSea Creature that enjoys long swims in the ocean.")),
        Metadata::String(String::from("https://openseacreatures.io/3")),
        Metadata::String(String::from("https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png")),
        Metadata::String(String::from("Dave Starbelly")),
        Metadata::String(String::from("[]")), // Assuming attributes is an empty array for now
    ]
}

pub fn default_name() -> String {
    "My Props NFT Edition".to_string()
}

pub fn default_symbol() -> String {
    "PNFTE".to_string()
}

pub fn default_price() -> u64 {
    0
}