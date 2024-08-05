[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / PropsSDK

# Class: PropsSDK

Props

## Classdesc

Props is the core class for the Props SDK, providing essential functionalities to interact with the Fuel network.

## Constructors

### new PropsSDK()

> **new PropsSDK**(`options`): [`PropsSDK`](PropsSDK.md)

Creates an instance of Props SDK.

#### Parameters

• **options**: `PropsConfigurationOptions`

The configuration options for Props SDK.

#### Returns

[`PropsSDK`](PropsSDK.md)

#### Defined in

[core/core.ts:23](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/core/core.ts#L23)

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

[core/core.ts:70](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/core/core.ts#L70)

***

### getNetwork()

> **getNetwork**(): `Network`

Returns the network configuration.

#### Returns

`Network`

The network configuration.

#### Defined in

[core/core.ts:61](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/core/core.ts#L61)
