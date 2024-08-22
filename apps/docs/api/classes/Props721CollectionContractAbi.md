[**@props-labs/fuels**](../README.md) • **Docs**

***

[@props-labs/fuels](../globals.md) / Props721CollectionContractAbi

# Class: Props721CollectionContractAbi

## Extends

- `default`

## Constructors

### new Props721CollectionContractAbi()

> **new Props721CollectionContractAbi**(`id`, `abi`, `accountOrProvider`): [`Props721CollectionContractAbi`](Props721CollectionContractAbi.md)

Creates an instance of the Contract class.

#### Parameters

• **id**: `string` \| `AbstractAddress`

The contract's address.

• **abi**: `JsonAbi` \| `Interface`\<`JsonAbi`\>

The contract's ABI (JSON ABI or Interface instance).

• **accountOrProvider**: `Account` \| `Provider`

The account or provider for interaction.

#### Returns

[`Props721CollectionContractAbi`](Props721CollectionContractAbi.md)

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

#### base\_uri

> **base\_uri**: `InvokeFunction`\<[], `Option`\<`string`\>\>

#### burn

> **burn**: `InvokeFunction`\<[`string`, `BigNumberish`], `void`\>

#### constructor

> **constructor**: `InvokeFunction`\<[`IdentityInput`, `string`, `string`, `string`, `BigNumberish`, `BigNumberish`, `BigNumberish`], `void`\>

#### decimals

> **decimals**: `InvokeFunction`\<[`AssetIdInput`], `Option`\<`number`\>\>

#### end\_date

> **end\_date**: `InvokeFunction`\<[], `Option`\<`BN`\>\>

#### fees

> **fees**: `InvokeFunction`\<[], `Option`\<[`BN`, `BN`]\>\>

#### is\_paused

> **is\_paused**: `InvokeFunction`\<[], `boolean`\>

#### merkle\_root

> **merkle\_root**: `InvokeFunction`\<[], `Option`\<`string`\>\>

#### merkle\_uri

> **merkle\_uri**: `InvokeFunction`\<[], `Option`\<`string`\>\>

#### metadata

> **metadata**: `InvokeFunction`\<[`AssetIdInput`, `string`], `Option`\<`MetadataOutput`\>\>

#### mint

> **mint**: `InvokeFunction`\<[`IdentityInput`, `string`, `BigNumberish`, `Option`\<`IdentityInput`\>, `Option`\<`Vec`\<`string`\>\>, `Option`\<`BigNumberish`\>, `Option`\<`BigNumberish`\>, `Option`\<`BigNumberish`\>], `void`\>

#### name

> **name**: `InvokeFunction`\<[`AssetIdInput`], `Option`\<`string`\>\>

#### owner

> **owner**: `InvokeFunction`\<[], `StateOutput`\>

#### pause

> **pause**: `InvokeFunction`\<[], `void`\>

#### price

> **price**: `InvokeFunction`\<[], `Option`\<`BN`\>\>

#### set\_base\_uri

> **set\_base\_uri**: `InvokeFunction`\<[`string`], `void`\>

#### set\_dates

> **set\_dates**: `InvokeFunction`\<[`BigNumberish`, `BigNumberish`], `void`\>

#### set\_merkle

> **set\_merkle**: `InvokeFunction`\<[`string`, `string`], `void`\>

#### set\_merkle\_root

> **set\_merkle\_root**: `InvokeFunction`\<[`string`], `void`\>

#### set\_price

> **set\_price**: `InvokeFunction`\<[`BigNumberish`], `void`\>

#### start\_date

> **start\_date**: `InvokeFunction`\<[], `Option`\<`BN`\>\>

#### symbol

> **symbol**: `InvokeFunction`\<[`AssetIdInput`], `Option`\<`string`\>\>

#### total\_assets

> **total\_assets**: `InvokeFunction`\<[], `BN`\>

#### total\_price

> **total\_price**: `InvokeFunction`\<[], `Option`\<`BN`\>\>

#### total\_supply

> **total\_supply**: `InvokeFunction`\<[`AssetIdInput`], `Option`\<`BN`\>\>

#### unpause

> **unpause**: `InvokeFunction`\<[], `void`\>

#### Overrides

`Contract.functions`

#### Defined in

[packages/props-fuels/src/sway-api/contracts/Props721CollectionContractAbi.d.ts:102](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/sway-api/contracts/Props721CollectionContractAbi.d.ts#L102)

***

### interface

> **interface**: `Props721CollectionContractAbiInterface`

The contract's ABI interface.

#### Overrides

`Contract.interface`

#### Defined in

[packages/props-fuels/src/sway-api/contracts/Props721CollectionContractAbi.d.ts:101](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/sway-api/contracts/Props721CollectionContractAbi.d.ts#L101)
