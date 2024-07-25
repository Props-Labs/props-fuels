use crate::utils::{
    interface::{constructor, set_shares, get_share},
    setup::{defaults, setup, State},
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
    }
}