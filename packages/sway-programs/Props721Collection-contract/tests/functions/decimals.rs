use crate::utils::{
    interface::{constructor, decimals},
    setup::{defaults, default_start_date, default_end_date,setup, default_name, default_price, default_base_uri, default_symbol},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn one_asset() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, _fee_instance_1) = setup().await;
        let (
            asset_id_1,
            _asset_id_2,
            _asset_id_3,
            _sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_base_uri(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(decimals(&instance_1, asset_id_1).await, Some(0u8));
    }

    #[tokio::test]
    async fn multiple_assets() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, _fee_instance_1) = setup().await;
        let (
            asset_id_1,
            asset_id_2,
            asset_id_3,
            _sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_base_uri(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(decimals(&instance_1, asset_id_1).await, Some(0u8));
        assert_eq!(decimals(&instance_1, asset_id_2).await, Some(0u8));
        assert_eq!(decimals(&instance_1, asset_id_3).await, Some(0u8));
    }
}
