[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../globals.md) / CollectionCreateOptions

# Type Alias: CollectionCreateOptions

> **CollectionCreateOptions**: `object`

## Type declaration

### baseUri

> **baseUri**: `string`

The base URI for the collection's token metadata.

### endDate?

> `optional` **endDate**: `number`

The end date for minting tokens in the collection (optional).
Represented as Unix milliseconds (milliseconds since January 1, 1970).

### name

> **name**: `string`

The name of the collection to create.

### options

> **options**: [`CollectionCreateConfigurationOptions`](CollectionCreateConfigurationOptions.md)

The configuration options for the collection creation.

### price?

> `optional` **price**: `number`

The price of tokens in the collection (optional).

### startDate?

> `optional` **startDate**: `number`

The start date for minting tokens in the collection (optional).
Represented as Unix milliseconds (milliseconds since January 1, 1970).

### symbol

> **symbol**: `string`

The symbol of the collection.

## Defined in

[packages/props-fuels/src/common/types/index.ts:120](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/common/types/index.ts#L120)
