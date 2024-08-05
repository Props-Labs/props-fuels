import { describe, it, expect, beforeEach } from "vitest";
import { Account, AssetId, BN, getMintedAssetId, Provider } from "fuels";
import { EditionManager } from "./edition-manager";
import { setup } from "../utils/setup";
import { Props721EditionContractAbi__factory, PropsFeeSplitterContractAbi } from "../sway-api/contracts";
import { MetadataOutput } from "../sway-api/contracts/Props721EditionContractAbi";
import { Edition } from "./edition";

describe("EditionManager", () => {
  let manager: EditionManager;
  let wallets: Account[];
  let provider: Provider;
  let feeSplitterContract: PropsFeeSplitterContractAbi;

  beforeEach(async () => {
    manager = new EditionManager();
    const { wallet1, wallet2, wallet3, wallet4, provider: setupProvider, feeSplitterContract: setupFeeSplitterContract } = await setup();
    wallets = [wallet1, wallet2, wallet3, wallet4];
    provider = setupProvider;
    feeSplitterContract = setupFeeSplitterContract;
  });

  it("should create a new edition", async () => {
    const edition: Edition = await manager.create({
      name: "Edition 1",
      symbol: "ED1",
      metadata: {
        name: "Edition 1",
        description: "First edition",
        image: "image_url",
      },
      options: {
        maxSupply: 100,
        owner: wallets[0],
      },
    });
    expect(edition.id).toBeDefined();
  });

  it("should set metadata correctly for the created edition", async () => {
    const edition: Edition = await manager.create({
      name: "Edition 1",
      symbol: "ED1",
      metadata: {
        name: "Edition 1",
        description: "First edition",
        image: "image_url",
      },
      options: {
        maxSupply: 100,
        owner: wallets[0],
      },
    });

    if (!edition.contract) {
      throw new Error("Edition contract not found");
    }

    // Since all tokens are the same, 0x address assetId can be passed.
    const assetId =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    const { value } = await edition.contract.functions
      .metadata({ bits: assetId }, "name")
      .get()
    expect(value as MetadataOutput).toBeDefined();
    expect((value as MetadataOutput).String).toEqual("Edition 1");
  });

    it("should list all editions", async () => {
      const edition: Edition = await manager.create({
        name:"Edition 1",
        symbol: "ED1",
        metadata: {
          name: "Edition 1",
          description: "First edition",
          image: "image_url",
        },
        options: {
          maxSupply: 100,
          owner: wallets[0],
        }
      });
      const editions = await manager.list(wallets[0].address.toB256(), {
        id: "local",
        name: "Test",
        url: provider.url,
        graphqlUrl: provider.url,
      } as any);
      expect(editions).toBeInstanceOf(Array);
      expect(editions.length).toBe(1);
    });

    it("should set builder fee, builder fee address, builder revenue share address, and builder revenue share percentage", async () => {
      const builderFeeAddress = wallets[1].address.toB256();
      const builderRevenueShareAddress = wallets[2].address.toB256();
      const builderFee = 5;
      const builderRevenueSharePercentage = 10; // 10%

      const edition: Edition = await manager.create({
        name: "Edition 2",
        symbol: "ED2",
        metadata: {
          name: "Edition 2",
          description: "Second edition",
          image: "image_url_2",
        },
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

      if(!edition.contract) {
        throw new Error("Edition contract not found");
      }

      const { value: totalPrice } = await edition.contract.functions.total_price().get();
      expect(totalPrice?.toString()).toBe((1000+5).toString());

      if (!edition.contract) {
        throw new Error("Edition contract not found");
      }

      // Store balances before minting the token
      const balancesBeforeMint: BN[] = [];
      for (let i = 0; i < wallets.length; i++) {
        const balance: BN = await wallets[i].getBalance(wallets[i].provider.getBaseAssetId());
        balancesBeforeMint.push(balance);
      }

      await edition.connect(wallets[3]);

      // Mint a token to trigger fee and revenue share distribution
      await edition.mint(wallets[3].address.toB256(), 1);

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

  //   it("should get a specific edition", async () => {
  //     const editionId = "some-edition-id";
  //     const editionData = await manager.get(editionId);
  //     expect(editionData).toBeDefined();
  //   });

  //   it("should mint a new token in a specific edition", async () => {
  //     const editionId = "some-edition-id";
  //     const recipient = "some-recipient-address";
  //     const tokenId = await manager.mint(editionId, recipient);
  //     expect(tokenId).toBe("token-id");
  //   });

  //   it("should update metadata of a specific edition", async () => {
  //     const editionId = "some-edition-id";
  //     const metadata = {
  //       name: "Updated Edition",
  //       description: "Updated description",
  //       image: "updated_image_url",
  //     };
  //     await manager.updateMetadata(editionId, metadata);
  //     // Verify that the function completes without errors
  //   });
  // });

});
