use crate::utils::{
    interface::{burn, constructor, mint, pause, total_assets, total_supply, set_fee, fee, fee_constructor, set_price},
    setup::{defaults, get_wallet_balance, setup, default_name, default_metadata_keys, default_metadata_values, default_symbol, default_price},
};
use fuels::types::Bits256;

mod success {

    use super::*;

    #[tokio::test]
    async fn mints_assets() {
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

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        mint(&instance_1, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_multiple_assets() {
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
        mint(&instance_1, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_2).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_supply(&instance_1, asset_id_2).await, None);
        assert_eq!(total_assets(&instance_1).await, 1);

        mint(&instance_1, other_identity, sub_id_2, 1, 0, &fee_instance_1).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_2).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_supply(&instance_1, asset_id_2).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 2);

        mint(&instance_1, other_identity, sub_id_3, 1, 0, &fee_instance_1).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_2).await, 1);
        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_3).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_supply(&instance_1, asset_id_2).await, Some(1));
        assert_eq!(total_supply(&instance_1, asset_id_3).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 3);
    }

    #[tokio::test]
    async fn mints_assets_with_fees() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, fee_instance_1) = setup().await;
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

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        assert_eq!(fee(&fee_instance_1).await, Some(0));

        fee_constructor(&fee_instance_1, owner_identity).await;

        let fee_amount = 1_000;
        set_fee(&fee_instance_1, fee_amount).await;
        assert_eq!(fee(&fee_instance_1).await, Some(fee_amount));

        mint(&instance_1, other_identity, sub_id_1, 1, 1_000, &fee_instance_1).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_assets_with_price() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, fee_instance_1) = setup().await;
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

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        set_price(&instance_1, 1_000).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 1_000, &fee_instance_1).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_assets_with_fees_and_price() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, fee_instance_1) = setup().await;
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

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        assert_eq!(fee(&fee_instance_1).await, Some(0));

        fee_constructor(&fee_instance_1, owner_identity).await;

        let fee_amount = 1_000;
        set_fee(&fee_instance_1, fee_amount).await;
        assert_eq!(fee(&fee_instance_1).await, Some(fee_amount));

        set_price(&instance_1, 1_000).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 2_000, &fee_instance_1).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }
}

mod revert {

    use super::*;

    #[tokio::test]
    #[should_panic(expected = "Paused")]
    async fn when_paused() {
        let (owner_wallet, other_wallet, id, instance_1, instance_2, _fee_id, fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet);

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        pause(&instance_1).await;

        mint(&instance_2, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;
    }

    #[tokio::test]
    #[should_panic(expected = "CannotMintMoreThanOneNFTWithSubId")]
    async fn when_minting_more_than_one() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            _owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet);

        mint(&instance_1, other_identity, sub_id_1, 2, 0, &fee_instance_1).await;
    }

    #[tokio::test]
    #[should_panic(expected = "NFTAlreadyMinted")]
    async fn when_nft_already_minted() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet);

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;
        mint(&instance_1, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;
    }

    #[tokio::test]
    #[should_panic(expected = "MaxNFTsMinted")]
    async fn when_max_supplt_reached() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            sub_id_2,
            sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet);

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;
        mint(&instance_1, other_identity, sub_id_2, 1, 0, &fee_instance_1).await;
        mint(&instance_1, other_identity, sub_id_3, 1, 0, &fee_instance_1).await;
        mint(&instance_1, other_identity, Bits256([4u8; 32]), 1, 0, &fee_instance_1).await;
    }

    #[tokio::test]
    #[should_panic(expected = "MaxNFTsMinted")]
    async fn when_minting_max_supply_after_burn() {
        let (owner_wallet, other_wallet, id, instance_1, instance_2, _fee_id, fee_instance_1) = setup().await;
        let (
            asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            sub_id_2,
            sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet);

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;
        mint(&instance_1, other_identity, sub_id_1, 1, 0, &fee_instance_1).await;
        mint(&instance_1, other_identity, sub_id_2, 1, 0, &fee_instance_1).await;
        mint(&instance_1, other_identity, sub_id_3, 1, 0, &fee_instance_1).await;

        burn(&instance_2, asset_id_1, sub_id_1, 1).await;

        mint(&instance_1, other_identity, Bits256([4u8; 32]), 1, 0, &fee_instance_1).await;
    }

    #[tokio::test]
    #[should_panic(expected = "NotEnoughTokens")]
    async fn when_underpriced() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, _fee_id, fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet);

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;
        set_price(&instance_1, 1_000).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 500, &fee_instance_1).await;
    }

    #[tokio::test]
    #[should_panic(expected = "NotEnoughTokens")]
    async fn when_underpriced_with_fee() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            sub_id_2,
            _sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet);

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;
        set_price(&instance_1, 1_000).await;

        fee_constructor(&fee_instance_1, owner_identity).await;
        let fee_amount = 1_000;
        set_fee(&fee_instance_1, fee_amount).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 1_000, &fee_instance_1).await;
        mint(&instance_1, other_identity, sub_id_2, 1, 1_500, &fee_instance_1).await;
    }
}
