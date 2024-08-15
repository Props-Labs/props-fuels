/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.93.0
  Forc version: 0.62.0
  Fuel-Core version: 0.31.0
*/

import type {
  BigNumberish,
  BN,
  Bytes,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
  StdString,
  StrSlice,
} from 'fuels';

import type { Option, Enum, Vec } from "./common";

export enum AccessErrorInput { NotOwner = 'NotOwner' };
export enum AccessErrorOutput { NotOwner = 'NotOwner' };
export enum BurnErrorInput { NotEnoughCoins = 'NotEnoughCoins' };
export enum BurnErrorOutput { NotEnoughCoins = 'NotEnoughCoins' };
export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;
export enum InitializationErrorInput { CannotReinitialized = 'CannotReinitialized' };
export enum InitializationErrorOutput { CannotReinitialized = 'CannotReinitialized' };
export type MetadataInput = Enum<{ B256: string, Bytes: Bytes, Int: BigNumberish, String: StdString }>;
export type MetadataOutput = Enum<{ B256: string, Bytes: Bytes, Int: BN, String: StdString }>;
export type MintErrorInput = Enum<{ CannotMintMoreThanOneNFTWithSubId: [], MaxNFTsMinted: [], NFTAlreadyMinted: [], NotEnoughTokens: BigNumberish, InvalidAsset: [], OutsideMintingPeriod: StdString, InvalidProof: [], ExceededMaxMintLimit: [] }>;
export type MintErrorOutput = Enum<{ CannotMintMoreThanOneNFTWithSubId: [], MaxNFTsMinted: [], NFTAlreadyMinted: [], NotEnoughTokens: BN, InvalidAsset: [], OutsideMintingPeriod: StdString, InvalidProof: [], ExceededMaxMintLimit: [] }>;
export enum PauseErrorInput { Paused = 'Paused', NotPaused = 'NotPaused' };
export enum PauseErrorOutput { Paused = 'Paused', NotPaused = 'NotPaused' };
export enum ProofErrorInput { InvalidKey = 'InvalidKey', InvalidProofLength = 'InvalidProofLength' };
export enum ProofErrorOutput { InvalidKey = 'InvalidKey', InvalidProofLength = 'InvalidProofLength' };
export enum ReentrancyErrorInput { NonReentrant = 'NonReentrant' };
export enum ReentrancyErrorOutput { NonReentrant = 'NonReentrant' };
export enum SetErrorInput { ValueAlreadySet = 'ValueAlreadySet' };
export enum SetErrorOutput { ValueAlreadySet = 'ValueAlreadySet' };
export type StateInput = Enum<{ Uninitialized: [], Initialized: IdentityInput, Revoked: [] }>;
export type StateOutput = Enum<{ Uninitialized: [], Initialized: IdentityOutput, Revoked: [] }>;

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type AirdropEventInput = { sender: IdentityInput, recipient: IdentityInput, amount: BigNumberish, new_minted_id: BigNumberish };
export type AirdropEventOutput = { sender: IdentityOutput, recipient: IdentityOutput, amount: BN, new_minted_id: BN };
export type AssetIdInput = { bits: string };
export type AssetIdOutput = AssetIdInput;
export type ContractCreatedEventInput = { owner: IdentityInput, name: StdString, symbol: StdString, price: BigNumberish, start: BigNumberish, end: BigNumberish };
export type ContractCreatedEventOutput = { owner: IdentityOutput, name: StdString, symbol: StdString, price: BN, start: BN, end: BN };
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type MintEventInput = { recipient: IdentityInput, amount: BigNumberish, affiliate: IdentityInput, max_amount: BigNumberish, total_price: BigNumberish, total_fee: BigNumberish, price_amount: BigNumberish, builder_fee: BigNumberish, affiliate_fee: BigNumberish, fee: BigNumberish, creator_price: BigNumberish, asset_id: AssetIdInput, new_minted_id: BigNumberish };
export type MintEventOutput = { recipient: IdentityOutput, amount: BN, affiliate: IdentityOutput, max_amount: BN, total_price: BN, total_fee: BN, price_amount: BN, builder_fee: BN, affiliate_fee: BN, fee: BN, creator_price: BN, asset_id: AssetIdOutput, new_minted_id: BN };
export type OwnershipSetInput = { new_owner: IdentityInput };
export type OwnershipSetOutput = { new_owner: IdentityOutput };

