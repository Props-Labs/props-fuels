use crate::utils::{
    interface::{constructor, register, deregister, owner},
    setup::{defaults, setup, State},
};

use fuels::{
    prelude::*,
    types::{Address, ContractId, Identity},
};

mod success {
    use super::*;

    #[ignore]
    #[tokio::test]
    async fn deregisters_contract() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2) = setup().await;
        let (owner_identity, _other_identity) = defaults(id, owner_wallet.clone(), other_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        let contract_id = ContractId::from(*id);
        let owner_address = Identity::Address(Address::from(owner_wallet.clone().address()));

        assert_eq!(owner(&instance_1).await, State::Initialized(owner_identity));

        // First, register the contract
        register(&instance_1, contract_id, owner_address).await;

        // Now, deregister the contract using the owner's wallet
        let response = deregister(&instance_1, contract_id).await;
        let logs = response.decode_logs();

        // Check if a DeregisterEvent is present in the logs
        assert!(logs.results.iter().any(|log| log.as_ref().unwrap().contains("DeregisterEvent")));

        // Extract the contract_id from the log
        let log_content = logs.results[0].as_ref().unwrap();
        let contract_id_str = contract_id.to_string();

        // Check if the log contains the correct contract_id
        assert!(log_content.contains(&contract_id_str), "Log does not contain the correct contract_id");
    }
}

mod revert {
    use super::*;

    #[tokio::test]
    #[should_panic(expected = "NotOwner")]
    async fn fails_when_not_owner() {
        let (owner_wallet, other_wallet, id, instance_1, instance_2) = setup().await;
        let (owner_identity, other_identity) = defaults(id, owner_wallet.clone(), other_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        let contract_id = ContractId::from(*id);
        let owner_address = Identity::Address(Address::from(owner_wallet.clone().address()));

        // First, register the contract
        register(&instance_1, contract_id, owner_address).await;

        // Try to deregister the contract with the other wallet (not owner)
        deregister(&instance_2, contract_id).await;
    }
}