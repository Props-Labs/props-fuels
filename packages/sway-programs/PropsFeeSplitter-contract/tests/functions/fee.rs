use crate::utils::{
    interface::{constructor, set_fee, fee},
    setup::{defaults, setup},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn is_default_fee() {
        let (owner_wallet, other_wallet, another_wallet, id, instance_1, _instance_2) = setup().await;
        let (
            owner_identity,
            _other_identity,
            _another_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone(), another_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        assert_eq!(fee(&instance_1).await, Some(0));
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
            _other_identity,
            _another_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone(), another_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        // Attempt to set fee with another identity (not the owner)
        set_fee(&instance_2, 100).await;
    }
}
