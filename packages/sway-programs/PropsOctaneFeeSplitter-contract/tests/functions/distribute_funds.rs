use crate::utils::{
    interface::{constructor, set_shares, get_share, receive_funds, distribute_funds},
    setup::{defaults, setup},
};

use fuels::{
    prelude::*,
    types::{AssetId},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn should_distribute_funds() {
        let (owner_wallet, other_wallet, another_wallet, id, instance_1, instance_2) = setup().await;
        let (
            owner_identity,
            other_identity,
            _another_identity,
        ) = defaults(id, owner_wallet.clone(), other_wallet.clone(), another_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        // Set shares for owner_identity and other_identity
        set_shares(&instance_1, vec![owner_identity.clone(), other_identity.clone()], vec![40, 60]).await;

        // Verify that shares are set correctly via get_share on each wallet instance
        let owner_share = get_share(&instance_1).await;
        let other_share = get_share(&instance_2).await;

        assert_eq!(owner_share, Some(40));
        assert_eq!(other_share, Some(60));

        // Amount to be sent to the contract
        let amount = 1_000;

        // Call receive_funds with the specified amount
        receive_funds(&instance_1, amount).await;

        let initial_owner_wallet_balance = owner_wallet.get_asset_balance(&AssetId::zeroed()).await.unwrap();
        let initial_other_wallet_balance = other_wallet.get_asset_balance(&AssetId::zeroed()).await.unwrap();
        // let initial_another_wallet_balance = another_wallet.get_asset_balance(&AssetId::zeroed()).await.unwrap();

        // Verify that the contract now has the specified amount of base_asset
        let contract_balances = instance_1.get_balances().await.unwrap();
        let base_asset_balance = contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(base_asset_balance, amount);

        // Call distribute_funds with the same amount
        distribute_funds(&instance_1, 1_000, 2).await;

        // Verify that the correct amount of asset has been received by the wallets
        let owner_balance = owner_wallet.get_asset_balance(&AssetId::zeroed()).await.unwrap();
        let other_balance = other_wallet.get_asset_balance(&AssetId::zeroed()).await.unwrap();

        // Calculate expected balances
        let total_shares = 40 + 60;
        let owner_expected_balance = initial_owner_wallet_balance + (amount * 40) / total_shares;
        let other_expected_balance = initial_other_wallet_balance + (amount * 60) / total_shares;

        assert_eq!(owner_balance, owner_expected_balance);
        assert_eq!(other_balance, other_expected_balance);
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
