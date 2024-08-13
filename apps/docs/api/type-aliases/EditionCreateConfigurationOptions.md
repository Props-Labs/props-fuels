[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../globals.md) / EditionCreateConfigurationOptions

# Type Alias: EditionCreateConfigurationOptions

> **EditionCreateConfigurationOptions**: `object`

## Type declaration

### affiliateFeePercentage?

> `optional` **affiliateFeePercentage**: `number`

The percentage of the affiliate fee (optional). Cannot be changed after deployment.

### builderFee?

> `optional` **builderFee**: `number`

The percentage of the builder fee (optional). Cannot be changed after deployment.

### builderFeeAddress?

> `optional` **builderFeeAddress**: `string`

The address where the builder fee will be sent (optional). Cannot be changed after deployment.

### builderRevenueShareAddress?

> `optional` **builderRevenueShareAddress**: `string`

The address where the builder's revenue share will be sent (optional). Cannot be changed after deployment.

### builderRevenueSharePercentage?

> `optional` **builderRevenueSharePercentage**: `number`

The percentage of the builder's revenue share (optional). Cannot be changed after deployment.

### maxSupply?

> `optional` **maxSupply**: `number`

The maximum number of tokens that can be minted for the edition. Defaults to 3. Cannot be changed after deployment.

### owner

> **owner**: `Account`

The account associated with the edition creation. Cannot be changed after deployment.

## Defined in

[packages/props-fuels/src/common/types/index.ts:89](https://github.com/Props-Labs/octane/blob/09e744f342f4ccab903046cdb8054688422ab64d/packages/props-fuels/src/common/types/index.ts#L89)
