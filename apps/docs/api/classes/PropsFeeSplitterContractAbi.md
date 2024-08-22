[**@props-labs/fuels**](../README.md) • **Docs**

***

[@props-labs/fuels](../globals.md) / PropsFeeSplitterContractAbi

# Class: PropsFeeSplitterContractAbi

## Extends

- `default`

## Constructors

### new PropsFeeSplitterContractAbi()

> **new PropsFeeSplitterContractAbi**(`id`, `abi`, `accountOrProvider`): [`PropsFeeSplitterContractAbi`](PropsFeeSplitterContractAbi.md)

Creates an instance of the Contract class.

#### Parameters

• **id**: `string` \| `AbstractAddress`

The contract's address.

• **abi**: `JsonAbi` \| `Interface`\<`JsonAbi`\>

The contract's ABI (JSON ABI or Interface instance).

• **accountOrProvider**: `Account` \| `Provider`

The account or provider for interaction.

#### Returns

[`PropsFeeSplitterContractAbi`](PropsFeeSplitterContractAbi.md)

#### Inherited from

`Contract.constructor`

#### Defined in

node\_modules/.pnpm/@fuel-ts+program@0.92.0/node\_modules/@fuel-ts/program/dist/contract.d.ts:39

## Properties

### functions

> **functions**: `object`

A collection of functions available on the contract.

#### constructor

> **constructor**: `InvokeFunction`\<[`IdentityInput`], `void`\>

#### distribute\_funds

> **distribute\_funds**: `InvokeFunction`\<[`BigNumberish`], `void`\>

#### fee

> **fee**: `InvokeFunction`\<[], `Option`\<`BN`\>\>

#### get\_share

> **get\_share**: `InvokeFunction`\<[], `Option`\<`BN`\>\>

#### is\_paused

> **is\_paused**: `InvokeFunction`\<[], `boolean`\>

#### owner

> **owner**: `InvokeFunction`\<[], `StateOutput`\>

#### pause

> **pause**: `InvokeFunction`\<[], `void`\>

#### receive\_funds

> **receive\_funds**: `InvokeFunction`\<[], `void`\>

#### set\_fee

> **set\_fee**: `InvokeFunction`\<[`BigNumberish`], `void`\>

#### set\_shares

> **set\_shares**: `InvokeFunction`\<[`Vec`\<`IdentityInput`\>, `Vec`\<`BigNumberish`\>], `void`\>

#### total\_shares

> **total\_shares**: `InvokeFunction`\<[], `Option`\<`BN`\>\>

#### unpause

> **unpause**: `InvokeFunction`\<[], `void`\>

#### Overrides

`Contract.functions`

#### Defined in

[packages/props-fuels/src/sway-api/contracts/PropsFeeSplitterContractAbi.d.ts:64](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/sway-api/contracts/PropsFeeSplitterContractAbi.d.ts#L64)

***

### interface

> **interface**: `PropsFeeSplitterContractAbiInterface`

The contract's ABI interface.

#### Overrides

`Contract.interface`

#### Defined in

[packages/props-fuels/src/sway-api/contracts/PropsFeeSplitterContractAbi.d.ts:63](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/sway-api/contracts/PropsFeeSplitterContractAbi.d.ts#L63)
