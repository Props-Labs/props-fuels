[**octane-fuels-ts**](../README.md) • **Docs**

***

[octane-fuels-ts](../README.md) / EditionManager

# Class: EditionManager

EditionManager

## Classdesc

Manages editions within the Octane SDK on the Fuel network.

## Constructors

### new EditionManager()

> **new EditionManager**(): [`EditionManager`](EditionManager.md)

Creates a new instance of the EditionManager class.

#### Returns

[`EditionManager`](EditionManager.md)

#### Defined in

[edition/edition-manager.ts:13](https://github.com/Props-Labs/octane/blob/bec5a98c4f9e28a3423b8abc950fac2fe7d487bc/packages/octane/src/edition/edition-manager.ts#L13)

## Methods

### create()

> **create**(`name`, `metadata`, `options`): `Promise`\<`string`\>

Creates a new edition.

#### Parameters

• **name**: `string`

The name of the edition to create.

• **metadata**: `NFTMetadata`

The metadata for the edition.

• **options**: `EditionCreateConfigurationOptions` = `defaultEditionCreateConfigurationOptions`

Additional configuration options for creating the edition.

#### Returns

`Promise`\<`string`\>

A promise that resolves to the ID of the created edition.

#### Defined in

[edition/edition-manager.ts:24](https://github.com/Props-Labs/octane/blob/bec5a98c4f9e28a3423b8abc950fac2fe7d487bc/packages/octane/src/edition/edition-manager.ts#L24)

***

### get()

> **get**(`editionId`): `Promise`\<`Edition`\>

Gets the details of a specific edition.

#### Parameters

• **editionId**: `string`

The ID of the edition to retrieve.

#### Returns

`Promise`\<`Edition`\>

A promise that resolves to the edition object.

#### Defined in

[edition/edition-manager.ts:51](https://github.com/Props-Labs/octane/blob/bec5a98c4f9e28a3423b8abc950fac2fe7d487bc/packages/octane/src/edition/edition-manager.ts#L51)

***

### list()

> **list**(): `Promise`\<`Edition`[]\>

Lists all available editions.

#### Returns

`Promise`\<`Edition`[]\>

A promise that resolves to an array of edition objects.

#### Defined in

[edition/edition-manager.ts:40](https://github.com/Props-Labs/octane/blob/bec5a98c4f9e28a3423b8abc950fac2fe7d487bc/packages/octane/src/edition/edition-manager.ts#L40)

***

### mint()

> **mint**(`editionId`, `recipient`): `Promise`\<`string`\>

Mints a new token in a specific edition.

#### Parameters

• **editionId**: `string`

The ID of the edition.

• **recipient**: `string`

The recipient address.

#### Returns

`Promise`\<`string`\>

A promise that resolves to the ID of the minted token.

#### Defined in

[edition/edition-manager.ts:63](https://github.com/Props-Labs/octane/blob/bec5a98c4f9e28a3423b8abc950fac2fe7d487bc/packages/octane/src/edition/edition-manager.ts#L63)

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

[edition/edition-manager.ts:77](https://github.com/Props-Labs/octane/blob/bec5a98c4f9e28a3423b8abc950fac2fe7d487bc/packages/octane/src/edition/edition-manager.ts#L77)
