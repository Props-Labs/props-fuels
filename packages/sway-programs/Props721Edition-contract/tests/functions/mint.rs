use crate::utils::{
    interface::{burn, constructor, mint, pause, total_assets, total_supply, set_fee, fee, fee_constructor, set_price, set_merkle_root},
    setup::{defaults, get_wallet_balance, setup, deploy_edition_with_builder_fee, default_name, default_metadata_keys, default_metadata_values, default_symbol, default_price, default_end_date, default_start_date},
};
use fuels::{
    prelude::*,
    types::{Bits256,AssetId,Identity},
};

use fuel_merkle::binary::in_memory::MerkleTree;
use sha2::{Digest, Sha256};
use tai64::Tai64;

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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        mint(&instance_1, other_identity, sub_id_1, 1, 0, fee_id, None, None, None, None, None).await;

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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;
        mint(&instance_1, other_identity, sub_id_1, 1, 0, fee_id, None, None, None, None, None).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_2).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_supply(&instance_1, asset_id_2).await, None);
        assert_eq!(total_assets(&instance_1).await, 1);

        mint(&instance_1, other_identity, sub_id_2, 1, 0, fee_id, None, None, None, None, None).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_2).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_supply(&instance_1, asset_id_2).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 2);

        mint(&instance_1, other_identity, sub_id_3, 1, 0, fee_id, None, None, None, None, None).await;

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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        assert_eq!(fee(&fee_instance_1).await, Some(0));

        fee_constructor(&fee_instance_1, owner_identity).await;

        let fee_amount = 1_000;
        set_fee(&fee_instance_1, fee_amount).await;
        assert_eq!(fee(&fee_instance_1).await, Some(fee_amount));

        let response = mint(&instance_1, other_identity, sub_id_1, 1, 1_000, fee_id, None, None, None, None, None).await;
        let logs = response.decode_logs();

        println!("logs: {:?}", logs);

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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        let initial_owner_wallet_balance = get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await;

        set_price(&instance_1, 1_000).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 1_000, fee_id, None, None, None, None, None).await;

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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

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

        mint(&instance_1, other_identity, sub_id_1, 1, 2_000, fee_id, None, None, None, None, None).await;

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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        let initial_another_wallet_balance = get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await;

        set_price(&instance_1, 1_000).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 2_000, fee_id, None, None, None, None, None).await;

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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        let initial_owner_wallet_balance = get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await;
        let initial_other_wallet_balance = get_wallet_balance(&other_wallet_clone, &AssetId::zeroed()).await;
        let initial_another_wallet_balance = get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await;

        set_price(&instance_1, 1_000).await;

        mint(&instance_2, other_identity, sub_id_1, 1, 1_000, fee_id, None, None, None, None, None).await;

        // Check that mint has transferred the coins
        let contract_balances = instance_1.get_balances().await.unwrap();
        let base_asset_balance = contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(base_asset_balance, 0);

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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 0);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, None);
        assert_eq!(total_assets(&instance_1).await, 0);

        let initial_owner_wallet_balance = get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await;
        let initial_other_wallet_balance = get_wallet_balance(&other_wallet_clone, &AssetId::zeroed()).await;
        let initial_another_wallet_balance = get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await;

        set_price(&instance_1, 1_000).await;

        mint(&instance_2, other_identity, sub_id_1, 1, 1_000, fee_id, Some(Identity::Address(another_wallet.address().into())), None, None, None, None).await;

        // Check that mint has transferred the coins
        let contract_balances = instance_1.get_balances().await.unwrap();
        let base_asset_balance = contract_balances.get(&AssetId::zeroed()).copied().unwrap_or(0);
        assert_eq!(base_asset_balance, 0);

        assert_eq!(get_wallet_balance(&another_wallet_clone, &AssetId::zeroed()).await, initial_another_wallet_balance + 100);
        assert_eq!(get_wallet_balance(&owner_wallet_clone, &AssetId::zeroed()).await, initial_owner_wallet_balance + 900);
        assert_eq!(get_wallet_balance(&other_wallet_clone, &AssetId::zeroed()).await, initial_other_wallet_balance - 1_000);

        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_with_allowlist() {
        let (owner_wallet, other_wallet, id, instance_1, instance_2, fee_id, _fee_instance_1) = setup().await;
        let (
            asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet.clone(), other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        // Create a new Merkle Tree and define leaves
        let mut tree = MerkleTree::new();
        // For owner_wallet
        let owner_address_bytes: &Bech32Address = owner_wallet.address();
        let mut owner_recipient_bytes = owner_address_bytes.hash().to_vec();
        owner_recipient_bytes.reverse(); // To match the reverse in Sway
        let amount_bytes = 3u64.to_le_bytes();
        owner_recipient_bytes.extend_from_slice(&amount_bytes);

        // For other_wallet
        let other_address_bytes: &Bech32Address = other_wallet.address();
        let mut other_recipient_bytes = other_address_bytes.hash().to_vec();
        other_recipient_bytes.reverse(); // To match the reverse in Sway
        let amount_bytes = 3u64.to_le_bytes();
        other_recipient_bytes.extend_from_slice(&amount_bytes);
        let leaves = [owner_recipient_bytes, other_recipient_bytes].to_vec();
        
        // Hash the leaves and then push to the merkle tree
        for datum in leaves.iter() {
            let mut hasher = Sha256::new();
            hasher.update(&datum);
            let hash = hasher.finalize();
            tree.push(&hash);
        }

        // Define the key or index of the leaf you want to prove and the number of leaves
        let key: u64 = 0;

        let num_leaves = 2;
        
        // Get the merkle root and proof set
        let (merkle_root, proof_set) = tree.prove(key).unwrap();
        
        // Convert the proof set from Vec<Bytes32> to Vec<Bits256>
        let mut bits256_proof: Vec<Bits256> = Vec::new();
        for itterator in proof_set {
            bits256_proof.push(Bits256(itterator.clone()));
        }

        // Set the merkle root in the contract
        set_merkle_root(&instance_1, Bits256(merkle_root.clone())).await;

        // Call mint function with the proof
        mint(&instance_2, owner_identity, sub_id_1, 1, 0, fee_id, None, Some(bits256_proof), Some(key), Some(num_leaves), Some(3)).await;

        // Assert that the mint was successful
        assert_eq!(get_wallet_balance(&owner_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 1);
    }

    #[tokio::test]
    async fn mints_up_to_max_amount() {
        let (owner_wallet, other_wallet, id, instance_1, instance_2, fee_id, _fee_instance_1) = setup().await;
        let (
            asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet.clone(), other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        // Create a new Merkle Tree and define leaves
        let mut tree = MerkleTree::new();
        // For owner_wallet
        let owner_address_bytes: &Bech32Address = owner_wallet.address();
        let mut owner_recipient_bytes = owner_address_bytes.hash().to_vec();
        owner_recipient_bytes.reverse(); // To match the reverse in Sway
        let amount_bytes = 3u64.to_le_bytes();
        owner_recipient_bytes.extend_from_slice(&amount_bytes);

        // For other_wallet
        let other_address_bytes: &Bech32Address = other_wallet.address();
        let mut other_recipient_bytes = other_address_bytes.hash().to_vec();
        other_recipient_bytes.reverse(); // To match the reverse in Sway
        let amount_bytes = 3u64.to_le_bytes();
        other_recipient_bytes.extend_from_slice(&amount_bytes);
        let leaves = [owner_recipient_bytes, other_recipient_bytes].to_vec();
        
        // Hash the leaves and then push to the merkle tree
        for datum in leaves.iter() {
            let mut hasher = Sha256::new();
            hasher.update(&datum);
            let hash = hasher.finalize();
            tree.push(&hash);
        }

        // Define the key or index of the leaf you want to prove and the number of leaves
        let key: u64 = 0;

        let num_leaves = 2;
        
        // Get the merkle root and proof set
        let (merkle_root, proof_set) = tree.prove(key).unwrap();
        
        // Convert the proof set from Vec<Bytes32> to Vec<Bits256>
        let mut bits256_proof: Vec<Bits256> = Vec::new();
        for itterator in proof_set {
            bits256_proof.push(Bits256(itterator.clone()));
        }

        // Set the merkle root in the contract
        set_merkle_root(&instance_1, Bits256(merkle_root.clone())).await;

        // Call mint function with the proof
        mint(&instance_2, owner_identity, sub_id_1, 3, 0, fee_id, None, Some(bits256_proof), Some(key), Some(num_leaves), Some(3)).await;

        // Assert that the mint was successful
        assert_eq!(get_wallet_balance(&owner_wallet, &asset_id_1).await, 1);
        assert_eq!(total_supply(&instance_1, asset_id_1).await, Some(1));
        assert_eq!(total_assets(&instance_1).await, 3);
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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        pause(&instance_1).await;

        mint(&instance_2, other_identity, sub_id_1, 1, 0, fee_id, None, None, None, None, None).await;
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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 0, fee_id, None, None, None, None, None).await;
        mint(&instance_1, other_identity, sub_id_2, 1, 0, fee_id, None, None, None, None, None).await;
        mint(&instance_1, other_identity, sub_id_3, 1, 0, fee_id, None, None, None, None, None).await;
        mint(&instance_1, other_identity, Bits256([4u8; 32]), 1, 0, fee_id, None, None, None, None, None).await;
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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;
        mint(&instance_1, other_identity, sub_id_1, 1, 0, fee_id, None, None, None, None, None).await;
        mint(&instance_1, other_identity, sub_id_2, 1, 0, fee_id, None, None, None, None, None).await;
        mint(&instance_1, other_identity, sub_id_3, 1, 0, fee_id, None, None, None, None, None).await;

        burn(&instance_2, asset_id_1, sub_id_1, 1).await;

        mint(&instance_1, other_identity, Bits256([4u8; 32]), 1, 0, fee_id, None, None, None, None, None).await;
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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;
        set_price(&instance_1, 1_000).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 500, fee_id, None, None, None, None, None).await;
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

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;
        set_price(&instance_1, 1_000).await;

        fee_constructor(&fee_instance_1, owner_identity).await;
        let fee_amount = 1_000;
        set_fee(&fee_instance_1, fee_amount).await;

        mint(&instance_1, other_identity, sub_id_1, 1, 1_000, fee_id, None, None, None, None, None).await;
        mint(&instance_1, other_identity, sub_id_2, 1, 1_500, fee_id, None, None, None, None, None).await;

        // Ensure the user has no tokens of asset_id_1 after the reverted mint
        assert_eq!(get_wallet_balance(&other_wallet, &asset_id_1).await, 1);
    }

    #[tokio::test]
    #[should_panic(expected = "OutsideMintingPeriod")]
    async fn when_minting_before_start_date() {
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
        ) = defaults(id, owner_wallet, other_wallet.clone());

        let current_time = Tai64::now().0;
        let future_start_date = current_time + 3600; // 1 hour in the future
        let future_end_date = current_time + 7200; // 2 hours in the future

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), future_start_date, future_end_date).await;

        // Attempt to mint before the start date
        mint(&instance_1, other_identity, sub_id_1, 1, default_price(), fee_id, None, None, None, None, None).await;
    }

    #[tokio::test]
    #[should_panic(expected = "OutsideMintingPeriod")]
    async fn when_minting_after_end_date() {
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
        ) = defaults(id, owner_wallet, other_wallet.clone());

        let current_time = Tai64::now().0;
        let past_start_date = current_time - 7200; // 2 hours in the past
        let past_end_date = current_time - 3600; // 1 hour in the past

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), past_start_date, past_end_date).await;

        // Attempt to mint after the end date
        mint(&instance_1, other_identity, sub_id_1, 1, default_price(), fee_id, None, None, None, None, None).await;
    }

    #[tokio::test]
    #[should_panic(expected = "ExceededMaxMintLimit")]
    async fn when_exceed_max_amount_with_merkle_tree() {
        let (owner_wallet, other_wallet, id, instance_1, instance_2, fee_id, _fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet.clone(), other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        // Create a new Merkle Tree and define leaves
        let mut tree = MerkleTree::new();
        // For owner_wallet
        let owner_address_bytes: &Bech32Address = owner_wallet.address();
        let mut owner_recipient_bytes = owner_address_bytes.hash().to_vec();
        owner_recipient_bytes.reverse(); // To match the reverse in Sway
        let amount_bytes = 2u64.to_le_bytes(); // Set amount higher than MAX_SUPPLY
        owner_recipient_bytes.extend_from_slice(&amount_bytes);

        let leaves = [owner_recipient_bytes].to_vec();
        
        // Hash the leaves and then push to the merkle tree
        for datum in leaves.iter() {
            let mut hasher = Sha256::new();
            hasher.update(&datum);
            let hash = hasher.finalize();
            tree.push(&hash);
        }

        // Define the key or index of the leaf you want to prove and the number of leaves
        let key: u64 = 0;
        let num_leaves = 1;
        
        // Get the merkle root and proof set
        let (merkle_root, proof_set) = tree.prove(key).unwrap();
        
        // Convert the proof set from Vec<Bytes32> to Vec<Bits256>
        let bits256_proof: Vec<Bits256> = proof_set.into_iter().map(Bits256).collect();

        // Set the merkle root in the contract
        set_merkle_root(&instance_1, Bits256(merkle_root)).await;

        // Try to mint more than MAX_SUPPLY
        mint(&instance_2, owner_identity, sub_id_1, 3, 0, fee_id, None, Some(bits256_proof), Some(key), Some(num_leaves), Some(2)).await;
    }

    #[tokio::test]
    #[should_panic(expected = "InvalidProof")]
    async fn reverts_when_minting_more_than_proof_allows() {
        let (owner_wallet, other_wallet, id, instance_1, instance_2, fee_id, _fee_instance_1) = setup().await;
        let (
            _asset_id_1,
            _asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            _other_identity,
        ) = defaults(id, owner_wallet.clone(), other_wallet.clone());

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_metadata_keys(), default_metadata_values(), default_price(), default_start_date(), default_end_date()).await;

        // Create a new Merkle Tree and define leaves
        let mut tree = MerkleTree::new();
        // For owner_wallet
        let owner_address_bytes: &Bech32Address = owner_wallet.address();
        let mut owner_recipient_bytes = owner_address_bytes.hash().to_vec();
        owner_recipient_bytes.reverse(); // To match the reverse in Sway
        let amount_bytes = 2u64.to_le_bytes(); // Set amount to 2 in the proof
        owner_recipient_bytes.extend_from_slice(&amount_bytes);

        let leaves = [owner_recipient_bytes].to_vec();
        
        // Hash the leaves and then push to the merkle tree
        for datum in leaves.iter() {
            let mut hasher = Sha256::new();
            hasher.update(&datum);
            let hash = hasher.finalize();
            tree.push(&hash);
        }

        // Define the key or index of the leaf you want to prove and the number of leaves
        let key: u64 = 0;
        let num_leaves = 1;
        
        // Get the merkle root and proof set
        let (merkle_root, proof_set) = tree.prove(key).unwrap();
        
        // Convert the proof set from Vec<Bytes32> to Vec<Bits256>
        let bits256_proof: Vec<Bits256> = proof_set.into_iter().map(Bits256).collect();

        // Set the merkle root in the contract
        set_merkle_root(&instance_1, Bits256(merkle_root)).await;

        // Try to mint more than the proof allows (3 instead of 2)
        mint(&instance_2, owner_identity, sub_id_1, 3, 0, fee_id, None, Some(bits256_proof), Some(key), Some(num_leaves), Some(3)).await;
    }
}
