use crate::utils::setup::{Metadata, State, SRC721};
use fuels::{
    prelude::{AssetId, CallParameters, TxPolicies, WalletUnlocked},
    programs::{call_response::FuelCallResponse, call_utils::TxDependencyExtension},
    types::{Bits256, Identity},
};

pub(crate) async fn total_assets(contract: &SRC721<WalletUnlocked>) -> u64 {
    contract
        .methods()
        .total_assets()
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn total_supply(contract: &SRC721<WalletUnlocked>, asset: AssetId) -> Option<u64> {
    contract
        .methods()
        .total_supply(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn name(contract: &SRC721<WalletUnlocked>, asset: AssetId) -> Option<String> {
    contract.methods().name(asset).call().await.unwrap().value
}

pub(crate) async fn symbol(contract: &SRC721<WalletUnlocked>, asset: AssetId) -> Option<String> {
    contract.methods().symbol(asset).call().await.unwrap().value
}

pub(crate) async fn decimals(contract: &SRC721<WalletUnlocked>, asset: AssetId) -> Option<u8> {
    contract
        .methods()
        .decimals(asset)
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn mint(
    contract: &SRC721<WalletUnlocked>,
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
    contract: &SRC721<WalletUnlocked>,
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

pub(crate) async fn owner(contract: &SRC721<WalletUnlocked>) -> State {
    contract.methods().owner().call().await.unwrap().value
}

pub(crate) async fn set_name(
    contract: &SRC721<WalletUnlocked>,
    asset: AssetId,
    name: String,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_name(asset, name)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn set_symbol(
    contract: &SRC721<WalletUnlocked>,
    asset: AssetId,
    name: String,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_symbol(asset, name)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn set_decimals(
    contract: &SRC721<WalletUnlocked>,
    asset: AssetId,
    decimals: u8,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_decimals(asset, decimals)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn constructor(
    contract: &SRC721<WalletUnlocked>,
    owner: Identity,
) -> FuelCallResponse<()> {
    contract.methods().constructor(owner).call().await.unwrap()
}

pub(crate) async fn metadata(
    contract: &SRC721<WalletUnlocked>,
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
    contract: &SRC721<WalletUnlocked>,
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

pub(crate) async fn pause(contract: &SRC721<WalletUnlocked>) -> FuelCallResponse<()> {
    contract.methods().pause().call().await.unwrap()
}

pub(crate) async fn unpause(contract: &SRC721<WalletUnlocked>) -> FuelCallResponse<()> {
    contract.methods().unpause().call().await.unwrap()
}

pub(crate) async fn is_paused(contract: &SRC721<WalletUnlocked>) -> bool {
    contract.methods().is_paused().call().await.unwrap().value
}
