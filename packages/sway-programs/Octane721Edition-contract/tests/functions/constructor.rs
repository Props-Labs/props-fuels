use crate::utils::{
    interface::{constructor, owner, metadata, price},
    setup::{defaults, setup, deploy_edition_with_builder_fee, default_name, default_price, default_symbol, default_metadata_keys, default_metadata_values, Metadata, State},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn initializes() {
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

        let metadata1 = Metadata::String(String::from("Friendly OpenSea Creature that enjoys long swims in the ocean."));
        let key = String::from("description");

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        assert_eq!(owner(&instance_1).await, State::Initialized(owner_identity));
        assert_eq!(metadata(&instance_1, asset_id_1, key).await,
            Some(metadata1)
        );

        assert_eq!(
            price(&instance_1).await,
            Some(default_price())
        );
    }

    #[tokio::test]
    async fn initializes_fee() {
        let (owner_wallet, other_wallet, _another_wallet, id, instance_1, _instance_2, _fee_id, _fee_instance_1) = deploy_edition_with_builder_fee(Some(0)).await;
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

        let metadata1 = Metadata::String(String::from("Friendly OpenSea Creature that enjoys long swims in the ocean."));
        let key = String::from("description");

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        assert_eq!(owner(&instance_1).await, State::Initialized(owner_identity));
        assert_eq!(metadata(&instance_1, asset_id_1, key).await,
            Some(metadata1)
        );

        assert_eq!(
            price(&instance_1).await,
            Some(default_price())
        );
    }
}