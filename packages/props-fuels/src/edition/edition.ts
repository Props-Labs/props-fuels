import { Account, Address, BN } from "fuels";
import { Props721EditionContractAbi, Props721EditionContractAbi__factory } from "../sway-api/contracts";
import { MintResult, NFTMetadata } from "../common/types";
import { decode } from "punycode";
import { decodeContractMetadata } from "../utils/metadata";
import { PropsContract } from "../contract";

/**
 * Represents an edition within the Props SDK.
 */
export class Edition extends PropsContract {
  /**
   * Metadata associated with the edition.
   * @type {NFTMetadata}
   */
  metadata?: NFTMetadata;

  /**
   * Creates a new instance of the Edition class.
   * @param {string} id - The ID of the edition.
   * @param {Props721EditionContractAbi} [contract] - Optional contract associated with the edition.
   * @param {Account} [account] - Optional account associated with the edition.
   * @param {NFTMetadata} metadata - Metadata associated with the edition.
   */
  constructor(
    id: string,
    contract?: Props721EditionContractAbi,
    account?: Account,
    metadata?: NFTMetadata
  ) {
    super(id, contract, account);
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
  async mint(
    to: string,
    amount: number,
    affiliate?: string
  ): Promise<MintResult|Error> {
    if (!this.contract || !this.account) {
      throw new Error("Contract or account is not connected");
    }

    try {
      const baseAssetId = this.account.provider.getBaseAssetId();
      const { value: priceValue } = await this.contract.functions.price().get();
      const { value: fees } = await this.contract.functions
        .fees()
        .get();
      if (!priceValue) {
        throw new Error("Price not found");
      }
      if (!fees) {
        throw new Error("Fees not found");
      }
      const totalFees = fees.reduce((acc, fee) => acc.add(fee), new BN(0));
      const price = priceValue.mul(amount).add(totalFees);
      const address = Address.fromDynamicInput(to);
      const addressInput = { bits: address.toB256() };
      const addressIdentityInput = { Address: addressInput };
      const subId = new BN(0).toHex(32);

      const { value: merkleRoot } = await this.contract.functions.merkle_root().get();
      let allowlistEntry;
      let numLeaves = undefined;
      let proof = undefined;
      let key = undefined;
      let maxAmount = undefined;

      if (
        merkleRoot !==
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        const { entry, num_leaves } = await this.getAllowlistEntryByAddress(to);
        allowlistEntry = entry;
        numLeaves = num_leaves;
        proof = entry.proof;
        key = entry.key;
        maxAmount = entry.amount;
      }

      const { waitForResult } = await this.contract.functions
        .mint(
          addressIdentityInput,
          subId,
          amount,
          affiliate
            ? {
                Address: { bits: Address.fromDynamicInput(affiliate).toB256() },
              }
            : undefined,
          proof,
          key,
          numLeaves,
          maxAmount,
        )
        .callParams({
          forward: [price, baseAssetId],
          gasLimit: 1_000_000,
        })
        .call();
      const { transactionResult } = await waitForResult();
      if (transactionResult?.gqlTransaction?.status?.type === "SuccessStatus")
        return { id: transactionResult.gqlTransaction.id, transactionResult };
      else throw new Error("Transaction failed");
    } catch (error) {
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
  async airdrop(
    to: string,
    amount: number,
  ): Promise<MintResult|Error> {
    if (!this.contract || !this.account) {
      throw new Error("Contract or account is not connected");
    }

    try {
      const baseAssetId = this.account.provider.getBaseAssetId();
    
      const address = Address.fromDynamicInput(to);
      const addressInput = { bits: address.toB256() };
      const addressIdentityInput = { Address: addressInput };
      

      const { waitForResult } = await this.contract.functions
        .airdrop(
          addressIdentityInput,
          amount
        )
        .callParams({
          gasLimit: 1_000_000,
        })
        .call();

      const { transactionResult } = await waitForResult();
      if (transactionResult?.gqlTransaction?.status?.type === "SuccessStatus")
        return { id: transactionResult.gqlTransaction.id, transactionResult };
      else throw new Error("Airdrop transaction failed");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Static method to create an Edition instance based on a contractId and a wallet.
   * @param {string} contractId - The ID of the contract.
   * @param {Account} wallet - The wallet to connect.
   * @returns {Promise<Edition>} A promise that resolves to an Edition instance.
   */
  static async fromContractIdAndWallet(contractId: string, wallet: Account): Promise<Edition> {
    const contract = Props721EditionContractAbi__factory.connect(
      contractId,
      wallet
    );

    // TODO: @dev this is confusing, we should just pass the assetId to the edition
    // TODO: consider just removing the need to pass AssetId to edition
    // const { value: metadata } = await contract.functions.total_metadata(
    //   { bits: wallet.address.toB256() }
    // ).get();
    let metadata; //temp for dev until the metadata is passed in correctly
    return new Edition(contractId, contract, wallet, metadata ? decodeContractMetadata(metadata) : undefined);
  }
}