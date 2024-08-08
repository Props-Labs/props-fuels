[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / EditionManager

# Class: EditionManager

EditionManager

## Classdesc

Manages editions within the Props SDK on the Fuel network.

## Extends

- `PropsEventEmitter`

## Constructors

### new EditionManager()

> **new EditionManager**(): [`EditionManager`](EditionManager.md)

Creates a new instance of the EditionManager class.

#### Returns

[`EditionManager`](EditionManager.md)

#### Overrides

`PropsEventEmitter.constructor`

#### Defined in

[edition/edition-manager.ts:24](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition-manager.ts#L24)

## Methods

### create()

> **create**(`params`): `Promise`\<[`Edition`](Edition.md)\>

Creates a new edition.

#### Parameters

• **params**: `EditionCreateOptions`

#### Returns

`Promise`\<[`Edition`](Edition.md)\>

A promise that resolves to the ID of the created edition.

#### Defined in

[edition/edition-manager.ts:38](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition-manager.ts#L38)

***

### updateMetadata()

> **updateMetadata**(`editionId`, `metadata`): `Promise`\<`void`\>

Updates the metadata of a specific edition.

#### Parameters

• **editionId**: `string`

The ID of the edition.

• **metadata**: `NFTMetadata`

The new metadata for the edition.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the metadata has been updated.

#### Defined in

[edition/edition-manager.ts:257](https://github.com/Props-Labs/octane/blob/3181d89fe38d99d6e0ad7e818f29246d1dfe1592/packages/props-fuels/src/edition/edition-manager.ts#L257)
