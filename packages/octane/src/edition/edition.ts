import { Account, Address, BN } from "fuels";
import { Octane721EditionContractAbi } from "../sway-api/contracts";
import { NFTMetadata } from "../common/types";

/**
 * Represents an edition within the Octane SDK.
 */
export class Edition {
  /**
   * The ID of the edition.
   * @type {string}
   */
  id: string;

  /**
   * Optional contract associated with the edition.
   * @type {Octane721EditionContractAbi | undefined}
   */
  contract?: Octane721EditionContractAbi;

  /**
   * Optional account associated with the edition.
   * @type {Account | undefined}
   */
  account?: Account;

  /**
   * Metadata associated with the edition.
   * @type {NFTMetadata}
   */
  metadata?: NFTMetadata;

  /**
   * Creates a new instance of the Edition class.
   * @param {string} id - The ID of the edition.
   * @param {Octane721EditionContractAbi} [contract] - Optional contract associated with the edition.
   * @param {Account} [account] - Optional account associated with the edition.
   * @param {NFTMetadata} metadata - Metadata associated with the edition.
   */
  constructor(id: string, contract?: Octane721EditionContractAbi, account?: Account, metadata?: NFTMetadata) {
    this.id = id;
    this.contract = contract;
    this.account = account;
    this.metadata = metadata;
  }

  /**
   * Connects an account to the edition, replacing the current account.
   * @param {Account} account - The account to connect.
   */
  connect(account: Account): void {
    this.account = account;
  }

  /**
   * Mints a specified amount of tokens to a given address.
   * @param {string} to - The address to mint tokens to.
   * @param {number} amount - The amount of tokens to mint.
   * @returns {Promise<void>} A promise that resolves when the tokens have been minted.
   * @throws {Error} If the minting process fails.
   */
  async mint(to: string, amount: number): Promise<void> {
    if (!this.contract || !this.account) {
      throw new Error('Contract or account is not connected');
    }

    try {
      const baseAssetId = this.account.provider.getBaseAssetId();
      const { value } = await this.contract.functions.price().get();
      if (!value) {
        throw new Error('Price not found');
      }
      const price = value.mul(amount);
      const address = Address.fromDynamicInput(to);
      const addressInput = { bits: address.toB256() };
      const addressIdentityInput = { Address: addressInput };
      const subId = new BN(0).toHex(32);
      const result = await this.contract.functions
        .mint(addressIdentityInput, subId, amount)
        .callParams({
          forward: [price, baseAssetId],
          gasLimit: 1000000,
        })
        .call();
    } catch (error) {
      throw error;
    }
  }
}
