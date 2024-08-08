[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / CollectionManager

# Class: CollectionManager

CollectionManager

## Classdesc

Manages collections within the Props SDK on the Fuel network.

## Extends

- `PropsEventEmitter`

## Constructors

### new CollectionManager()

> **new CollectionManager**(): [`CollectionManager`](CollectionManager.md)

Creates a new instance of the CollectionManager class.

#### Returns

[`CollectionManager`](CollectionManager.md)

#### Overrides

`PropsEventEmitter.constructor`

#### Defined in

[collection/collection-manager.ts:24](https://github.com/Props-Labs/octane/blob/dc41ebab04c3883347eca767c4166cea04688b60/packages/props-fuels/src/collection/collection-manager.ts#L24)

## Methods

### create()

> **create**(`params`): `Promise`\<[`Collection`](Collection.md)\>

Creates a new collection.

#### Parameters

• **params**: `CollectionCreateOptions`

#### Returns

`Promise`\<[`Collection`](Collection.md)\>

A promise that resolves to the ID of the created collection.

#### Defined in

[collection/collection-manager.ts:38](https://github.com/Props-Labs/octane/blob/dc41ebab04c3883347eca767c4166cea04688b60/packages/props-fuels/src/collection/collection-manager.ts#L38)
