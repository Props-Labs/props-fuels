import { Account, Address, BN } from "fuels";
import { Props721CollectionContractAbi, Props721CollectionContractAbi__factory } from "../sway-api/contracts";
import { MintResult } from "../common/types";
import { NFTMetadata } from "../common/types";

/**
 * Represents an edition within the Props SDK.
 */
export class Collection {
  /**
   * The ID of the edition.
   * @type {string}
   */
  id: string;

  /**
   * Optional contract associated with the edition.
   * @type {Props721CollectionContractAbi | undefined}
   */
  contract?: Props721CollectionContractAbi;

  /**
   * Optional account associated with the edition.
   * @type {Account | undefined}
   */
  account?: Account;

  /**
   * The base URI for the collection's metadata.
   * @type {string | undefined}
   */
  baseUri?: string;

  /**
   * Sample tokens of the collection.
   * @type {NFTMetadata[]}
   */
  sampleTokens: NFTMetadata[] = [];

  /**
   * Creates a new instance of the Collection class.
   * @param {string} id - The ID of the edition.
   * @param {Props721CollectionContractAbi} [contract] - Optional contract associated with the edition.
   * @param {Account} [account] - Optional account associated with the edition.
   * @param {string} [baseUri] - Base URI for the collection's metadata.
   */
  constructor(
    id: string,
    contract?: Props721CollectionContractAbi,
    account?: Account,
    baseUri?: string
  ) {
    this.id = id;
    this.contract = contract;
    this.account = account;
    this.baseUri = baseUri;
    this.fetchSampleTokens();
  }

  /**
   * Fetches sample tokens from the baseUri.
   */
  public async fetchSampleTokens(): Promise<NFTMetadata[]> {
    if (!this.baseUri) return [];

    for (let i = 1; i <= 3; i++) {
      try {
        const response = await fetch(`${this.baseUri}${i}`);
        if (!response.ok) {
          // console.warn(`Failed to fetch metadata for token ${i}`);
          continue;
        }
        const metadata: NFTMetadata = await response.json();
        this.sampleTokens.push(metadata);
      } catch (error) {
        // console.error(`Error fetching metadata for token ${i}:`, error);
      }
    }
    return this.sampleTokens;
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
      const totalFees = fees.reduce((acc: { add: (arg0: any) => any; }, fee: any) => acc.add(fee), new BN(0));
      const price = priceValue.mul(amount).add(totalFees);
      const address = Address.fromDynamicInput(to);
      const addressInput = { bits: address.toB256() };
      const addressIdentityInput = { Address: addressInput };
      const subId = new BN(0).toHex(32);

      const { waitForResult } = await this.contract.functions
        .mint(
          addressIdentityInput,
          subId,
          amount,
          affiliate
            ? {
                Address: { bits: Address.fromDynamicInput(affiliate).toB256() },
              }
            : undefined
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
   * Static method to create an Collection instance based on a contractId and a wallet.
   * @param {string} contractId - The ID of the contract.
   * @param {Account} wallet - The wallet to connect.
   * @returns {Promise<Collection>} A promise that resolves to an Collection instance.
   */
  static async fromContractIdAndWallet(contractId: string, wallet: Account): Promise<Collection> {
    const contract = Props721CollectionContractAbi__factory.connect(
      contractId,
      wallet
    );
    const {value: baseUri} = await contract.functions.base_uri().get();
    return new Collection(contractId, contract, wallet, baseUri);
  }
}
