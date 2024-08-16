use crate::utils::setup::{PropsRegistry, State};
use fuels::{
    prelude::{AssetId, CallParameters, TxPolicies, WalletUnlocked, ContractId, Bech32ContractId},
    programs::{call_response::FuelCallResponse, call_utils::TxDependencyExtension},
    types::{Bits256, Identity},
};

pub(crate) async fn register(
    contract: &PropsRegistry<WalletUnlocked>,
    contract_id: ContractId,
    owner: Identity,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .register(contract_id, owner)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn deregister(
    contract: &PropsRegistry<WalletUnlocked>,
    contract_id: ContractId,
) -> FuelCallResponse<()> {
    contract
        .methods()
        .deregister(contract_id)
        .call()
        .await
        .unwrap()
}

pub(crate) async fn constructor(
    contract: &PropsRegistry<WalletUnlocked>,
    owner: Identity,
) -> FuelCallResponse<()> {
    contract.methods().constructor(owner).call().await.unwrap()
}

pub(crate) async fn owner(contract: &PropsRegistry<WalletUnlocked>) -> State {
    contract.methods().owner().call().await.unwrap().value
}


