use crate::utils::{
    interface::{burn, constructor, mint, total_supply},
    setup::{defaults, setup, default_name, default_price, default_symbol, default_metadata_keys, default_metadata_values},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn one_asset() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, fee_instance_1) = setup().await;
        let (
            asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        mint(&instance_1, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
    }

    #[tokio::test]
    async fn multiple_assets() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, fee_instance_1) = setup().await;
        let (
            asset_id_1,
            asset_id_2,
            asset_id_3,
            sub_id_1,
            sub_id_2,
            sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        mint(&instance_1, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));

        assert_eq!(total_supply(&instance_1, asset_id_2).await, None);
        mint(&instance_1, other_identity, sub_id_2, 1, 0, &fee_instance_1).await;
        assert_eq!(total_supply(&instance_1, asset_id_2).await, Some(1));

        assert_eq!(total_supply(&instance_1, asset_id_3).await, None);
        mint(&instance_1, other_identity, sub_id_3, 1, 0, &fee_instance_1).await;
        assert_eq!(total_supply(&instance_1, asset_id_3).await, Some(1));
    }

    #[tokio::test]
    async fn only_increments_on_one_asset() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, fee_instance_1) = setup().await;
        let (
            asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            sub_id_2,
            sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        mint(&instance_1, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));

        mint(&instance_1, other_identity, sub_id_2, 1, 0, &fee_instance_1).await;
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));

        mint(&instance_1, other_identity, sub_id_3, 1, 0, &fee_instance_1).await;
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
    }

    #[tokio::test]
    async fn decrements_on_burn() {
        let (owner_wallet, other_wallet, id, instance_1, instance_2, _fee_id, fee_instance_1) = setup().await;
        let (
            asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;

        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        burn(&instance_2, asset_id_1, sub_id_1, 1).await;
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(0));
    }
}
