use crate::utils::{
    interface::{constructor, register},
    setup::{defaults, setup},
};

use fuels::{
    types::{Address, ContractId,Identity},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn registers_contract() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2) = setup().await;
        let (
            owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet.clone(), other_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        let contract_id = ContractId::from(*id);
        let owner_address = Identity::Address(Address::from(owner_wallet.clone().address()));

        let response = register(&instance_1, contract_id, owner_address).await;
        let logs = response.decode_logs();
        // Check if a RegisterContractEvent is present in the logs
        assert!(logs.results.iter().any(|log| log.as_ref().unwrap().contains("RegisterContractEvent")));

        // Extract the contract_id and owner from the log
        let log_content = logs.results[0].as_ref().unwrap();
        let contract_id_str = contract_id.to_string();
        let owner_address_hex = format!("{:x}", owner_wallet.address().hash());

        // Check if the log contains the correct contract_id
        assert!(log_content.contains(&contract_id_str), "Log does not contain the correct contract_id");

        // Check if the log contains the correct owner address (in hex format without leading "0x")
        assert!(log_content.contains(&owner_address_hex), "Log does not contain the correct owner address");
    }
}