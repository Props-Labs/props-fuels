[**@props-labs/fuels**](../README.md) • **Docs**

***

[@props-labs/fuels](../globals.md) / CollectionManager

# Class: CollectionManager

CollectionManager

## Classdesc

Manages collections within the Props SDK on the Fuel network.

## Extends

- `PropsContractManager`

## Constructors

### new CollectionManager()

> **new CollectionManager**(): [`CollectionManager`](CollectionManager.md)

Creates a new instance of the CollectionManager class.

#### Returns

[`CollectionManager`](CollectionManager.md)

#### Overrides

`PropsContractManager.constructor`

#### Defined in

[packages/props-fuels/src/collection/collection-manager.ts:23](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/collection/collection-manager.ts#L23)

## Properties

### events

> **events**: [`PropsEvents`](PropsEvents.md)

#### Inherited from

`PropsContractManager.events`

#### Defined in

packages/props-fuels/src/contract/contract-manager.ts:8

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

[packages/props-fuels/src/collection/collection-manager.ts:33](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/collection/collection-manager.ts#L33)

***

### emit()

> **emit**(`event`, ...`args`): `void`

#### Parameters

• **event**: `string`

• ...**args**: `any`[]

#### Returns

`void`

#### Inherited from

`PropsContractManager.emit`

#### Defined in

[packages/props-fuels/src/core/events.ts:95](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/events.ts#L95)

***

### list()

> **list**(`owner`, `network`): `Promise`\<[`Collection`](Collection.md)[]\>

#### Parameters

• **owner**: `Account`

• **network**: [`Network`](../type-aliases/Network.md) = `defaultNetwork`

#### Returns

`Promise`\<[`Collection`](Collection.md)[]\>

#### Defined in

[packages/props-fuels/src/collection/collection-manager.ts:130](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/collection/collection-manager.ts#L130)

***

### on()

> **on**(`event`, `listener`): `void`

#### Parameters

• **event**: `string`

• **listener**

#### Returns

`void`

#### Inherited from

`PropsContractManager.on`

#### Defined in

[packages/props-fuels/src/core/events.ts:88](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/events.ts#L88)

***

### removeAllListeners()

> **removeAllListeners**(`event`?): `void`

#### Parameters

• **event?**: `string`

#### Returns

`void`

#### Inherited from

`PropsContractManager.removeAllListeners`

#### Defined in

[packages/props-fuels/src/core/events.ts:109](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/events.ts#L109)

***

### removeListener()

> **removeListener**(`event`, `listener`): `void`

#### Parameters

• **event**: `string`

• **listener**

#### Returns

`void`

#### Inherited from

`PropsContractManager.removeListener`

#### Defined in

[packages/props-fuels/src/core/events.ts:101](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/events.ts#L101)
