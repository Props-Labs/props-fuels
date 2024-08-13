[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../globals.md) / PropsSDK

# Class: PropsSDK

Props

## Classdesc

Props is the core class for the Props SDK, providing essential functionalities to interact with the Fuel network.

## Constructors

### new PropsSDK()

> **new PropsSDK**(`options`): [`PropsSDK`](PropsSDK.md)

Creates an instance of Props SDK.

#### Parameters

• **options**: [`PropsConfigurationOptions`](../type-aliases/PropsConfigurationOptions.md)

The configuration options for Props SDK.

#### Returns

[`PropsSDK`](PropsSDK.md)

#### Defined in

[packages/props-fuels/src/core/core.ts:25](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/core.ts#L25)

## Properties

### collections

> **collections**: [`CollectionManager`](CollectionManager.md)

#### Defined in

[packages/props-fuels/src/core/core.ts:14](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/core.ts#L14)

***

### editions

> **editions**: [`EditionManager`](EditionManager.md)

#### Defined in

[packages/props-fuels/src/core/core.ts:13](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/core.ts#L13)

***

### events

> **events**: [`PropsEvents`](PropsEvents.md)

#### Defined in

[packages/props-fuels/src/core/core.ts:15](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/core.ts#L15)

***

### utils

> **utils**: `PropsUtilities`

#### Defined in

[packages/props-fuels/src/core/core.ts:16](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/core.ts#L16)

## Methods

### getHealth()

> **getHealth**(): `Promise`\<`any`\>

Checks the health of the currently connected Fuel network API.

#### Returns

`Promise`\<`any`\>

A promise that resolves to the health status of the network.

#### Throws

If the GraphQL URL is not available for the current network.

#### Defined in

[packages/props-fuels/src/core/core.ts:88](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/core.ts#L88)

***

### getNetwork()

> **getNetwork**(): [`Network`](../type-aliases/Network.md)

Returns the network configuration.

#### Returns

[`Network`](../type-aliases/Network.md)

The network configuration.

#### Defined in

[packages/props-fuels/src/core/core.ts:79](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/core/core.ts#L79)
