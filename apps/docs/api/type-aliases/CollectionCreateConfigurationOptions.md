[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / CollectionCreateConfigurationOptions

# Type Alias: CollectionCreateConfigurationOptions

> **CollectionCreateConfigurationOptions**: `object`

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

### disableAirdrop?

> `optional` **disableAirdrop**: `boolean`

Flag to disable airdrop functionality (optional). Cannot be changed after deployment.

### maxSupply?

> `optional` **maxSupply**: `number`

The maximum number of tokens that can be minted for the collection. Defaults to unlimited. Cannot be changed after deployment.

### owner

> **owner**: `Account`

The account associated with the collection creation. Cannot be changed after deployment.

## Defined in

[packages/props-fuels/src/common/types/index.ts:135](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/common/types/index.ts#L135)