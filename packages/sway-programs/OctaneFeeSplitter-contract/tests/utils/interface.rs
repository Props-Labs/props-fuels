use crate::utils::setup::{State, OctaneFeeSplitter};
use fuels::{
    prelude::{AssetId, CallParameters, TxPolicies, WalletUnlocked},
    programs::{call_response::FuelCallResponse, call_utils::TxDependencyExtension},
    types::{Bits256, Identity},
};

pub(crate) async fn constructor(
    contract: &OctaneFeeSplitter<WalletUnlocked>,
    owner: Identity,
) -> FuelCallResponse<()> {
    contract.methods().constructor(owner).call().await.unwrap()
}

pub(crate) async fn owner(contract: &OctaneFeeSplitter<WalletUnlocked>) -> State {
    contract.methods().owner().call().await.unwrap().value
}

pub(crate) async fn set_fee(
    contract: &OctaneFeeSplitter<WalletUnlocked>,
    fee: u64,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_fee(fee)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn fee(contract: &OctaneFeeSplitter<WalletUnlocked>) -> Option<u64> {
    contract
        .methods()
        .fee()
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn set_shares(
    contract: &OctaneFeeSplitter<WalletUnlocked>,
    recipients: Vec<Identity>,
    shares: Vec<u64>,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .set_shares(recipients,shares)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn get_share(
    contract: &OctaneFeeSplitter<WalletUnlocked>,
) -> Option<u64> {
    contract
        .methods()
        .get_share()
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn total_shares(
    contract: &OctaneFeeSplitter<WalletUnlocked>,
) -> Option<u64> {
    contract
        .methods()
        .total_shares()
        .call()
        .await
        .unwrap()
        .value
}

pub(crate) async fn receive_funds(
    contract: &OctaneFeeSplitter<WalletUnlocked>,
    amount: u64,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .receive_funds()
        .call_params(CallParameters::new(amount, AssetId::zeroed(), 1_000_000))
        .unwrap()
        .call()
        .await
        .unwrap()
}

pub(crate) async fn distribute_funds(
    contract: &OctaneFeeSplitter<WalletUnlocked>,
    amount: u64,
    recipient_count: u64,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .distribute_funds(amount)
        .append_variable_outputs(2)
        .call()
        .await
        .unwrap()
}
