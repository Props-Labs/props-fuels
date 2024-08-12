use crate::utils::{
    interface::{airdrop, constructor, total_assets, total_supply},
    setup::{defaults, default_start_date, default_end_date,get_wallet_balance, setup, default_name, default_symbol, default_price, default_base_uri},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn airdrops_to_one_asset() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, _fee_instance_1) = setup().await;
        let (
            asset_id_1,
            _asset_id_2,
            _asset_id_3,
            _sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_base_uri(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        airdrop(&instance_1, other_identity, 1).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
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
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_base_uri(), default_price(), default_start_date(), default_end_date()).await;

        // Attempt to mint from a non-owner wallet
        airdrop(&instance_2, other_identity, 1).await;
    }
}