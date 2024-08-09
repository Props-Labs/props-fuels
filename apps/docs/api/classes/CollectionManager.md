[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / CollectionManager

# Class: CollectionManager

CollectionManager

## Classdesc

Manages collections within the Props SDK on the Fuel network.

## Extends

- [`PropsEventEmitter`](PropsEventEmitter.md)

## Constructors

### new CollectionManager()

> **new CollectionManager**(): [`CollectionManager`](CollectionManager.md)

Creates a new instance of the CollectionManager class.

#### Returns

[`CollectionManager`](CollectionManager.md)

#### Overrides

[`PropsEventEmitter`](PropsEventEmitter.md).[`constructor`](PropsEventEmitter.md#constructors)

#### Defined in

[packages/props-fuels/src/collection/collection-manager.ts:24](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/collection/collection-manager.ts#L24)

## Methods

### create()

> **create**(`params`): `Promise`\<[`Collection`](Collection.md)\>

Creates a new collection.

#### Parameters

• **params**: [`CollectionCreateOptions`](../type-aliases/CollectionCreateOptions.md)

Additional configuration options for creating the collection.

#### Returns

`Promise`\<[`Collection`](Collection.md)\>

A promise that resolves to the ID of the created collection.

#### Defined in

[packages/props-fuels/src/collection/collection-manager.ts:35](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/collection/collection-manager.ts#L35)

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

> **list**(`owner`, `network`): `Promise`\<[`Collection`](Collection.md)[]\>

#### Parameters

• **owner**: `Account`

• **network**: [`Network`](../type-aliases/Network.md) = `defaultNetwork`

#### Returns

`Promise`\<[`Collection`](Collection.md)[]\>

#### Defined in

[packages/props-fuels/src/collection/collection-manager.ts:118](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/collection/collection-manager.ts#L118)

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
