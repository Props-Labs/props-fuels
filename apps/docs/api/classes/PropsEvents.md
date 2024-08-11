[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / PropsEvents

# Class: PropsEvents

PropsEvents

## Classdesc

Singleton class to manage event states within the application.

## Properties

### completed

> **completed**: `string` = `"completed"`

Event state indicating a completed status.

#### Defined in

[packages/props-fuels/src/core/events.ts:33](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L33)

***

### error

> **error**: `string` = `"error"`

Event state indicating an error status.

#### Defined in

[packages/props-fuels/src/core/events.ts:40](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L40)

***

### initialized

> **initialized**: `string` = `"initialized"`

Event state indicating an initialized status.

#### Defined in

[packages/props-fuels/src/core/events.ts:47](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L47)

***

### paused

> **paused**: `string` = `"paused"`

Event state indicating a paused status.

#### Defined in

[packages/props-fuels/src/core/events.ts:54](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L54)

***

### pending

> **pending**: `string` = `"pending"`

Event state indicating a waiting status.

#### Defined in

[packages/props-fuels/src/core/events.ts:26](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L26)

***

### transaction

> **transaction**: `string` = `"transaction"`

Event state indicating a transaction that requires approval.

#### Defined in

[packages/props-fuels/src/core/events.ts:19](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L19)

***

### unpaused

> **unpaused**: `string` = `"unpaused"`

Event state indicating an unpaused status.

#### Defined in

[packages/props-fuels/src/core/events.ts:61](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L61)

## Methods

### getInstance()

> `static` **getInstance**(): [`PropsEvents`](PropsEvents.md)

Retrieves the single instance of the PropsEvents class.

#### Returns

[`PropsEvents`](PropsEvents.md)

The singleton instance of the PropsEvents class.

#### Static

#### Defined in

[packages/props-fuels/src/core/events.ts:77](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/core/events.ts#L77)
