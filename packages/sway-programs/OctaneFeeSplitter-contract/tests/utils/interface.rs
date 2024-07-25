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
