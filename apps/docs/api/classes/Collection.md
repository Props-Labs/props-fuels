[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / Collection

# Class: Collection

Represents an edition within the Props SDK.

## Constructors

### new Collection()

> **new Collection**(`id`, `contract`?, `account`?, `baseUri`?): [`Collection`](Collection.md)

Creates a new instance of the Collection class.

#### Parameters

• **id**: `string`

The ID of the edition.

• **contract?**: `Props721CollectionContractAbi`

Optional contract associated with the edition.

• **account?**: `Account`

Optional account associated with the edition.

• **baseUri?**: `string`

Base URI for the collection's metadata.

#### Returns

[`Collection`](Collection.md)

#### Defined in

[collection/collection.ts:47](https://github.com/Props-Labs/octane/blob/5ddf1f6ec918b19be1516f349bcbaf667497f240/packages/props-fuels/src/collection/collection.ts#L47)

## Properties

### account?

> `optional` **account**: `Account`

Optional account associated with the edition.

#### Defined in

[collection/collection.ts:26](https://github.com/Props-Labs/octane/blob/5ddf1f6ec918b19be1516f349bcbaf667497f240/packages/props-fuels/src/collection/collection.ts#L26)

***

### baseUri?

> `optional` **baseUri**: `string`

The base URI for the collection's metadata.

#### Defined in

[collection/collection.ts:32](https://github.com/Props-Labs/octane/blob/5ddf1f6ec918b19be1516f349bcbaf667497f240/packages/props-fuels/src/collection/collection.ts#L32)

***

### contract?

> `optional` **contract**: `Props721CollectionContractAbi`

Optional contract associated with the edition.

#### Defined in

[collection/collection.ts:20](https://github.com/Props-Labs/octane/blob/5ddf1f6ec918b19be1516f349bcbaf667497f240/packages/props-fuels/src/collection/collection.ts#L20)

***

### id

> **id**: `string`

The ID of the edition.

#### Defined in

[collection/collection.ts:14](https://github.com/Props-Labs/octane/blob/5ddf1f6ec918b19be1516f349bcbaf667497f240/packages/props-fuels/src/collection/collection.ts#L14)

***

### sampleTokens

> **sampleTokens**: `NFTMetadata`[] = `[]`

Sample tokens of the collection.

#### Defined in

[collection/collection.ts:38](https://github.com/Props-Labs/octane/blob/5ddf1f6ec918b19be1516f349bcbaf667497f240/packages/props-fuels/src/collection/collection.ts#L38)

## Methods

### connect()

> **connect**(`account`): `void`

Connects an account to the edition, replacing the current account.

#### Parameters

• **account**: `Account`

The account to connect.

#### Returns

`void`

#### Defined in

[collection/collection.ts:86](https://github.com/Props-Labs/octane/blob/5ddf1f6ec918b19be1516f349bcbaf667497f240/packages/props-fuels/src/collection/collection.ts#L86)

***

### fetchSampleTokens()

> **fetchSampleTokens**(): `Promise`\<`NFTMetadata`[]\>

Fetches sample tokens from the baseUri.

#### Returns

`Promise`\<`NFTMetadata`[]\>

#### Defined in

[collection/collection.ts:63](https://github.com/Props-Labs/octane/blob/5ddf1f6ec918b19be1516f349bcbaf667497f240/packages/props-fuels/src/collection/collection.ts#L63)

***

### mint()

> **mint**(`to`, `amount`, `affiliate`?): `Promise`\<`Error` \| [`MintResult`](../type-aliases/MintResult.md)\>

Mints a specified amount of tokens to a given address.

#### Parameters

• **to**: `string`

The address to mint tokens to.

• **amount**: `number`

The amount of tokens to mint.

• **affiliate?**: `string`

#### Returns

`Promise`\<`Error` \| [`MintResult`](../type-aliases/MintResult.md)\>

A promise that resolves when the tokens have been minted.

#### Throws

If the minting process fails.

#### Defined in

[collection/collection.ts:97](https://github.com/Props-Labs/octane/blob/5ddf1f6ec918b19be1516f349bcbaf667497f240/packages/props-fuels/src/collection/collection.ts#L97)

***

### fromContractIdAndWallet()

> `static` **fromContractIdAndWallet**(`contractId`, `wallet`): `Promise`\<[`Collection`](Collection.md)\>

Static method to create an Collection instance based on a contractId and a wallet.

#### Parameters

• **contractId**: `string`

The ID of the contract.

• **wallet**: `Account`

The wallet to connect.

#### Returns

`Promise`\<[`Collection`](Collection.md)\>

A promise that resolves to an Collection instance.

#### Defined in

[collection/collection.ts:156](https://github.com/Props-Labs/octane/blob/5ddf1f6ec918b19be1516f349bcbaf667497f240/packages/props-fuels/src/collection/collection.ts#L156)
