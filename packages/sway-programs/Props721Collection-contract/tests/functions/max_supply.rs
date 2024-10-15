use crate::utils::{
    interface::{max_supply, constructor},
    setup::{defaults, default_start_date, default_end_date,setup, default_name, default_price, default_base_uri, default_symbol},
};

mod success {
    use super::*;

    #[tokio::test]
    async fn returns_max_supply() {
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

        let result = max_supply(&instance_1).await;

        assert!(result.is_some());
        assert_eq!(result.unwrap(), 3); // Assuming the max supply is 3, adjust if different
    }
}
