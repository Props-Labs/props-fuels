use crate::utils::{
    interface::{constructor, owner},
    setup::{defaults, setup, default_name, default_price, default_base_uri, default_symbol,  State},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn gets_owner() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, _fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            _sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_base_uri(), default_price()).await;

        assert_eq!(owner(&instance_1).await, State::Initialized(owner_identity));
    }

    #[tokio::test]
    async fn gets_no_owner() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, _fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            _sub_id_1,
            _sub_id_2,
            _sub_id_3,
            _owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        assert_eq!(owner(&instance_1).await, State::Uninitialized);
    }
}
