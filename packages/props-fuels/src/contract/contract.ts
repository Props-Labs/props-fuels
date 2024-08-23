import { Account, Address, TransactionStatus } from "fuels";
import { Props721CollectionContract, Props721EditionContract } from "../sway-api";
import { Allowlist, AllowlistEntry, AllowListInput, MintResult, NFTMetadata } from "../common/types";
import { PropsUtilities } from "../utils";
import { PropsEventEmitter, PropsEvents } from "../core/events";

/**
 * Class representing a Props Contract.
 */
export class PropsContract extends PropsEventEmitter {
  /**
   * The ID of the contract.
   */
  public id: string;

  /**
   * Optional contract associated with the contract.
   */
  public contract?: Props721EditionContract | Props721CollectionContract;

  /**
   * Optional account associated with the contract.
   */
  public account?: Account;

  /**
   * Creates an instance of PropsContract.
   * @param id - The ID of the contract.
   * @param contract - Optional contract associated with the contract.
   * @param account - Optional account associated with the contract.
   */
  constructor(
    id: string,
    contract?: Props721EditionContract | Props721CollectionContract,
    account?: Account
  ) {
    super();
    this.id = id;
    this.contract = contract;
    this.account = account;
  }

  /**
   * Creates an allowlist for a given set of addresses and amounts.
   * @param {AllowListInput} entries - The entries to include in the allowlist.
   * @returns {{ root: string, allowlist: Allowlist }} An object containing the Merkle root and the allowlist with proofs.
   */
  static createAllowlist(entries: AllowListInput): {
    root: string;
    allowlist: Allowlist;
  } {
    return PropsUtilities.createAllowlist(entries);
  }

  /**
   * Sets the allowlist for the contract by setting the Merkle root and URI.
   * @param {string} root - The Merkle root to set.
   * @param {string} uri - The Merkle URI to set.
   * @returns {Promise<void>} A promise that resolves when the allowlist has been set.
   * @throws {Error} If the contract or account is not connected, or if the set_merkle function fails.
   */
  async setAllowlist(root: string, uri: string): Promise<void> {
    if (!this.contract || !this.account) {
      throw new Error("Contract or account is not connected");
    }

    try {
      await this.contract.functions.set_merkle(root, uri).call();
    } catch (error) {
      throw new Error(`Failed to set allowlist: ${error}`);
    }
  }

  /**
   * Private function to get the allowlist for a given address.
   * @param {string} address - The address to get the allowlist for.
   * @returns {Promise<AllowlistEntry>} A promise that resolves to the allowlist entry for the address.
   * @throws {Error} If the contract or account is not connected, or if the fetch or JSON parsing fails.
   */
  protected async getAllowlistEntryByAddress(
    address: string
  ): Promise<{ entry: AllowlistEntry; num_leaves: number }> {
    console.log("getAllowlistEntryByAddress", address);
    if (!this.contract || !this.account) {
      throw new Error("Contract or account is not connected");
    }

    try {
      const { value: merkleUri } = await this.contract.functions
        .merkle_uri()
        .get();

      if (!merkleUri) {
        throw new Error("Merkle URI not found");
      }

      const uri = merkleUri.startsWith("ipfs://")
        ? merkleUri.replace("ipfs://", "https://ipfs.io/ipfs/")
        : merkleUri;

      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch allowlist from URI: ${uri}`);
      }

      const allowlist = await response.json();
      const allocation = allowlist[address];

      if (allocation === undefined) {
        throw new Error(`Address ${address} not found in allowlist`);
      }

      const num_leaves = Object.keys(allowlist).length;

      return { entry: allocation, num_leaves };
    } catch (error) {
      console.error("Original error:", error);
      throw error; // Re-throw the original error
    }
  }

  /**
   * Represents the allowlist allocation for an address.
   * @param {string} address - The address to get the allocation for.
   * @returns {Promise<number>} A promise that resolves to the allocation amount for the address.
   * @throws {Error} If the contract or account is not connected, or if the fetch or JSON parsing fails.
   */
  async getAllowlistAllocationByAddress(address: string): Promise<number> {
    console.log("Getting allowlist allocation for address:", address);
    const { entry: allocation } =
      await this.getAllowlistEntryByAddress(address);
    return allocation.amount;
  }

  /**
   * Sets the start and end dates for the contract.
   * @param {number} startDate - The start date for the contract as a Unix timestamp in milliseconds.
   * @param {number} endDate - The end date for the contract as a Unix timestamp in milliseconds.
   * @returns {Promise<void>} A promise that resolves when the dates are set.
   * @throws {Error} If the contract or account is not connected, or if the transaction fails.
   */
  async setDates(startDate: number, endDate: number): Promise<void> {
    if (!this.contract || !this.account) {
      throw new Error("Contract or account is not connected");
    }

    try {
      const startTimestamp = (
        BigInt(startDate) + BigInt("4611686018427387904")
      ).toString();
      const endTimestamp = (
        BigInt(endDate) + BigInt("4611686018427387904")
      ).toString();

      this.emit(PropsEvents.getInstance().transaction, {
        message: "Please approve the transaction in your wallet...",
        transactionIndex: 1,
        transactionCount: 1,
      });

      const { waitForResult } = await this.contract.functions
        .set_dates(startTimestamp, endTimestamp)
        .callParams({
          gasLimit: 1_000_000,
        })
        .call();

      this.emit(PropsEvents.getInstance().pending, {
        message: "Waiting for transaction to be confirmed...",
        transactionIndex: 1,
        transactionCount: 1,
      });

      await waitForResult();
      console.log(
        `Dates set successfully: start=${new Date(startDate)}, end=${new Date(endDate)}`
      );
    } catch (error) {
      console.error("Failed to set dates:", error);
      throw error;
    }
  }

  /**
   * Airdrops tokens to multiple addresses.
   * @param {string} to - The address to mint tokens to.
   * @param {number} amount - The amount of tokens to mint.
   * @returns {Promise<MintResult|Error>} A promise that resolves with the airdrop result.
   * @throws {Error} If the airdrop process fails.
   */
  async airdrop(to: string, amount: number): Promise<MintResult | Error> {
    if (!this.contract || !this.account) {
      throw new Error("Contract or account is not connected");
    }

    try {
      const baseAssetId = this.account.provider.getBaseAssetId();

      const address = Address.fromDynamicInput(to);
      const addressInput = { bits: address.toB256() };
      const addressIdentityInput = { Address: addressInput };

      const { waitForResult } = await this.contract.functions
        .airdrop(addressIdentityInput, amount)
        .callParams({
          gasLimit: 1_000_000,
        })
        .call();

      const { transactionResult } = await waitForResult();
      if (transactionResult?.status === TransactionStatus.success)
        return { id: transactionResult.id, transactionResult };
      else throw new Error("Airdrop transaction failed");
    } catch (error) {
      throw error;
    }
  }
}