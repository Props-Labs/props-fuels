import { describe, it, expect, beforeEach } from "vitest";
import { Account, AssetId, Provider } from "fuels";
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
    const edition: Edition = await manager.create(
      "Edition 1",
      "ED1",
      {
        name: "Edition 1",
        description: "First edition",
        image: "image_url",
      },
      {
        maxSupply: 100,
        account: wallets[0],
      }
    );
    expect(edition.id).toBeDefined();
  });

  it("should set metadata correctly for the created edition", async () => {
    const edition: Edition = await manager.create(
      "Edition 1",
      "ED1",
      {
        name: "Edition 1",
        description: "First edition",
        image: "image_url",
      },
      {
        maxSupply: 100,
        account: wallets[0],
      }
    );

    if (!edition.contract) {
      throw new Error("Edition contract not found");
    }

    // Since all tokens are the same, 0x address assetId can be passed.
    const assetId =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    const { transactionId, waitForResult } = await edition.contract.functions
      .metadata({ bits: assetId }, "name")
      .call();
    const { value } = await waitForResult();
    expect(value as MetadataOutput).toBeDefined();
    expect((value as MetadataOutput).String).toEqual("Edition 1");
  });

    it("should list all editions", async () => {
      const edition: Edition = await manager.create(
        "Edition 1",
        "ED1",
        {
          name: "Edition 1",
          description: "First edition",
          image: "image_url",
        },
        {
          maxSupply: 100,
          account: wallets[0],
        }
      );
      console.log()
      const editions = await manager.list(wallets[0].address.toB256(), {
        id: "local",
        name: "Test",
        url: provider.url,
        graphqlUrl: provider.url,
      } as any);
      expect(editions).toBeInstanceOf(Array);
      expect(editions.length).toBe(1);
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
