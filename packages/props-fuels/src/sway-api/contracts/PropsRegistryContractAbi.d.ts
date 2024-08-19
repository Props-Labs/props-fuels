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
} from 'fuels';

import type { Enum } from "./common";

export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;
export type StateInput = Enum<{ Uninitialized: [], Initialized: IdentityInput, Revoked: [] }>;
export type StateOutput = Enum<{ Uninitialized: [], Initialized: IdentityOutput, Revoked: [] }>;

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;

export interface PropsRegistryContractAbiInterface extends Interface {
  functions: {
    owner: FunctionFragment;
    init_contract: FunctionFragment;
  };
}

export class PropsRegistryContractAbi extends Contract {
  interface: PropsRegistryContractAbiInterface;
  functions: {
    owner: InvokeFunction<[], StateOutput>;
    init_contract: InvokeFunction<[contract_id: ContractIdInput, owner: IdentityInput, name: StdString], void>;
  };
}
