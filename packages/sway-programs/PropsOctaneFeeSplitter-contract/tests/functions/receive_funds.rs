use crate::utils::{
    interface::{constructor, receive_funds},
    setup::{defaults, setup},
};

use fuels::{
    types::{AssetId},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn receive_funds_and_verify_balance() {
        let (owner_wallet, other_wallet, another_wallet, id, instance_1, _instance_2) = setup().await;
        let (
            owner_identity,
            _other_identity,
            _another_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone(), another_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        // Amount to be sent to the contract
        let amount = 1_000;

        // Call receive_funds with the specified amount
        receive_funds(&instance_1, amount).await;

        // Verify that the contract now has the specified amount of base_asset
        let contract_balances = instance_1.get_balances().await.unwrap();
        let base_asset_balance = contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        println!("base_asset_balance: {:?}", base_asset_balance);
        assert_eq!(base_asset_balance, amount);
    }
}

// mod revert {

//     use super::*;

//     #[tokio::test]
//     #[should_panic(expected = "NotOwner")]
//     async fn when_not_owner() {
//         let (owner_wallet, other_wallet, another_wallet, id, instance_1, instance_2) = setup().await;
//         let (
//             owner_identity,
//             other_identity,
//             another_identity,
//         ) = defaults(id, owner_wallet, other_wallet.clone(), another_wallet.clone());

//         constructor(&instance_1, owner_identity).await;

//         // Attempt to set shares with another_wallet which is not the owner
//         set_shares(&instance_2, vec![another_identity.clone()], vec![100]).await;
//     }
// }
