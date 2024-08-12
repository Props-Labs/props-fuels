use crate::utils::{
    interface::{constructor, owner, base_uri, price},
    setup::{defaults, default_start_date, default_end_date,setup, deploy_edition_with_builder_fee, default_name, default_price, default_base_uri, default_symbol, State},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn initializes() {
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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_base_uri(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(owner(&instance_1).await, State::Initialized(owner_identity));
        assert_eq!(base_uri(&instance_1).await,
            Some(default_base_uri())
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
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            _sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_base_uri(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(owner(&instance_1).await, State::Initialized(owner_identity));
        assert_eq!(base_uri(&instance_1).await,
            Some(default_base_uri())
        );

        assert_eq!(
            price(&instance_1).await,
            Some(default_price())
        );
    }
}