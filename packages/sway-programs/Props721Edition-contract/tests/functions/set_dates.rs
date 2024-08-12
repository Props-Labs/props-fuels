use crate::utils::{
    interface::{constructor, start_date, end_date, set_dates},
    setup::{defaults, setup, default_start_date, default_end_date, default_name, default_price, default_symbol, default_metadata_keys, default_metadata_values},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn updates_start_and_end_dates() {
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
        let new_end_date = default_end_date() + 172800; // Add two days (172800 seconds)

        set_dates(&instance_1, new_start_date, new_end_date).await;

        assert_eq!(start_date(&instance_1).await, Some(new_start_date));
        assert_eq!(end_date(&instance_1).await, Some(new_end_date));
    }

    #[tokio::test]
    async fn updates_only_start_date() {
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

        set_dates(&instance_1, new_start_date, default_end_date()).await;

        assert_eq!(start_date(&instance_1).await, Some(new_start_date));
        assert_eq!(end_date(&instance_1).await, Some(default_end_date()));
    }

    #[tokio::test]
    async fn updates_only_end_date() {
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

        let new_end_date = default_end_date() + 172800; // Add two days (172800 seconds)

        set_dates(&instance_1, default_start_date(), new_end_date).await;

        assert_eq!(start_date(&instance_1).await, Some(default_start_date()));
        assert_eq!(end_date(&instance_1).await, Some(new_end_date));
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

        let new_start_date = default_start_date() + 86400; // Add one day (86400 seconds)
        let new_end_date = default_end_date() + 172800; // Add two days (172800 seconds)

        // This should panic because instance_2 is not the owner
        set_dates(&instance_2, new_start_date, new_end_date).await;
    }
}