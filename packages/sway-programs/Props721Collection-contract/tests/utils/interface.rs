use crate::utils::setup::{Metadata, State, Props721Collection, PropsFeeSplitter};
use fuels::{
    prelude::{AssetId, CallParameters, TxPolicies, WalletUnlocked, ContractId, Bech32ContractId},
    programs::{call_response::FuelCallResponse, call_utils::TxDependencyExtension},
    types::{Bits256, Identity},
};
use std::str::FromStr;

pub(crate) async fn total_assets(contract: &Props721Collection<WalletUnlocked>) -> u64 {
    contract
        .methods()
        .total_assets()
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn total_supply(contract: &Props721Collection<WalletUnlocked>, asset: AssetId) -> Option<u64> {
    contract
        .methods()
        .total_supply(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn name(contract: &Props721Collection<WalletUnlocked>, asset: AssetId) -> Option<String> {
    contract.methods().name(asset).call().await.unwrap().value
}

pub(crate) async fn symbol(contract: &Props721Collection<WalletUnlocked>, asset: AssetId) -> Option<String> {
    contract.methods().symbol(asset).call().await.unwrap().value
}

pub(crate) async fn decimals(contract: &Props721Collection<WalletUnlocked>, asset: AssetId) -> Option<u8> {
    contract
        .methods()
        .decimals(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn mint(
    contract: &Props721Collection<WalletUnlocked>,
    recipient: Identity,
    sub_id: Bits256,
    amount: u64,
    price: u64,
    _fee_contract_id: ContractId,
    affilate: Option<Identity>,
    proof: Option<Vec<Bits256>>,
    key: Option<u64>,
    num_leaves: Option<u64>,
    max_amount: Option<u64>
) -> FuelCallResponse<()> {
    // @dev TODO: This is a hack to get the contract id, should be refactored
    let id = Bech32ContractId::from(
        ContractId::from_str("0xd65987a6b981810a28559d57e5083d47a10ce269cbf96316554d5b4a1b78485a")
        .unwrap(),
    );
    contract
        .methods()
        .mint(recipient, sub_id, amount, affilate, proof, key, num_leaves, max_amount)
        .with_contract_ids(&[id.clone()])
        .append_variable_outputs(4)
        .call_params(CallParameters::new(price, AssetId::zeroed(), 1_000_000))
        .unwrap()
        .call()
        .await
        .unwrap()
}

pub(crate) async fn airdrop(
    contract: &Props721Collection<WalletUnlocked>,
    recipient: Identity,
    amount: u64,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .airdrop(recipient, amount)
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn burn(
    contract: &Props721Collection<WalletUnlocked>,
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

pub(crate) async fn owner(contract: &Props721Collection<WalletUnlocked>) -> State {
    contract.methods().owner().call().await.unwrap().value
}

pub(crate) async fn constructor(
    contract: &Props721Collection<WalletUnlocked>,
    owner: Identity,
    name: String,
    symbol: String,
    base_uri: String,
    price: u64,
    start_date: u64,
    end_date: u64,
) -> FuelCallResponse<()> {
    // let id = Bech32ContractId::from(
    //     ContractId::from_str("0x9b48042cdc01cf86a7d9d5f47b3ea43898c7d7a8282eede5f2f0c219d2e7c93f")
    //     .unwrap(),
    // );
    let resp = contract.methods().constructor(owner, name, symbol, base_uri, price, start_date, end_date).call().await.unwrap();
    resp
}

pub(crate) async fn metadata(
    contract: &Props721Collection<WalletUnlocked>,
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

pub(crate) async fn pause(contract: &Props721Collection<WalletUnlocked>) -> FuelCallResponse<()> {
    contract.methods().pause().call().await.unwrap()
}

pub(crate) async fn unpause(contract: &Props721Collection<WalletUnlocked>) -> FuelCallResponse<()> {
    contract.methods().unpause().call().await.unwrap()
}

pub(crate) async fn is_paused(contract: &Props721Collection<WalletUnlocked>) -> bool {
    contract.methods().is_paused().call().await.unwrap().value
}

pub(crate) async fn set_price(
    contract: &Props721Collection<WalletUnlocked>,
    price: u64,
) -> FuelCallResponse<()> {
    contract.methods().set_price(price).call().await.unwrap()
}

pub(crate) async fn price(contract: &Props721Collection<WalletUnlocked>) -> Option<u64> {
    contract.methods().price().call().await.unwrap().value
}

pub(crate) async fn set_base_uri(
    contract: &Props721Collection<WalletUnlocked>,
    uri: String,
) -> FuelCallResponse<()> {
    contract.methods().set_base_uri(uri).call().await.unwrap()
}

pub(crate) async fn base_uri(contract: &Props721Collection<WalletUnlocked>) -> Option<String> {
    contract.methods().base_uri().call().await.unwrap().value
}


// @dev Not very dry, should be moved into its own test-utils module

pub(crate) async fn fee_constructor(
    contract: &PropsFeeSplitter<WalletUnlocked>,
    owner: Identity,
) -> FuelCallResponse<()> {
    contract.methods().constructor(owner).call().await.unwrap()
}

pub(crate) async fn set_fee(
    contract: &PropsFeeSplitter<WalletUnlocked>,
    fee: u64,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_fee(fee)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn fee(contract: &PropsFeeSplitter<WalletUnlocked>) -> Option<u64> {
    contract
        .methods()
        .fee()
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn start_date(contract: &Props721Collection<WalletUnlocked>) -> Option<u64> {
    contract.methods().start_date().call().await.unwrap().value
}

pub(crate) async fn end_date(contract: &Props721Collection<WalletUnlocked>) -> Option<u64> {
    contract.methods().end_date().call().await.unwrap().value
}

pub(crate) async fn set_dates(
    contract: &Props721Collection<WalletUnlocked>,
    start_date: u64,
    end_date: u64,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_dates(start_date, end_date)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn set_merkle_root(
    contract: &Props721Collection<WalletUnlocked>,
    root: Bits256,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_merkle_root(root)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn max_supply(contract: &Props721Collection<WalletUnlocked>) -> Option<u64> {
    contract.methods().max_supply().call().await.unwrap().value
}