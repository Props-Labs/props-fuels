use crate::utils::setup::{Metadata, State, SRC721EditionImmutable};
use fuels::{
    prelude::{AssetId, CallParameters, TxPolicies, WalletUnlocked},
    programs::{call_response::FuelCallResponse, call_utils::TxDependencyExtension},
    types::{Bits256, Identity},
};

pub(crate) async fn total_assets(contract: &SRC721EditionImmutable<WalletUnlocked>) -> u64 {
    contract
        .methods()
        .total_assets()
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn total_supply(contract: &SRC721EditionImmutable<WalletUnlocked>, asset: AssetId) -> Option<u64> {
    contract
        .methods()
        .total_supply(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn name(contract: &SRC721EditionImmutable<WalletUnlocked>, asset: AssetId) -> Option<String> {
    contract.methods().name(asset).call().await.unwrap().value
}

pub(crate) async fn symbol(contract: &SRC721EditionImmutable<WalletUnlocked>, asset: AssetId) -> Option<String> {
    contract.methods().symbol(asset).call().await.unwrap().value
}

pub(crate) async fn decimals(contract: &SRC721EditionImmutable<WalletUnlocked>, asset: AssetId) -> Option<u8> {
    contract
        .methods()
        .decimals(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn mint(
    contract: &SRC721EditionImmutable<WalletUnlocked>,
    recipient: Identity,
    sub_id: Bits256,
    amount: u64,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .mint(recipient, sub_id, amount)
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn burn(
    contract: &SRC721EditionImmutable<WalletUnlocked>,
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

pub(crate) async fn owner(contract: &SRC721EditionImmutable<WalletUnlocked>) -> State {
    contract.methods().owner().call().await.unwrap().value
}

pub(crate) async fn constructor(
    contract: &SRC721EditionImmutable<WalletUnlocked>,
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
    contract: &SRC721EditionImmutable<WalletUnlocked>,
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
    contract: &SRC721EditionImmutable<WalletUnlocked>,
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

pub(crate) async fn pause(contract: &SRC721EditionImmutable<WalletUnlocked>) -> FuelCallResponse<()> {
    contract.methods().pause().call().await.unwrap()
}

pub(crate) async fn unpause(contract: &SRC721EditionImmutable<WalletUnlocked>) -> FuelCallResponse<()> {
    contract.methods().unpause().call().await.unwrap()
}

pub(crate) async fn is_paused(contract: &SRC721EditionImmutable<WalletUnlocked>) -> bool {
    contract.methods().is_paused().call().await.unwrap().value
}

pub(crate) async fn set_price(
    contract: &SRC721EditionImmutable<WalletUnlocked>,
    price: u64,
) -> FuelCallResponse<()> {
    contract.methods().set_price(price).call().await.unwrap()
}

pub(crate) async fn price(contract: &SRC721EditionImmutable<WalletUnlocked>) -> Option<u64> {
    contract.methods().price().call().await.unwrap().value
}
