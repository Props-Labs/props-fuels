[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / EditionManager

# Class: EditionManager

EditionManager

## Classdesc

Manages editions within the Props SDK on the Fuel network.

## Extends

- [`PropsEventEmitter`](PropsEventEmitter.md)

## Constructors

### new EditionManager()

> **new EditionManager**(): [`EditionManager`](EditionManager.md)

Creates a new instance of the EditionManager class.

#### Returns

[`EditionManager`](EditionManager.md)

#### Overrides

[`PropsEventEmitter`](PropsEventEmitter.md).[`constructor`](PropsEventEmitter.md#constructors)

#### Defined in

[packages/props-fuels/src/edition/edition-manager.ts:24](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/edition/edition-manager.ts#L24)

## Methods

### create()

> **create**(`params`): `Promise`\<[`Edition`](Edition.md)\>

Creates a new edition.

#### Parameters

• **params**: [`EditionCreateOptions`](../type-aliases/EditionCreateOptions.md)

Additional configuration options for creating the edition.

#### Returns

`Promise`\<[`Edition`](Edition.md)\>

A promise that resolves to the ID of the created edition.

#### Defined in

[packages/props-fuels/src/edition/edition-manager.ts:35](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/edition/edition-manager.ts#L35)

***

### emit()

> **emit**(`event`, ...`args`): `void`

#### Parameters

• **event**: `string`

• ...**args**: `any`[]

#### Returns

`void`

#### Inherited from

[`PropsEventEmitter`](PropsEventEmitter.md).[`emit`](PropsEventEmitter.md#emit)

#### Defined in

[packages/props-fuels/src/core/events.ts:95](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L95)

***

### list()

> **list**(`owner`, `network`): `Promise`\<[`Edition`](Edition.md)[]\>

#### Parameters

• **owner**: `Account`

• **network**: [`Network`](../type-aliases/Network.md) = `defaultNetwork`

#### Returns

`Promise`\<[`Edition`](Edition.md)[]\>

#### Defined in

[packages/props-fuels/src/edition/edition-manager.ts:127](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/edition/edition-manager.ts#L127)

***

### on()

> **on**(`event`, `listener`): `void`

#### Parameters

• **event**: `string`

• **listener**

#### Returns

`void`

#### Inherited from

[`PropsEventEmitter`](PropsEventEmitter.md).[`on`](PropsEventEmitter.md#on)

#### Defined in

[packages/props-fuels/src/core/events.ts:88](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L88)

***

### removeAllListeners()

> **removeAllListeners**(`event`?): `void`

#### Parameters

• **event?**: `string`

#### Returns

`void`

#### Inherited from

[`PropsEventEmitter`](PropsEventEmitter.md).[`removeAllListeners`](PropsEventEmitter.md#removealllisteners)

#### Defined in

[packages/props-fuels/src/core/events.ts:109](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L109)

***

### removeListener()

> **removeListener**(`event`, `listener`): `void`

#### Parameters

• **event**: `string`

• **listener**

#### Returns

`void`

#### Inherited from

[`PropsEventEmitter`](PropsEventEmitter.md).[`removeListener`](PropsEventEmitter.md#removelistener)

#### Defined in

[packages/props-fuels/src/core/events.ts:101](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L101)

***

### updateMetadata()

> **updateMetadata**(`editionId`, `metadata`): `Promise`\<`void`\>

Updates the metadata of a specific edition.

#### Parameters

• **editionId**: `string`

The ID of the edition.

• **metadata**: [`NFTMetadata`](../type-aliases/NFTMetadata.md)

The new metadata for the edition.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the metadata has been updated.

#### Defined in

[packages/props-fuels/src/edition/edition-manager.ts:254](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/edition/edition-manager.ts#L254)
