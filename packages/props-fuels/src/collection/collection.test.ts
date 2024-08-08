import { describe, it, expect, beforeEach } from "vitest";
import { Account, BN, Provider, getMintedAssetId } from "fuels";
import { Collection } from "./collection";
import { deployProps721CollectionContract, setup } from "../utils/setup";
import { Props721CollectionContractAbi } from "../sway-api/contracts";

describe("Collection", () => {
  let collection: Collection;
  let wallets: Account[];
  let provider: Provider;
  let contract: Props721CollectionContractAbi;

  beforeEach(async () => {
    const { wallet1, wallet2, wallet3, wallet4, provider: setupProvider } = await setup();
    wallets = [wallet1, wallet2, wallet3, wallet4];
    provider = setupProvider;
    contract = await deployProps721CollectionContract(wallet1);
    collection = new Collection("collection-id", contract, wallet1);
    console.log("Collection Contract: ", collection);
  });

  it("should create an collection instance", () => {
    console.log("Collection: ", collection);
    expect(collection).toBeInstanceOf(Collection);
    expect(collection.id).toBe("collection-id");
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
});