export type Props721EditionContractAbiConfigurables = Partial<{
  MAX_SUPPLY: BigNumberish;
  BUILDER_FEE_ADDRESS: AddressInput;
  BUILDER_FEE: BigNumberish;
  BUILDER_REVENUE_SHARE_ADDRESS: AddressInput;
  BUILDER_REVENUE_SHARE_PERCENTAGE: BigNumberish;
  AFFILIATE_FEE_PERCENTAGE: BigNumberish;
  DISABLE_AIRDROP: boolean;
}>;

export interface Props721EditionContractAbiInterface extends Interface {
  functions: {
    decimals: FunctionFragment;
    name: FunctionFragment;
    symbol: FunctionFragment;
    total_assets: FunctionFragment;
    total_supply: FunctionFragment;
    airdrop: FunctionFragment;
    burn: FunctionFragment;
    mint: FunctionFragment;
    metadata: FunctionFragment;
    metadata_keys: FunctionFragment;
    total_metadata: FunctionFragment;
    owner: FunctionFragment;
    set_metadata: FunctionFragment;
    end_date: FunctionFragment;
    fees: FunctionFragment;
    merkle_root: FunctionFragment;
    merkle_uri: FunctionFragment;
    price: FunctionFragment;
    set_dates: FunctionFragment;
    set_merkle: FunctionFragment;
    set_merkle_root: FunctionFragment;
    set_price: FunctionFragment;
    start_date: FunctionFragment;
    total_price: FunctionFragment;
    is_paused: FunctionFragment;
    pause: FunctionFragment;
    unpause: FunctionFragment;
    constructor: FunctionFragment;
  };
}

export class Props721EditionContractAbi extends Contract {
  interface: Props721EditionContractAbiInterface;
  functions: {
    decimals: InvokeFunction<[_asset: AssetIdInput], Option<number>>;
    name: InvokeFunction<[asset: AssetIdInput], Option<StdString>>;
    symbol: InvokeFunction<[asset: AssetIdInput], Option<StdString>>;
    total_assets: InvokeFunction<[], BN>;
    total_supply: InvokeFunction<[asset: AssetIdInput], Option<BN>>;
    airdrop: InvokeFunction<[recipient: IdentityInput, amount: BigNumberish], void>;
    burn: InvokeFunction<[sub_id: string, amount: BigNumberish], void>;
    mint: InvokeFunction<[recipient: IdentityInput, _sub_id: string, amount: BigNumberish, affiliate: Option<IdentityInput>, proof: Option<Vec<string>>, key: Option<BigNumberish>, num_leaves: Option<BigNumberish>, max_amount: Option<BigNumberish>], void>;
    metadata: InvokeFunction<[asset: AssetIdInput, key: StdString], Option<MetadataOutput>>;
    metadata_keys: InvokeFunction<[], Vec<StdString>>;
    total_metadata: InvokeFunction<[asset: AssetIdInput], Option<Vec<[StdString, MetadataOutput]>>>;
    owner: InvokeFunction<[], StateOutput>;
    set_metadata: InvokeFunction<[asset: AssetIdInput, key: StdString, metadata: MetadataInput], void>;
    end_date: InvokeFunction<[], Option<BN>>;
    fees: InvokeFunction<[], Option<[BN, BN]>>;
    merkle_root: InvokeFunction<[], Option<string>>;
    merkle_uri: InvokeFunction<[], Option<StdString>>;
    price: InvokeFunction<[], Option<BN>>;
    set_dates: InvokeFunction<[start: BigNumberish, end: BigNumberish], void>;
    set_merkle: InvokeFunction<[root: string, uri: StdString], void>;
    set_merkle_root: InvokeFunction<[root: string], void>;
    set_price: InvokeFunction<[price: BigNumberish], void>;
    start_date: InvokeFunction<[], Option<BN>>;
    total_price: InvokeFunction<[], Option<BN>>;
    is_paused: InvokeFunction<[], boolean>;
    pause: InvokeFunction<[], void>;
    unpause: InvokeFunction<[], void>;
    constructor: InvokeFunction<[owner: IdentityInput, name: StdString, symbol: StdString, metadata_keys: Vec<StdString>, metadata_values: Vec<MetadataInput>, price: BigNumberish, start_date: BigNumberish, end_date: BigNumberish], void>;
  };
}
