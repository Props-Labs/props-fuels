use crate::utils::{
    interface::{burn, constructor, mint, pause, total_assets, total_supply, set_fee, fee, fee_constructor, set_price},
    setup::{defaults, get_wallet_balance, setup, deploy_edition_with_builder_fee, default_name, default_metadata_keys, default_metadata_values, default_symbol, default_price},
};
use fuels::{
    types::{Bits256,AssetId,Identity},
};

mod success {

    use super::*;

    #[tokio::test]
    async fn mints_assets() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, _fee_instance_1) = setup().await;
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

        let response = mint(&instance_1, other_identity, sub_id_1, 1, 0, fee_id, None).await;

        let logs = response.decode_logs();
        println!("{:?}", logs);

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_multiple_assets() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, _fee_instance_1) = setup().await;
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
        mint(&instance_1, other_identity, sub_id_1, 1, 0, fee_id, None).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_2).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_supply(&instance_1, asset_id_2).await, None);
        assert_eq!(total_assets(&instance_1).await, 1);

        mint(&instance_1, other_identity, sub_id_2, 1, 0, fee_id, None).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_2).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_supply(&instance_1, asset_id_2).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 2);

        mint(&instance_1, other_identity, sub_id_3, 1, 0, fee_id, None).await;

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

        let response = mint(&instance_1, other_identity, sub_id_1, 1, 1_000, fee_id, None).await;
        let logs = response.decode_logs();
        println!("{:?}", logs);

        // Check that mint has transferred the coins
        let contract_balances = instance_1.get_balances().await.unwrap();
        let base_asset_balance = contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(base_asset_balance, 0);

        // Check that mint has transferred the fee to splitter
        let fee_contract_balances = fee_instance_1.get_balances().await.unwrap();
        let fee_base_asset_balance = fee_contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(fee_base_asset_balance, fee_amount);

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_assets_with_price() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, fee_instance_1) = setup().await;
        let owner_wallet_clone = owner_wallet.clone();
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

        let initial_owner_wallet_balance = get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await;

        set_price(&instance_1, 1_000).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 1_000, fee_id, None).await;

        // Check that mint has the coins
        let contract_balances = instance_1.get_balances().await.unwrap();
        let base_asset_balance = contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(base_asset_balance, 0);

        assert_eq!(get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await, initial_owner_wallet_balance);

        // Check that mint has NOT transferred the fee to splitter
        let fee_contract_balances = fee_instance_1.get_balances().await.unwrap();
        let fee_base_asset_balance = fee_contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(fee_base_asset_balance, 0);

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_assets_with_fees_and_price() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, fee_instance_1) = setup().await;
        let owner_wallet_clone = owner_wallet.clone();
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

        let initial_owner_wallet_balance = get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await;

        assert_eq!(fee(&fee_instance_1).await, Some(0));

        fee_constructor(&fee_instance_1, owner_identity).await;

        let fee_amount = 1_000;
        set_fee(&fee_instance_1, fee_amount).await;
        assert_eq!(fee(&fee_instance_1).await, Some(fee_amount));

        set_price(&instance_1, 1_000).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 2_000, fee_id, None).await;

        // Check that mint has transferred the coins
        let contract_balances = instance_1.get_balances().await.unwrap();
        let base_asset_balance = contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(base_asset_balance, 0);

        assert_eq!(get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await, initial_owner_wallet_balance - fee_amount);

        // Check that mint has transferred the fee to splitter
        let fee_contract_balances = fee_instance_1.get_balances().await.unwrap();
        let fee_base_asset_balance = fee_contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(fee_base_asset_balance, fee_amount);

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_assets_with_builder_fee() {
        let (owner_wallet, other_wallet, another_wallet, id, instance_1, _instance_2, fee_id, _fee_instance_1) = deploy_edition_with_builder_fee(Some(0)).await;
        let owner_wallet_clone = owner_wallet.clone();
        let another_wallet_clone = another_wallet.clone();
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

        let initial_owner_wallet_balance = get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await;
        let initial_another_wallet_balance = get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await;

        println!("other_wallet_clone address hash:");
        println!("{:?}", another_wallet_clone.address().hash());

        println!("initial_owner_wallet_balance: {:?}", initial_owner_wallet_balance);
        println!("initial_another_wallet_balance: {:?}", initial_another_wallet_balance);

        set_price(&instance_1, 1_000).await;

        let response = mint(&instance_1, other_identity, sub_id_1, 1, 2_000, fee_id, None).await;
        let logs = response.decode_logs();
        println!("{:?}", logs);

        // Check that mint has transferred the coins
        let contract_balances = instance_1.get_balances().await.unwrap();
        let base_asset_balance = contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(base_asset_balance, 0);

        assert_eq!(get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await, initial_another_wallet_balance+1_000);

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_assets_with_builder_fee_revenue_share() {
        let (owner_wallet, other_wallet, another_wallet, id, instance_1, instance_2, fee_id, _fee_instance_1) = deploy_edition_with_builder_fee(Some(1)).await;
        let owner_wallet_clone = owner_wallet.clone();
        let another_wallet_clone = another_wallet.clone();
        let other_wallet_clone = other_wallet.clone();
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

        let initial_owner_wallet_balance = get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await;
        let initial_other_wallet_balance = get_wallet_balance(&other_wallet_clone, &AssetId::zeroed()).await;
        let initial_another_wallet_balance = get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await;

        println!("other_wallet_clone address hash:");
        println!("{:?}", another_wallet_clone.address().hash());

        println!("initial_owner_wallet_balance: {:?}", initial_owner_wallet_balance);
        println!("initial_another_wallet_balance: {:?}", initial_another_wallet_balance);
        println!("initial_other_wallet_balance: {:?}", initial_other_wallet_balance);

        set_price(&instance_1, 1_000).await;

        let response = mint(&instance_2, other_identity, sub_id_1, 1, 1_000, fee_id, None).await;
        let logs = response.decode_logs();
        println!("{:?}", logs);

        // Check that mint has transferred the coins
        let contract_balances = instance_1.get_balances().await.unwrap();
        let base_asset_balance = contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(base_asset_balance, 0);

        println!("owner wallet balance: {:?}", get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await);
        println!("another wallet balance: {:?}", get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await);
        println!("other wallet balance: {:?}", get_wallet_balance(&other_wallet_clone, &AssetId::zeroed()).await);

        assert_eq!(get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await, initial_another_wallet_balance + 500);
        assert_eq!(get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await, initial_owner_wallet_balance + 500);
        assert_eq!(get_wallet_balance(&other_wallet_clone, &AssetId::zeroed()).await, initial_other_wallet_balance - 1_000);

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_assets_with_affiliate_fee() {
        let (owner_wallet, other_wallet, another_wallet, id, instance_1, instance_2, fee_id, _fee_instance_1) = deploy_edition_with_builder_fee(Some(2)).await;
        let owner_wallet_clone = owner_wallet.clone();
        let another_wallet_clone = another_wallet.clone();
        let other_wallet_clone = other_wallet.clone();
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

        let initial_owner_wallet_balance = get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await;
        let initial_other_wallet_balance = get_wallet_balance(&other_wallet_clone, &AssetId::zeroed()).await;
        let initial_another_wallet_balance = get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await;

        println!("other_wallet_clone address hash:");
        println!("{:?}", another_wallet_clone.address().hash());

        println!("initial_owner_wallet_balance: {:?}", initial_owner_wallet_balance);
        println!("initial_another_wallet_balance: {:?}", initial_another_wallet_balance);
        println!("initial_other_wallet_balance: {:?}", initial_other_wallet_balance);

        set_price(&instance_1, 1_000).await;

        let response = mint(&instance_2, other_identity, sub_id_1, 1, 1_000, fee_id, Some(Identity::Address(another_wallet.address().into()))).await;
        let logs = response.decode_logs();
        println!("{:?}", logs);

        // Check that mint has transferred the coins
        let contract_balances = instance_1.get_balances().await.unwrap();
        let base_asset_balance = contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(base_asset_balance, 0);

        println!("owner wallet balance: {:?}", get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await);
        println!("another wallet balance: {:?}", get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await);
        println!("other wallet balance: {:?}", get_wallet_balance(&other_wallet_clone, &AssetId::zeroed()).await);

        assert_eq!(get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await, initial_another_wallet_balance + 100);
        assert_eq!(get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await, initial_owner_wallet_balance + 900);
        assert_eq!(get_wallet_balance(&other_wallet_clone, &AssetId::zeroed()).await, initial_other_wallet_balance - 1_000);

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
        let (owner_wallet, other_wallet, id, instance_1, instance_2, fee_id, _fee_instance_1) = setup().await;
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

        mint(&instance_2, other_identity, sub_id_1, 1, 0, fee_id, None).await;
    }

    #[tokio::test]
    #[should_panic(expected = "MaxNFTsMinted")]
    async fn when_max_supply_reached() {
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
        ) = defaults(id, owner_wallet, other_wallet);

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 0, fee_id, None).await;
        mint(&instance_1, other_identity, sub_id_2, 1, 0, fee_id, None).await;
        mint(&instance_1, other_identity, sub_id_3, 1, 0, fee_id, None).await;
        mint(&instance_1, other_identity, Bits256([4u8; 32]), 1, 0, fee_id, None).await;
    }

    #[tokio::test]
    #[should_panic(expected = "MaxNFTsMinted")]
    async fn when_minting_max_supply_after_burn() {
        let (owner_wallet, other_wallet, id, instance_1, instance_2, fee_id, _fee_instance_1) = setup().await;
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
        mint(&instance_1, other_identity, sub_id_1, 1, 0, fee_id, None).await;
        mint(&instance_1, other_identity, sub_id_2, 1, 0, fee_id, None).await;
        mint(&instance_1, other_identity, sub_id_3, 1, 0, fee_id, None).await;

        burn(&instance_2, asset_id_1, sub_id_1, 1).await;

        mint(&instance_1, other_identity, Bits256([4u8; 32]), 1, 0, fee_id, None).await;
    }

    #[tokio::test]
    #[should_panic(expected = "NotEnoughTokens")]
    async fn when_underpriced() {
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
        ) = defaults(id, owner_wallet, other_wallet);

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;
        set_price(&instance_1, 1_000).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 500, fee_id, None).await;
    }

    #[tokio::test]
    #[should_panic(expected = "NotEnoughTokens")]
    async fn when_underpriced_with_fee() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, fee_instance_1) = setup().await;
        let (
            asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            sub_id_2,
            _sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price()).await;
        set_price(&instance_1, 1_000).await;

        fee_constructor(&fee_instance_1, owner_identity).await;
        let fee_amount = 1_000;
        set_fee(&fee_instance_1, fee_amount).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 1_000, fee_id, None).await;
        mint(&instance_1, other_identity, sub_id_2, 1, 1_500, fee_id, None).await;

        // Ensure the user has no tokens of asset_id_1 after the reverted mint
        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
    }
}