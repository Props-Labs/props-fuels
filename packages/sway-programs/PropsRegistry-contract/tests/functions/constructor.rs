use crate::utils::{
    interface::{constructor, owner},
    setup::{defaults, setup, State},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn initializes() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2) = setup().await;
        let (
            owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity).await;

        assert_eq!(owner(&instance_1).await, State::Initialized(owner_identity));
    }
}