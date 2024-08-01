use fuels::{
    prelude::{
        abigen, launch_custom_provider_and_get_wallets, AssetConfig, Contract, ContractId,
        LoadConfiguration, TxPolicies, WalletUnlocked, WalletsConfig,
    },
    types::{Address, AssetId, Identity},
};

abigen!(Contract(
    name = "PropsOctaneFeeSplitter",
    abi = "./PropsOctaneFeeSplitter-contract/out/debug/PropsOctaneFeeSplitter-contract-abi.json"
),);

const CONTRACT_BINARY_PATH: &str = "./out/debug/PropsOctaneFeeSplitter-contract.bin";

pub(crate) fn defaults(
    _contract_id: ContractId,
    wallet_1: WalletUnlocked,
    wallet_2: WalletUnlocked,
    wallet_3: WalletUnlocked,
) -> (
    Identity,
    Identity,
    Identity,
) {
    let identity_1 = Identity::Address(Address::from(wallet_1.address()));
    let identity_2 = Identity::Address(Address::from(wallet_2.address()));
    let identity_3 = Identity::Address(Address::from(wallet_3.address()));

    (
        identity_1,
        identity_2,
        identity_3,
    )
}

pub(crate) async fn setup() -> (
    WalletUnlocked,
    WalletUnlocked,
    WalletUnlocked,
    ContractId,
    PropsOctaneFeeSplitter<WalletUnlocked>,
    PropsOctaneFeeSplitter<WalletUnlocked>,
) {
    let number_of_coins = 1;
    let coin_amount = 100_000_000;
    let number_of_wallets = 3;

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
    let wallet3 = wallets.pop().unwrap();

    let id = Contract::load_from(CONTRACT_BINARY_PATH, LoadConfiguration::default())
        .unwrap()
        .deploy(&wallet1, TxPolicies::default())
        .await
        .unwrap();

    println!("Contract deployed at: {:?}", id);

    let instance_1 = PropsOctaneFeeSplitter::new(id.clone(), wallet1.clone());
    let instance_2 = PropsOctaneFeeSplitter::new(id.clone(), wallet2.clone());

    (wallet1, wallet2, wallet3, id.into(), instance_1, instance_2)
}