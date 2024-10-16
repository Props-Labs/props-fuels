import { Account, Address, BN, TransactionStatus } from "fuels";
import { Props721CollectionContract, Props721CollectionContractFactory, PropsFeeSplitterContract } from "../sway-api/contracts";
import { MintResult } from "../common/types";
import { NFTMetadata } from "../common/types";
import { PropsContract } from "../contract";
import { feeSplitterContractAddress } from "../common/defaults";
import { PropsEvents } from "../core";
import { PropsUtilities } from "../utils";

/**
 * Represents an edition within the Props SDK.
 */
export class Collection extends PropsContract {
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
   * @param {Props721CollectionContract} [contract] - Optional contract associated with the edition.
   * @param {Account} [account] - Optional account associated with the edition.
   * @param {string} [baseUri] - Base URI for the collection's metadata.
   */
  constructor(
    id: string,
    contract?: Props721CollectionContract,
    account?: Account,
    baseUri?: string
  ) {
    super(id, contract, account);
    this.id = id;
    this.contract = contract;
    this.account = account;
    this.baseUri = baseUri;
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
   * Fetches the metadata for a specific token.
   * @param {string} assetId - The asset ID of the token.
   * @returns {Promise<NFTMetadata>} A promise that resolves to the token's metadata.
   * @throws {Error} If the metadata cannot be fetched or parsed.
   */
  public async getTokenMetadata(assetId: string): Promise<NFTMetadata> {
    if (!this.contract) {
      throw new Error("Contract is not connected");
    }

    try {
      // Fetch the token URI from the contract
      const { value: tokenUri } = await this.contract.functions.metadata({ bits: assetId }, "uri").get();

      // console.log("Token URI: ", tokenUri);
      
      if (!tokenUri || !tokenUri.String) {
        throw new Error(`Token URI not found for asset ID: ${assetId}`);
      }

      // Fetch the metadata from the token URI
      const normalizedUrl = PropsUtilities.parseUrl(tokenUri.String);
      const response = await fetch(normalizedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata for asset ID: ${assetId}`);
      }

      const metadata: NFTMetadata = await response.json();
      return metadata;
    } catch (error) {
      console.error(`Error fetching metadata for asset ID ${assetId}:`, error);
      throw new Error(`Failed to get metadata for asset ID: ${assetId}`);
    }
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
  ): Promise<MintResult> {
    if (!this.contract || !this.account) {
      throw new Error("Contract or account is not connected");
    }

    const feeSplitterContract = new PropsFeeSplitterContract(
      feeSplitterContractAddress,
      this.account
    );

    this.emit(PropsEvents.getInstance().waiting, {
      message: "Initializing mint...",
      transactionIndex: 1,
      transactionCount: 1,
    });

    try {
      const baseAssetId = this.account.provider.getBaseAssetId();
      const { value: priceValue } = await this.contract.functions.price().get();
      const { value: fees } = await this.contract.functions
        .fees()
        .addContracts([feeSplitterContract])
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

      const { value: merkleRoot } = await this.contract.functions
        .merkle_root()
        .get();
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

      this.emit(PropsEvents.getInstance().transaction, {
        message: "Please approve the transaction in your wallet...",
        transactionIndex: 1,
        transactionCount: 1,
      });

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
          maxAmount
        )
        .addContracts([feeSplitterContract])
        .callParams({
          forward: [price, baseAssetId],
          gasLimit: 1_000_000,
        })
        .call();

      this.emit(PropsEvents.getInstance().pending, {
        message: "Waiting for transaction to be clear...",
        transactionIndex: 1,
        transactionCount: 1,
      });
      
      const { transactionResult } = await waitForResult();
      if (transactionResult?.status === TransactionStatus.success)
        return { id: transactionResult.id, transactionResult };
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
    const contract = new Props721CollectionContract(
      contractId,
      wallet
    );
    const {value: baseUri} = await contract.functions.base_uri().get();
    return new Collection(contractId, contract, wallet, baseUri);
  }
}
