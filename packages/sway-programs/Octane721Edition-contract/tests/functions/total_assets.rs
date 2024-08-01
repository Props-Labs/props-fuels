use crate::utils::{
    interface::{constructor, mint, total_assets},
    setup::{defaults, setup, default_name, default_price, default_symbol, default_metadata_keys, default_metadata_values},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn one_asset() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, _fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        assert_eq!(total_assets(&instance_1).await, 0);

        mint(&instance_1, other_identity, sub_id_1, 1, 0, fee_id, None).await;
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn multiple_assets() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, _fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            sub_id_2,
            sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        assert_eq!(total_assets(&instance_1).await, 0);

        mint(&instance_1, other_identity, sub_id_1, 1, 0, fee_id, None).await;
        assert_eq!(total_assets(&instance_1).await, 1);

        mint(&instance_1, other_identity, sub_id_2, 1, 0, fee_id, None).await;
        assert_eq!(total_assets(&instance_1).await, 2);

        mint(&instance_1, other_identity, sub_id_3, 1, 0, fee_id, None).await;
        assert_eq!(total_assets(&instance_1).await, 3);
    }
}
