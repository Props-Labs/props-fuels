use crate::utils::{
    interface::{constructor, start_date, set_dates},
    setup::{defaults, setup, default_start_date, default_end_date, default_name, default_price, default_symbol, default_metadata_keys, default_metadata_values, Metadata, State},
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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(start_date(&instance_1).await,
            Some(default_start_date())
        );
    }

    #[tokio::test]
    async fn updates_start_date() {
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

        let new_start_date = default_start_date() + 86400; // Add one day (86400 seconds)
        let new_end_date = default_end_date();

        set_dates(&instance_1, new_start_date, new_end_date).await;

        assert_eq!(start_date(&instance_1).await, Some(new_start_date));
    }

}