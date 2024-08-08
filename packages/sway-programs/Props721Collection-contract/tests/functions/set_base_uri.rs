use crate::utils::{
    interface::{constructor, base_uri, set_base_uri},
    setup::{defaults, setup, default_name, default_price, default_base_uri, default_symbol, default_metadata_keys, default_metadata_values, Metadata},
};
use fuels::types::Bytes;

mod success {

    use super::*;

    // #[ignore]
    #[tokio::test]
    async fn sets_base_uri() {
        let (owner_wallet, other_wallet, id, instance_1, _instance_2, fee_id, _fee_instance_1) = setup().await;
        let (
            asset_id_1,
            asset_id_2,
            _asset_id_3,
            sub_id_1,
            _sub_id_2,
            _sub_id_3,
            owner_identity,
            other_identity,
        ) = defaults(id, owner_wallet, other_wallet.clone());
        let metadata1 = Metadata::String(String::from("Fuel NFT Metadata"));
        let key = String::from("key1");

        constructor(&instance_1, owner_identity, default_name(), default_symbol(), default_base_uri(), default_price()).await;

        assert_eq!(base_uri(&instance_1).await, Some(default_base_uri()));
        
        set_base_uri(&instance_1, String::from("new_base_uri")).await;
        
        assert_eq!(base_uri(&instance_1).await, Some(String::from("new_base_uri")));
    }
}
