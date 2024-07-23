[**octane**](../README.md) • **Docs**

***

[octane](../README.md) / EditionManager

# Class: EditionManager

EditionManager

## Classdesc

EditionManager is responsible for managing different editions within the Octane SDK.

## Methods

### create()

> **create**(`name`, `config`): `Promise`\<`object`\>

Creates a new edition.

#### Parameters

• **name**: `string`

The name of the edition to create.

• **config**: `object`

The configuration object for the edition.

#### Returns

`Promise`\<`object`\>

A promise that resolves to the created edition object.

#### Defined in

edition/edition-manager.ts:14

***

### get()

> **get**(`id`): `Promise`\<`object`\>

Gets the details of a specific edition.

#### Parameters

• **id**: `string`

The ID of the edition to retrieve.

#### Returns

`Promise`\<`object`\>

A promise that resolves to the edition object.

#### Defined in

edition/edition-manager.ts:33

***

### list()

> **list**(): `Promise`\<`object`[]\>

Lists all available editions.

#### Returns

`Promise`\<`object`[]\>

A promise that resolves to an array of edition objects.

#### Defined in

edition/edition-manager.ts:23
