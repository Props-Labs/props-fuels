import { describe, it, expect, beforeEach } from "vitest";
import { Account, AssetId, BN, getMintedAssetId, Provider } from "fuels";
import { CollectionManager } from "../collection/collection-manager";
import { setup } from "../utils/setup";
import { Props721CollectionContractFactory, PropsFeeSplitterContract } from "../sway-api/contracts";
import { MetadataOutput } from "../sway-api/contracts/Props721CollectionContract";
import { Collection } from "../collection/collection";
import { MintResult } from "../common/types";

describe("CollectionManager", () => {
  let manager: CollectionManager;
  let wallets: Account[];
  let provider: Provider;
  let feeSplitterContract: PropsFeeSplitterContract;

  beforeEach(async () => {
    manager = new CollectionManager();
    const { wallet1, wallet2, wallet3, wallet4, provider: setupProvider, feeSplitterContract: setupFeeSplitterContract } = await setup();
    wallets = [wallet1, wallet2, wallet3, wallet4];
    provider = setupProvider;
    feeSplitterContract = setupFeeSplitterContract;
  });

  it("should create a new collection", async () => {
    const collection: Collection = await manager.create({
      name: "Collection 1",
      symbol: "ED1",
      baseUri: "https://example.com/metadata/",
      options: {
        maxSupply: 100,
        owner: wallets[0],
      },
    });
    expect(collection.id).toBeDefined();
  });

  it("should set metadata correctly for the created collection", async () => {
    const collection: Collection = await manager.create({
      name: "Collection 1",
      symbol: "ED1",
      baseUri: "https://example.com/metadata/",
      options: {
        maxSupply: 100,
        owner: wallets[0],
      },
    });

    if (!collection.contract) {
      throw new Error("Collection contract not found");
    }

    // Test minting functionality
    const mintAmount = 1;
    const recipientAddress = wallets[1].address.toB256();
    const mintResult = await collection.mint(recipientAddress, mintAmount);

    expect(mintResult).toBeDefined();
    expect((mintResult as MintResult).id).toBeDefined();
    expect((mintResult as MintResult).transactionResult).toBeDefined();

    // Verify the minted token
    const subId = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const assetId = getMintedAssetId(collection.contract.id.toB256(), subId);
    const balance: BN = await wallets[1].getBalance(assetId);
    expect(balance.toNumber()).toBe(mintAmount);

    // Since all tokens are the same, 0x address assetId can be passed.
    const { value } = await collection.contract.functions
      .metadata({ bits: assetId }, "uri")
      .get()
    expect(value as MetadataOutput).toBeDefined();
    expect((value as MetadataOutput).String).toEqual(
      "https://example.com/metadata/1"
    );
  });

    it("should list all collections", async () => {
      const collection: Collection = await manager.create({
        name:"Collection 1",
        symbol: "ED1",
        baseUri: "https://example.com/metadata/",
        options: {
          maxSupply: 100,
          owner: wallets[0],
        }
      });
      const collections = await manager.list(wallets[0], {
        id: "local",
        name: "Test",
        url: provider.url,
        graphqlUrl: provider.url,
      } as any);
      expect(collections).toBeInstanceOf(Array);
      expect(collections.length).toBe(1);
    });

    it("should set builder fee, builder fee address, builder revenue share address, and builder revenue share percentage", async () => {
      const builderFeeAddress = wallets[1].address.toB256();
      const builderRevenueShareAddress = wallets[2].address.toB256();
      const builderFee = 5;
      const builderRevenueSharePercentage = 10; // 10%

      const collection: Collection = await manager.create({
        name: "Collection 2",
        symbol: "ED2",
        baseUri: "https://example.com/metadata/",
        price: 1000,
        options: {
          maxSupply: 100,
          owner: wallets[0],
          builderFeeAddress,
          builderFee,
          builderRevenueShareAddress,
          builderRevenueSharePercentage,
        }
      });

      if(!collection.contract) {
        throw new Error("Collection contract not found");
      }

      const { value: totalPrice } = await collection.contract.functions.total_price().get();
      expect(totalPrice?.toString()).toBe((1000+5).toString());

      if (!collection.contract) {
        throw new Error("Collection contract not found");
      }

      // Store balances before minting the token
      const balancesBeforeMint: BN[] = [];
      for (let i = 0; i < wallets.length; i++) {
        const balance: BN = await wallets[i].getBalance(wallets[i].provider.getBaseAssetId());
        balancesBeforeMint.push(balance);
      }

      await collection.connect(wallets[3]);

      // Mint a token to trigger fee and revenue share distribution
      await collection.mint(wallets[3].address.toB256(), 1);

      const balanceAfterMint: BN = await wallets[3].getBalance(wallets[3].provider.getBaseAssetId());
      const expectedBalanceAfterMint = balancesBeforeMint[3].sub(new BN(1000));

      // Check balances to ensure fees and revenue shares are distributed
      const assetId = wallets[0].provider.getBaseAssetId();

      const builderFeeBalance: BN = await wallets[1].getBalance(assetId);
      const builderRevenueShareBalance: BN = await wallets[2].getBalance(assetId);

      // Assuming the minting process distributes the fees and shares correctly
      expect(builderFeeBalance.toString()).toBe((balancesBeforeMint[1].add(builderFee)).toString()); // 5% of 1 token
      expect(builderRevenueShareBalance.toString()).toEqual(
        (balancesBeforeMint[2].add((builderRevenueSharePercentage/100)*1000)).toString()
      ); // 10% of 1 token
    });

  //   it("should get a specific collection", async () => {
  //     const collectionId = "some-collection-id";
  //     const collectionData = await manager.get(collectionId);
  //     expect(collectionData).toBeDefined();
  //   });

  //   it("should mint a new token in a specific collection", async () => {
  //     const collectionId = "some-collection-id";
  //     const recipient = "some-recipient-address";
  //     const tokenId = await manager.mint(collectionId, recipient);
  //     expect(tokenId).toBe("token-id");
  //   });

  //   it("should update metadata of a specific collection", async () => {
  //     const collectionId = "some-collection-id";
  //     const metadata = {
  //       name: "Updated Collection",
  //       description: "Updated description",
  //       image: "updated_image_url",
  //     };
  //     await manager.updateMetadata(collectionId, metadata);
  //     // Verify that the function completes without errors
  //   });
  // });

});
