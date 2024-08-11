[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / Props721EditionContractAbi

# Class: Props721EditionContractAbi

## Extends

- `default`

## Constructors

### new Props721EditionContractAbi()

> **new Props721EditionContractAbi**(`id`, `abi`, `accountOrProvider`): [`Props721EditionContractAbi`](Props721EditionContractAbi.md)

Creates an instance of the Contract class.

#### Parameters

• **id**: `string` \| `AbstractAddress`

The contract's address.

• **abi**: `JsonAbi` \| `Interface`\<`JsonAbi`\>

The contract's ABI (JSON ABI or Interface instance).

• **accountOrProvider**: `Account` \| `Provider`

The account or provider for interaction.

#### Returns

[`Props721EditionContractAbi`](Props721EditionContractAbi.md)

#### Inherited from

`Contract.constructor`

#### Defined in

node\_modules/.pnpm/@fuel-ts+program@0.92.0/node\_modules/@fuel-ts/program/dist/contract.d.ts:39

## Properties

### functions

> **functions**: `object`

A collection of functions available on the contract.

#### airdrop

> **airdrop**: `InvokeFunction`\<[`IdentityInput`, `BigNumberish`], `void`\>

#### burn

> **burn**: `InvokeFunction`\<[`string`, `BigNumberish`], `void`\>

#### constructor

> **constructor**: `InvokeFunction`\<[`IdentityInput`, `string`, `string`, `Vec`\<`string`\>, `Vec`\<`MetadataInput`\>, `BigNumberish`], `void`\>

#### decimals

> **decimals**: `InvokeFunction`\<[`AssetIdInput`], `Option`\<`number`\>\>

#### fees

> **fees**: `InvokeFunction`\<[], `Option`\<[`BN`, `BN`]\>\>

#### is\_paused

> **is\_paused**: `InvokeFunction`\<[], `boolean`\>

#### metadata

> **metadata**: `InvokeFunction`\<[`AssetIdInput`, `string`], `Option`\<`MetadataOutput`\>\>

#### metadata\_keys

> **metadata\_keys**: `InvokeFunction`\<[], `Vec`\<`string`\>\>

#### mint

> **mint**: `InvokeFunction`\<[`IdentityInput`, `string`, `BigNumberish`, `Option`\<`IdentityInput`\>], `void`\>

#### name

> **name**: `InvokeFunction`\<[`AssetIdInput`], `Option`\<`string`\>\>

#### owner

> **owner**: `InvokeFunction`\<[], `StateOutput`\>

#### pause

> **pause**: `InvokeFunction`\<[], `void`\>

#### price

> **price**: `InvokeFunction`\<[], `Option`\<`BN`\>\>

#### set\_metadata

> **set\_metadata**: `InvokeFunction`\<[`AssetIdInput`, `string`, `MetadataInput`], `void`\>

#### set\_price

> **set\_price**: `InvokeFunction`\<[`BigNumberish`], `void`\>

#### symbol

> **symbol**: `InvokeFunction`\<[`AssetIdInput`], `Option`\<`string`\>\>

#### total\_assets

> **total\_assets**: `InvokeFunction`\<[], `BN`\>

#### total\_metadata

> **total\_metadata**: `InvokeFunction`\<[`AssetIdInput`], `Option`\<`Vec`\<[`string`, `MetadataOutput`]\>\>\>

#### total\_price

> **total\_price**: `InvokeFunction`\<[], `Option`\<`BN`\>\>

#### total\_supply

> **total\_supply**: `InvokeFunction`\<[`AssetIdInput`], `Option`\<`BN`\>\>

#### unpause

> **unpause**: `InvokeFunction`\<[], `void`\>

#### Overrides

`Contract.functions`

#### Defined in

[packages/props-fuels/src/sway-api/contracts/Props721EditionContractAbi.d.ts:96](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/sway-api/contracts/Props721EditionContractAbi.d.ts#L96)

***

### interface

> **interface**: `Props721EditionContractAbiInterface`

The contract's ABI interface.

#### Overrides

`Contract.interface`

#### Defined in

[packages/props-fuels/src/sway-api/contracts/Props721EditionContractAbi.d.ts:95](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/sway-api/contracts/Props721EditionContractAbi.d.ts#L95)
