[**@props-labs/fuels**](../README.md) • **Docs**

***

[@props-labs/fuels](../globals.md) / Edition

# Class: Edition

Represents an edition within the Props SDK.

## Extends

- `PropsContract`

## Constructors

### new Edition()

> **new Edition**(`id`, `contract`?, `account`?, `metadata`?): [`Edition`](Edition.md)

Creates a new instance of the Edition class.

#### Parameters

• **id**: `string`

The ID of the edition.

• **contract?**: [`Props721EditionContractAbi`](Props721EditionContractAbi.md)

Optional contract associated with the edition.

• **account?**: `Account`

Optional account associated with the edition.

• **metadata?**: [`NFTMetadata`](../type-aliases/NFTMetadata.md)

Metadata associated with the edition.

#### Returns

[`Edition`](Edition.md)

#### Overrides

`PropsContract.constructor`

#### Defined in

[packages/props-fuels/src/edition/edition.ts:25](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/edition/edition.ts#L25)

## Properties

### account?

> `optional` **account**: `Account`

Optional account associated with the contract.

#### Inherited from

`PropsContract.account`

#### Defined in

packages/props-fuels/src/contract/contract.ts:23

***

### contract?

> `optional` **contract**: [`Props721EditionContractAbi`](Props721EditionContractAbi.md) \| [`Props721CollectionContractAbi`](Props721CollectionContractAbi.md)

Optional contract associated with the contract.

#### Inherited from

`PropsContract.contract`

#### Defined in

packages/props-fuels/src/contract/contract.ts:18

***

### id

> **id**: `string`

The ID of the contract.

#### Inherited from

`PropsContract.id`

#### Defined in

packages/props-fuels/src/contract/contract.ts:13

***

### metadata?

> `optional` **metadata**: [`NFTMetadata`](../type-aliases/NFTMetadata.md)

Metadata associated with the edition.

#### Defined in

[packages/props-fuels/src/edition/edition.ts:16](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/edition/edition.ts#L16)

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

[packages/props-fuels/src/edition/edition.ts:39](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/edition/edition.ts#L39)

***

### getAllowlistAllocationByAddress()

> **getAllowlistAllocationByAddress**(`address`): `Promise`\<`number`\>

Represents the allowlist allocation for an address.

#### Parameters

• **address**: `string`

The address to get the allocation for.

#### Returns

`Promise`\<`number`\>

A promise that resolves to the allocation amount for the address.

#### Throws

If the contract or account is not connected, or if the fetch or JSON parsing fails.

#### Inherited from

`PropsContract.getAllowlistAllocationByAddress`

#### Defined in

packages/props-fuels/src/contract/contract.ts:124

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

[packages/props-fuels/src/edition/edition.ts:50](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/edition/edition.ts#L50)

***

### setAllowlist()

> **setAllowlist**(`root`, `uri`): `Promise`\<`void`\>

Sets the allowlist for the contract by setting the Merkle root and URI.

#### Parameters

• **root**: `string`

The Merkle root to set.

• **uri**: `string`

The Merkle URI to set.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the allowlist has been set.

#### Throws

If the contract or account is not connected, or if the set_merkle function fails.

#### Inherited from

`PropsContract.setAllowlist`

#### Defined in

packages/props-fuels/src/contract/contract.ts:60

***

### createAllowlist()

> `static` **createAllowlist**(`entries`): `object`

Creates an allowlist for a given set of addresses and amounts.

#### Parameters

• **entries**: [`AllowListInput`](../type-aliases/AllowListInput.md)

The entries to include in the allowlist.

#### Returns

`object`

An object containing the Merkle root and the allowlist with proofs.

##### allowlist

> **allowlist**: [`Allowlist`](../type-aliases/Allowlist.md)

##### root

> **root**: `string`

#### Inherited from

`PropsContract.createAllowlist`

#### Defined in

packages/props-fuels/src/contract/contract.ts:46

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

[packages/props-fuels/src/edition/edition.ts:132](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/edition/edition.ts#L132)
