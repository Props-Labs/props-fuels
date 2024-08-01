use crate::utils::{
    interface::{constructor, set_shares, total_shares},
    setup::{defaults, setup},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn two_shares() {
        let (owner_wallet, other_wallet, another_wallet, id, instance_1, instance_2) = setup().await;
        let (
            owner_identity,
            other_identity,
            _another_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone(), another_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        // Set shares for owner and other_wallet
        set_shares(&instance_1, vec![owner_identity.clone(), other_identity.clone()], vec![50, 100]).await;

        // Get and assert total shares
        assert_eq!(total_shares(&instance_1).await, Some(150));
    }

    #[tokio::test]
    async fn one_share() {
        let (owner_wallet, other_wallet, another_wallet, id, instance_1, instance_2) = setup().await;
        let (
            owner_identity,
            _other_identity,
            _another_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone(), another_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        // Set share for owner
        set_shares(&instance_1, vec![owner_identity.clone()], vec![75]).await;

        // Get and assert total shares
        assert_eq!(total_shares(&instance_1).await, Some(75));
    }

    #[tokio::test]
    async fn overwrite_shares() {
        let (owner_wallet, other_wallet, another_wallet, id, instance_1, instance_2) = setup().await;
        let (
            owner_identity,
            other_identity,
            another_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone(), another_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        // Set initial shares for owner and other_wallet
        set_shares(&instance_1, vec![owner_identity.clone(), other_identity.clone()], vec![50, 100]).await;

        // Get and assert total shares
        assert_eq!(total_shares(&instance_1).await, Some(150));

        // Overwrite shares for owner and another_wallet
        set_shares(&instance_1, vec![owner_identity.clone(), another_identity.clone()], vec![30, 70]).await;

        // Get and assert total shares after overwrite
        assert_eq!(total_shares(&instance_1).await, Some(100));
    }
}