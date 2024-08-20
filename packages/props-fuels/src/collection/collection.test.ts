import { describe, it, expect, beforeEach } from "vitest";
import { Account, BN, Provider, getMintedAssetId } from "fuels";
import { Collection } from "./collection";
import { deployProps721CollectionContract, setup } from "../utils/setup";
import { Props721CollectionContract } from "../sway-api/contracts";

describe("Collection", () => {
  let collection: Collection;
  let wallets: Account[];
  let provider: Provider;
  let contract: Props721CollectionContract;

  beforeEach(async () => {
    const { wallet1, wallet2, wallet3, wallet4, provider: setupProvider } = await setup();
    wallets = [wallet1, wallet2, wallet3, wallet4];
    provider = setupProvider;
    contract = await deployProps721CollectionContract(wallet1);
    collection = new Collection("collection-id", contract, wallet1, "https://example.com/");
    console.log("Collection Contract: ", collection);
  });

  it("should create an collection instance", () => {
    console.log("Collection: ", collection);
    expect(collection).toBeInstanceOf(Collection);
    expect(collection.id).toBe("collection-id");
    expect(collection.baseUri).toBe("https://example.com/");
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
});
