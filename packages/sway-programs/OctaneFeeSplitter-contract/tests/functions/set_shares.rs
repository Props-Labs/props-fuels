use crate::utils::{
    interface::{constructor, set_shares, get_share},
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

        // Get and assert shares for owner
        let owner_share = get_share(&instance_1).await;
        assert_eq!(owner_share, Some(50));

        // Get and assert shares for other_wallet
        let other_share = get_share(&instance_2).await;
        assert_eq!(other_share, Some(100));
    }
}

mod revert {

    use super::*;

    #[tokio::test]
    #[should_panic(expected = "NotOwner")]
    async fn when_not_owner() {
        let (owner_wallet, other_wallet, another_wallet, id, instance_1, instance_2) = setup().await;
        let (
            owner_identity,
            other_identity,
            another_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone(), another_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        // Attempt to set shares with another_wallet which is not the owner
        set_shares(&instance_2, vec![another_identity.clone()], vec![100]).await;
    }
}
