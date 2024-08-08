[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / Edition

# Class: Edition

Represents an edition within the Props SDK.

## Constructors

### new Edition()

> **new Edition**(`id`, `contract`?, `account`?, `metadata`?): [`Edition`](Edition.md)

Creates a new instance of the Edition class.

#### Parameters

• **id**: `string`

The ID of the edition.

• **contract?**: `Props721EditionContractAbi`

Optional contract associated with the edition.

• **account?**: `Account`

Optional account associated with the edition.

• **metadata?**: `NFTMetadata`

Metadata associated with the edition.

#### Returns

[`Edition`](Edition.md)

#### Defined in

[edition/edition.ts:42](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition.ts#L42)

## Properties

### account?

> `optional` **account**: `Account`

Optional account associated with the edition.

#### Defined in

[edition/edition.ts:27](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition.ts#L27)

***

### contract?

> `optional` **contract**: `Props721EditionContractAbi`

Optional contract associated with the edition.

#### Defined in

[edition/edition.ts:21](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition.ts#L21)

***

### id

> **id**: `string`

The ID of the edition.

#### Defined in

[edition/edition.ts:15](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition.ts#L15)

***

### metadata?

> `optional` **metadata**: `NFTMetadata`

Metadata associated with the edition.

#### Defined in

[edition/edition.ts:33](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition.ts#L33)

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

[edition/edition.ts:58](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition.ts#L58)

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

[edition/edition.ts:69](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition.ts#L69)

***

### fromContractIdAndWallet()

> `static` **fromContractIdAndWallet**(`contractId`, `wallet`): `Promise`\<[`Edition`](Edition.md)\>

Static method to create an Edition instance based on a contractId and a wallet.

#### Parameters

• **contractId**: `string`

The ID of the contract.

• **wallet**: `Account`

The wallet to connect.

#### Returns

`Promise`\<[`Edition`](Edition.md)\>

A promise that resolves to an Edition instance.

#### Defined in

[edition/edition.ts:128](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition.ts#L128)
