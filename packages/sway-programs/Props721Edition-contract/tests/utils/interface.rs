use crate::utils::setup::{Metadata, State, Props721Edition, PropsFeeSplitter};
use fuels::{
    prelude::{AssetId, CallParameters, TxPolicies, WalletUnlocked, ContractId, Bech32ContractId},
    programs::{call_response::FuelCallResponse, call_utils::TxDependencyExtension},
    types::{Bits256, Identity},
};
use std::str::FromStr;

pub(crate) async fn total_assets(contract: &Props721Edition<WalletUnlocked>) -> u64 {
    contract
        .methods()
        .total_assets()
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn total_supply(contract: &Props721Edition<WalletUnlocked>, asset: AssetId) -> Option<u64> {
    contract
        .methods()
        .total_supply(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn name(contract: &Props721Edition<WalletUnlocked>, asset: AssetId) -> Option<String> {
    contract.methods().name(asset).call().await.unwrap().value
}

pub(crate) async fn symbol(contract: &Props721Edition<WalletUnlocked>, asset: AssetId) -> Option<String> {
    contract.methods().symbol(asset).call().await.unwrap().value
}

pub(crate) async fn decimals(contract: &Props721Edition<WalletUnlocked>, asset: AssetId) -> Option<u8> {
    contract
        .methods()
        .decimals(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn mint(
    contract: &Props721Edition<WalletUnlocked>,
    recipient: Identity,
    sub_id: Bits256,
    amount: u64,
    price: u64,
    _fee_contract_id: ContractId,
    affilate: Option<Identity>,
    proof: Option<Vec<Bits256>>,
    key: Option<u64>,
    num_leaves: Option<u64>,
    max_amount: Option<u64>,
) -> FuelCallResponse<()> {
    // @dev TODO: This is a hack to get the contract id, should be refactored
    let id = Bech32ContractId::from(
        ContractId::from_str("0xd65987a6b981810a28559d57e5083d47a10ce269cbf96316554d5b4a1b78485a")
        .unwrap(),
    );
    // println!("fee_contract_id: {:?}", fee_contract_id);
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
    contract: &Props721Edition<WalletUnlocked>,
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
    contract: &Props721Edition<WalletUnlocked>,
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

pub(crate) async fn owner(contract: &Props721Edition<WalletUnlocked>) -> State {
    contract.methods().owner().call().await.unwrap().value
}

pub(crate) async fn constructor(
    contract: &Props721Edition<WalletUnlocked>,
    owner: Identity,
    name: String,
    symbol: String,
    metadata_keys: Vec<String>,
    metadata_values: Vec<Metadata>,
    price: u64,
    start_date: u64,
    end_date: u64,
) -> FuelCallResponse<()> {
    let id = Bech32ContractId::from(
        ContractId::from_str("0x551d2804bd325923b5e781d75163a40369a7da35acc7e64e8931b40b4839da32")
        .unwrap(),
    );
    contract.methods().constructor(owner, name, symbol, metadata_keys, metadata_values, price, start_date, end_date).with_contract_ids(&[id.clone()]).call().await.unwrap()
}

pub(crate) async fn metadata(
    contract: &Props721Edition<WalletUnlocked>,
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
    contract: &Props721Edition<WalletUnlocked>,
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

pub(crate) async fn total_metadata(
    contract: &Props721Edition<WalletUnlocked>,
    asset: AssetId,
) -> Option<Vec<(String, Metadata)>> {
    contract
        .methods()
        .total_metadata(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn metadata_keys(
    contract: &Props721Edition<WalletUnlocked>,
) -> Vec<String> {
    contract
        .methods()
        .metadata_keys()
        .call()
        .await
        .unwrap()
        .value
}



pub(crate) async fn pause(contract: &Props721Edition<WalletUnlocked>) -> FuelCallResponse<()> {
    contract.methods().pause().call().await.unwrap()
}

pub(crate) async fn unpause(contract: &Props721Edition<WalletUnlocked>) -> FuelCallResponse<()> {
    contract.methods().unpause().call().await.unwrap()
}

pub(crate) async fn is_paused(contract: &Props721Edition<WalletUnlocked>) -> bool {
    contract.methods().is_paused().call().await.unwrap().value
}

pub(crate) async fn set_price(
    contract: &Props721Edition<WalletUnlocked>,
    price: u64,
) -> FuelCallResponse<()> {
    contract.methods().set_price(price).call().await.unwrap()
}

pub(crate) async fn price(contract: &Props721Edition<WalletUnlocked>) -> Option<u64> {
    contract.methods().price().call().await.unwrap().value
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

pub(crate) async fn start_date(contract: &Props721Edition<WalletUnlocked>) -> Option<u64> {
    contract.methods().start_date().call().await.unwrap().value
}

pub(crate) async fn end_date(contract: &Props721Edition<WalletUnlocked>) -> Option<u64> {
    contract.methods().end_date().call().await.unwrap().value
}

pub(crate) async fn set_dates(
    contract: &Props721Edition<WalletUnlocked>,
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
    contract: &Props721Edition<WalletUnlocked>,
    root: Bits256,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_merkle_root(root)
        .call()
        .await
        .unwrap()
}

// pub(crate) async fn merkle_root(contract: &Props721Edition<WalletUnlocked>) -> Option<Bits256> {
//     contract
//         .methods()
//         .merkle_root()
//         .call()
//         .await
//         .unwrap()
//         .value
// }

