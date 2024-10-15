import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { Account, BN, Provider, getMintedAssetId } from "fuels";
import { Collection } from "./collection";
import { deployProps721CollectionContract, setup } from "../utils/setup";
import { Props721CollectionContract } from "../sway-api/contracts";

describe("Collection", () => {
  let collection: Collection;
  let wallets: Account[];
  let provider: Provider;
  let contract: Props721CollectionContract;
  let cleanup: () => void;

  beforeEach(async () => {
    const { wallet1, wallet2, wallet3, wallet4, provider: setupProvider, cleanup: setupCleanup } = await setup();
    wallets = [wallet1, wallet2, wallet3, wallet4];
    provider = setupProvider;
    contract = await deployProps721CollectionContract(wallet1);
    collection = new Collection("collection-id", contract, wallet1, "https://propsassets.s3.amazonaws.com/fuel/sample-collection/");
    // console.log("Collection Contract: ", collection);
    console.log("Cleanup: ", setupCleanup);
    cleanup = setupCleanup;
  });

  afterEach(async () => {
    await cleanup();
  });

  it("should create an collection instance", () => {
    // console.log("Collection: ", collection);
    expect(collection).toBeInstanceOf(Collection);
    expect(collection.id).toBe("collection-id");
    expect(collection.baseUri).toBe("https://propsassets.s3.amazonaws.com/fuel/sample-collection/");
  });

  it("should connect an account to the collection", () => {
    collection.connect(wallets[1]);
    expect(collection.account).toBe(wallets[1]);
  });

  it("should mint tokens", async () => {
    expect(collection.contract).toBeDefined();
    await collection.mint(wallets[2].address.toB256(), 1);

    const subId = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const assetId = getMintedAssetId(collection?.contract?.id.toB256() ?? "", subId);

    const balance: BN = await wallets[2].getBalance(assetId);
    const totalAssets = await collection.getTotalAssets();
    console.log("Total Assets: ", totalAssets);
    expect(totalAssets).toBe(1);
    expect(balance.toString()).toBe("1");
  });

  it("should throw an error if minting without a connected contract or account", async () => {
    const invalidCollection = new Collection("invalid-id");
    await expect(invalidCollection.mint(wallets[2].address.toB256(), 1)).rejects.toThrow("Contract or account is not connected");
  });

  it("should mint tokens with an allowlist", async () => {
    const entries = [
      { address: wallets[0].address.toHexString(), amount: 3 },
      { address: wallets[1].address.toHexString(), amount: 2 },
    ];

    const { root, allowlist } = Collection.createAllowlist(entries);
    await collection.setAllowlist(root, "https://example.com/allowlist");

    const originalFetch = global.fetch;

    // @ts-ignore
    global.fetch = vi.fn((url, options) => {
      if (url === "https://example.com/allowlist") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(allowlist),
        });
      }
      // For all other URLs, use the original fetch
      return originalFetch(url, options);
    });

    // Mint tokens for an address in the allowlist
    await collection.mint(wallets[0].address.toB256(), 1);

    const subId =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const assetId = getMintedAssetId(
      collection?.contract?.id.toB256() ?? "",
      subId
    );

    const balance: BN = await wallets[0].getBalance(assetId);
    expect(balance.toString()).toBe("1");

    // Restore the original fetch function
    global.fetch = originalFetch;
  });

  it("should get total assets", async () => {
    await collection.mint(wallets[0].address.toB256(), 2);
    const totalAssets = await collection.getTotalAssets();
    expect(totalAssets).toBe(2);
  });

  it("should throw error if contract is not connected when getting total assets", async () => {
    const invalidCollection = new Collection("invalid-id");
    await expect(invalidCollection.getTotalAssets()).rejects.toThrow('Contract is not connected');
  });

  it("should get token metadata", async () => {
    const { transactionResult } = await collection.mint(
      wallets[0].address.toB256(),
      1
    );
    const metadata = await collection.getTokenMetadata(
      transactionResult.mintedAssets[0].assetId);
    expect(metadata).toBeDefined();
    expect(metadata.name).toBe("Props #1");
  });

  it("should get token metadata from ipfs", async () => {
    const contract2 = await deployProps721CollectionContract(
      wallets[0],
      "ipfs://bafybeigotlyxwcbn46yzbsbeliet4dqpz6emj6fhwzg7ozykd3npkpo37a/"
    );
    const collection2 = new Collection(
      "collection-id",
      contract2,
      wallets[0],
      "ipfs://bafybeigotlyxwcbn46yzbsbeliet4dqpz6emj6fhwzg7ozykd3npkpo37a/"
    );
    const { transactionResult } = await collection2.mint(
      wallets[0].address.toB256(),
      1
    );
    const metadata = await collection2.getTokenMetadata(
      transactionResult.mintedAssets[0].assetId
    );
    expect(metadata).toBeDefined();
    expect(metadata.name).toBe("Reveal testing #1");
  });
});
