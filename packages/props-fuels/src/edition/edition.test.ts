import { describe, it, expect, beforeEach, vi } from "vitest";
import { Account, BN, Provider, getMintedAssetId, toHex } from "fuels";
import { Edition } from "./edition";
import { deployProps721EditionContract, setup } from "../utils/setup";
import { Props721EditionContractAbi } from "../sway-api/contracts";

describe("Edition", () => {
  let edition: Edition;
  let wallets: Account[];
  let provider: Provider;
  let contract: Props721EditionContractAbi;

  beforeEach(async () => {
    const {
      wallet1,
      wallet2,
      wallet3,
      wallet4,
      provider: setupProvider,
    } = await setup();
    wallets = [wallet1, wallet2, wallet3, wallet4];
    provider = setupProvider;
    contract = await deployProps721EditionContract(wallet1);
    edition = new Edition("edition-id", contract, wallet1, {
      name: "Test Edition",
      description: "A test edition",
      image: "test_image_url",
    });
    vi.resetAllMocks();
  });

  it("should create an edition instance", () => {
    expect(edition).toBeInstanceOf(Edition);
    expect(edition.id).toBe("edition-id");
    expect(edition.metadata?.name).toBe("Test Edition");
  });

  it("should connect an account to the edition", () => {
    edition.connect(wallets[1]);
    expect(edition.account).toBe(wallets[1]);
  });

  it("should mint tokens", async () => {
    expect(edition.contract).toBeDefined();
    await edition.mint(wallets[2].address.toB256(), 1);

    const subId =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const assetId = getMintedAssetId(
      edition?.contract?.id.toB256() ?? "",
      subId
    );

    const balance: BN = await wallets[2].getBalance(assetId);
    expect(balance.toString()).toBe("1");
  });

  it("should throw an error if minting without a connected contract or account", async () => {
    const invalidEdition = new Edition("invalid-id");
    await expect(
      invalidEdition.mint(wallets[2].address.toB256(), 1)
    ).rejects.toThrow("Contract or account is not connected");
  });

  it("should mint tokens with an allowlist", async () => {
    const entries = [
      { address: wallets[0].address.toHexString(), amount: 3 },
      { address: wallets[1].address.toHexString(), amount: 2 },
    ];

    const { root, allowlist } = Edition.createAllowlist(entries);
    await edition.setAllowlist(root, "https://example.com/allowlist");

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
    await edition.mint(wallets[0].address.toB256(), 1);

    const subId =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const assetId = getMintedAssetId(
      edition?.contract?.id.toB256() ?? "",
      subId
    );

    const balance: BN = await wallets[0].getBalance(assetId);
    expect(balance.toString()).toBe("1");

    // Restore the original fetch function
    global.fetch = originalFetch;
  });
});
