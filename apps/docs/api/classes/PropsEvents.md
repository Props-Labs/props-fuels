[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / PropsEvents

# Class: PropsEvents

PropsEvents

## Classdesc

Singleton class to manage event states within the application.

## Properties

### completed

> **completed**: `string` = `'completed'`

Event state indicating a completed status.

#### Defined in

[core/events.ts:26](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/core/events.ts#L26)

***

### error

> **error**: `string` = `'error'`

Event state indicating an error status.

#### Defined in

[core/events.ts:33](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/core/events.ts#L33)

***

### initialized

> **initialized**: `string` = `'initialized'`

Event state indicating an initialized status.

#### Defined in

[core/events.ts:40](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/core/events.ts#L40)

***

### paused

> **paused**: `string` = `'paused'`

Event state indicating a paused status.

#### Defined in

[core/events.ts:47](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/core/events.ts#L47)

***

### unpaused

> **unpaused**: `string` = `'unpaused'`

Event state indicating an unpaused status.

#### Defined in

[core/events.ts:54](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/core/events.ts#L54)

***

### waiting

> **waiting**: `string` = `'waiting'`

Event state indicating a waiting status.

#### Defined in

[core/events.ts:19](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/core/events.ts#L19)

## Methods

### getInstance()

> `static` **getInstance**(): [`PropsEvents`](PropsEvents.md)

Retrieves the single instance of the PropsEvents class.

#### Returns

[`PropsEvents`](PropsEvents.md)

The singleton instance of the PropsEvents class.

#### Static

#### Defined in

[core/events.ts:70](https://github.com/Props-Labs/octane/blob/3439272d529585517ec5968207e32eb74df3d6b8/packages/props-fuels/src/core/events.ts#L70)
