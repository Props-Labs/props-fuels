import { describe, it, expect, beforeEach } from "vitest";
import { Account, Provider } from "fuels";
import { Edition } from "./edition";
import { deployProps721EditionContract, setup } from "../utils/setup";
import { Props721EditionContractAbi } from "../sway-api/contracts";

describe("Edition", () => {
  let edition: Edition;
  let wallets: Account[];
  let provider: Provider;
  let contract: Props721EditionContractAbi;

  beforeEach(async () => {
    const { wallet1, wallet2, wallet3, wallet4, provider: setupProvider } = await setup();
    wallets = [wallet1, wallet2, wallet3, wallet4];
    provider = setupProvider;
    contract = await deployProps721EditionContract(wallet1);
    edition = new Edition("edition-id", contract, wallet1, {
      name: "Test Edition",
      description: "A test edition",
      image: "test_image_url",
    });
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
    await edition.mint(wallets[2].address.toB256(), 1);
    // Assuming minting logs or other side effects can be checked here
  });

  it("should throw an error if minting without a connected contract or account", async () => {
    const invalidEdition = new Edition("invalid-id");
    await expect(invalidEdition.mint(wallets[2].address.toB256(), 1)).rejects.toThrow("Contract or account is not connected");
  });
});