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
export type MintErrorInput = Enum<{ CannotMintMoreThanOneNFTWithSubId: [], MaxNFTsMinted: [], NFTAlreadyMinted: [], NotEnoughTokens: BigNumberish, InvalidAsset: [] }>;
export type MintErrorOutput = Enum<{ CannotMintMoreThanOneNFTWithSubId: [], MaxNFTsMinted: [], NFTAlreadyMinted: [], NotEnoughTokens: BN, InvalidAsset: [] }>;
export enum PauseErrorInput { Paused = 'Paused', NotPaused = 'NotPaused' };
export enum PauseErrorOutput { Paused = 'Paused', NotPaused = 'NotPaused' };
export enum ReentrancyErrorInput { NonReentrant = 'NonReentrant' };
export enum ReentrancyErrorOutput { NonReentrant = 'NonReentrant' };
export enum SetErrorInput { ValueAlreadySet = 'ValueAlreadySet' };
export enum SetErrorOutput { ValueAlreadySet = 'ValueAlreadySet' };
export type StateInput = Enum<{ Uninitialized: [], Initialized: IdentityInput, Revoked: [] }>;
export type StateOutput = Enum<{ Uninitialized: [], Initialized: IdentityOutput, Revoked: [] }>;

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type AssetIdInput = { bits: string };
export type AssetIdOutput = AssetIdInput;
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
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
    fees: FunctionFragment;
    price: FunctionFragment;
    set_price: FunctionFragment;
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
    mint: InvokeFunction<[recipient: IdentityInput, _sub_id: string, amount: BigNumberish, affiliate: Option<IdentityInput>], void>;
    metadata: InvokeFunction<[asset: AssetIdInput, key: StdString], Option<MetadataOutput>>;
    metadata_keys: InvokeFunction<[], Vec<StdString>>;
    total_metadata: InvokeFunction<[asset: AssetIdInput], Option<Vec<[StdString, MetadataOutput]>>>;
    owner: InvokeFunction<[], StateOutput>;
    set_metadata: InvokeFunction<[asset: AssetIdInput, key: StdString, metadata: MetadataInput], void>;
    fees: InvokeFunction<[], Option<[BN, BN]>>;
    price: InvokeFunction<[], Option<BN>>;
    set_price: InvokeFunction<[price: BigNumberish], void>;
    total_price: InvokeFunction<[], Option<BN>>;
    is_paused: InvokeFunction<[], boolean>;
    pause: InvokeFunction<[], void>;
    unpause: InvokeFunction<[], void>;
    constructor: InvokeFunction<[owner: IdentityInput, name: StdString, symbol: StdString, metadata_keys: Vec<StdString>, metadata_values: Vec<MetadataInput>, price: BigNumberish], void>;
  };
}
