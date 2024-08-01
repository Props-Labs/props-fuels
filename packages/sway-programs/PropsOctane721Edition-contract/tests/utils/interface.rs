use crate::utils::setup::{Metadata, State, PropsOctane721Edition, PropsOctaneFeeSplitter};
use fuels::{
    prelude::{AssetId, CallParameters, TxPolicies, WalletUnlocked, ContractId, Bech32ContractId},
    programs::{call_response::FuelCallResponse, call_utils::TxDependencyExtension},
    types::{Bits256, Identity},
};
use std::str::FromStr;

pub(crate) async fn total_assets(contract: &PropsOctane721Edition<WalletUnlocked>) -> u64 {
    contract
        .methods()
        .total_assets()
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn total_supply(contract: &PropsOctane721Edition<WalletUnlocked>, asset: AssetId) -> Option<u64> {
    contract
        .methods()
        .total_supply(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn name(contract: &PropsOctane721Edition<WalletUnlocked>, asset: AssetId) -> Option<String> {
    contract.methods().name(asset).call().await.unwrap().value
}

pub(crate) async fn symbol(contract: &PropsOctane721Edition<WalletUnlocked>, asset: AssetId) -> Option<String> {
    contract.methods().symbol(asset).call().await.unwrap().value
}

pub(crate) async fn decimals(contract: &PropsOctane721Edition<WalletUnlocked>, asset: AssetId) -> Option<u8> {
    contract
        .methods()
        .decimals(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn mint(
    contract: &PropsOctane721Edition<WalletUnlocked>,
    recipient: Identity,
    sub_id: Bits256,
    amount: u64,
    price: u64,
    fee_contract_id: ContractId,
    affilate: Option<Identity>
) -> FuelCallResponse<()> {
    // @dev TODO: This is a hack to get the contract id, should be refactored
    let id = Bech32ContractId::from(
        ContractId::from_str("0xf6b478da6741beed76acdc1e8cfb9fa64d250378e8868201a5aa2c0afc7fb328")
        .unwrap(),
    );
    println!("fee_contract_id: {:?}", fee_contract_id);
    contract
        .methods()
        .mint(recipient, sub_id, amount, affilate)
        .with_contract_ids(&[id.clone()])
        .append_variable_outputs(4)
        .call_params(CallParameters::new(price, AssetId::zeroed(), 1_000_000))
        .unwrap()
        .call()
        .await
        .unwrap()
}

pub(crate) async fn burn(
    contract: &PropsOctane721Edition<WalletUnlocked>,
    asset_id: AssetId,
    sub_id: Bits256,
    amount: u64,
) -> FuelCallResponse<()> {
    let call_params = CallParameters::new(amount, asset_id, 1_000_000);

    contract
        .methods()
        .burn(sub_id, amount)
        .with_tx_policies(TxPolicies::default().with_script_gas_limit(2_000_000))
        .call_params(call_params)
        .unwrap()
        .call()
        .await
        .unwrap()
}

pub(crate) async fn owner(contract: &PropsOctane721Edition<WalletUnlocked>) -> State {
    contract.methods().owner().call().await.unwrap().value
}

pub(crate) async fn constructor(
    contract: &PropsOctane721Edition<WalletUnlocked>,
    owner: Identity,
    name: String,
    symbol: String,
    metadata_keys: Vec<String>,
    metadata_values: Vec<Metadata>,
    price: u64,
) -> FuelCallResponse<()> {
    let resp = contract.methods().constructor(owner, name, symbol, metadata_keys, metadata_values, price).call().await.unwrap();
    resp
}

pub(crate) async fn metadata(
    contract: &PropsOctane721Edition<WalletUnlocked>,
    asset: AssetId,
    key: String,
) -> Option<Metadata> {
    contract
        .methods()
        .metadata(asset, key)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn set_metadata(
    contract: &PropsOctane721Edition<WalletUnlocked>,
    asset: AssetId,
    key: String,
    metadata: Metadata,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_metadata(asset, key, metadata)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn pause(contract: &PropsOctane721Edition<WalletUnlocked>) -> FuelCallResponse<()> {
    contract.methods().pause().call().await.unwrap()
}

pub(crate) async fn unpause(contract: &PropsOctane721Edition<WalletUnlocked>) -> FuelCallResponse<()> {
    contract.methods().unpause().call().await.unwrap()
}

pub(crate) async fn is_paused(contract: &PropsOctane721Edition<WalletUnlocked>) -> bool {
    contract.methods().is_paused().call().await.unwrap().value
}

pub(crate) async fn set_price(
    contract: &PropsOctane721Edition<WalletUnlocked>,
    price: u64,
) -> FuelCallResponse<()> {
    contract.methods().set_price(price).call().await.unwrap()
}

pub(crate) async fn price(contract: &PropsOctane721Edition<WalletUnlocked>) -> Option<u64> {
    contract.methods().price().call().await.unwrap().value
}

// @dev Not very dry, should be moved into its own test-utils module

pub(crate) async fn fee_constructor(
    contract: &PropsOctaneFeeSplitter<WalletUnlocked>,
    owner: Identity,
) -> FuelCallResponse<()> {
    contract.methods().constructor(owner).call().await.unwrap()
}

pub(crate) async fn set_fee(
    contract: &PropsOctaneFeeSplitter<WalletUnlocked>,
    fee: u64,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_fee(fee)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn fee(contract: &PropsOctaneFeeSplitter<WalletUnlocked>) -> Option<u64> {
    contract
        .methods()
        .fee()
        .call()
        .await
        .unwrap()
        .value
}