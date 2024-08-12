use crate::utils::{
    interface::{constructor, is_paused, pause},
    setup::{defaults, setup, default_start_date, default_end_date, default_name, default_price, default_symbol, default_metadata_keys, default_metadata_values},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn pauses() {
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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        assert!(!is_paused(&instance_1).await);

        pause(&instance_1).await;

        assert!(is_paused(&instance_1).await);
    }

    #[tokio::test]
    async fn stays_paused_when_called_twice() {
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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        assert!(!is_paused(&instance_1).await);

        pause(&instance_1).await;
        pause(&instance_1).await;

        assert!(is_paused(&instance_1).await);
    }
}

mod revert {

    use super::*;

    #[tokio::test]
    #[should_panic(expected = "NotOwner")]
    async fn when_not_owner() {
        let (owner_wallet, other_wallet, id, instance_1, instance_2, _fee_id, _fee_instance_1) = setup().await;
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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        pause(&instance_2).await;
    }

    #[tokio::test]
    #[should_panic(expected = "NotOwner")]
    async fn when_not_initialized() {
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

        pause(&instance_1).await;
    }
}
