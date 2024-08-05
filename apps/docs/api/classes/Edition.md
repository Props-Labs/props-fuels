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

[edition/edition.ts:40](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/edition/edition.ts#L40)

## Properties

### account?

> `optional` **account**: `Account`

Optional account associated with the edition.

#### Defined in

[edition/edition.ts:25](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/edition/edition.ts#L25)

***

### contract?

> `optional` **contract**: `Props721EditionContractAbi`

Optional contract associated with the edition.

#### Defined in

[edition/edition.ts:19](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/edition/edition.ts#L19)

***

### id

> **id**: `string`

The ID of the edition.

#### Defined in

[edition/edition.ts:13](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/edition/edition.ts#L13)

***

### metadata?

> `optional` **metadata**: `NFTMetadata`

Metadata associated with the edition.

#### Defined in

[edition/edition.ts:31](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/edition/edition.ts#L31)

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

[edition/edition.ts:56](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/edition/edition.ts#L56)

***

### mint()

> **mint**(`to`, `amount`, `affiliate`?): `Promise`\<`Error` \| [`EditionMintResult`](../type-aliases/EditionMintResult.md)\>

Mints a specified amount of tokens to a given address.

#### Parameters

• **to**: `string`

The address to mint tokens to.

• **amount**: `number`

The amount of tokens to mint.

• **affiliate?**: `string`

#### Returns

`Promise`\<`Error` \| [`EditionMintResult`](../type-aliases/EditionMintResult.md)\>

A promise that resolves when the tokens have been minted.

#### Throws

If the minting process fails.

#### Defined in

[edition/edition.ts:67](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/edition/edition.ts#L67)
