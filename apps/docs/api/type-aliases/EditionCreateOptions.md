[**@props-labs/fuels**](../README.md) • **Docs**

***

[@props-labs/fuels](../globals.md) / EditionCreateOptions

# Type Alias: EditionCreateOptions

> **EditionCreateOptions**: `object`

## Type declaration

### endDate?

> `optional` **endDate**: `number`

The end date for minting tokens in the edition, in Unix milliseconds (optional).

### metadata

> **metadata**: [`NFTMetadata`](NFTMetadata.md)

The metadata for the edition.

### name

> **name**: `string`

The name of the edition to create.

### options

> **options**: [`EditionCreateConfigurationOptions`](EditionCreateConfigurationOptions.md)

The configuration options for the edition creation.

### price?

> `optional` **price**: `number`

The price of the edition on the Base Asset (Wei, ETH).

### startDate?

> `optional` **startDate**: `number`

The start date for minting tokens in the edition, in Unix milliseconds (optional).

### symbol

> **symbol**: `string`

The symbol of the edition to create.

## Defined in

[packages/props-fuels/src/common/types/index.ts:58](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/common/types/index.ts#L58)
