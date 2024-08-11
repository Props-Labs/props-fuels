# Protocol Incentives

In the Props SDK, protocol incentives are designed to ensure a fair and sustainable ecosystem for all participants. This page provides an overview of the base fee structure and the customizable fees that builders can set when deploying contracts.

## Base Fee

The base fee is a to all mints within the Props SDK. This fee is used to cover the operational costs of the network and ensure its smooth functioning. The base fee is automatically added to each mint.

## Builder Incentives

Builders using the Props SDK have the flexibility to set additional fees that they want to receive from creators deploying contracts. These fees are designed to incentivize builders for their contributions and ensure they are fairly compensated for their work.

### Setting Builder Incentives

When creating an edition, builders can specify the following fee parameters:

- **Builder Fee Address**: The address that will receive the builder fee.
- **Builder Fee**: The fee value in wei on top of the base fee.
- **Builder Revenue Share Address**: The address that will receive the builder revenue share.
- **Builder Revenue Share**: The share value in percentage of the mint price.

### Example

Below is an example of how to set builder fees when creating an edition:

```javascript
const edition: Edition = await propsClient.editions.create({
  name:"Edition 1",
  symbol: "ED1",
  metadata: {
    name: "Edition 1",
    description: "First edition",
    image: "image_url",
  },
  options: {
    owner: wallets[0], // Owner of the edition
    maxSupply: 1000, // defaults to 100 if not set. Value cannot be changed later.,
    builderFeeAddress: '0x1234567890123456789012345678901234567890', // Address to receive the builder fee
    builderFee: 10, // Builder fee value in wei on top of base fee
    builderRevenueShareAddress: '0x1234567890123456789012345678901234567890', // Address to receive the builder revenue share
    builderRevenueShare: 10, // Builder revenue share value in percentage of mint price
  }
});
```

Here the builder sets a fee of 10 wei on top of the base fee and a revenue share of 10% of the mint price.

## Affiliate Incentives

Affiliate fees are an additional type of fee that can be set by builders to reward affiliates who help promote and drive traffic to their editions. These fees are designed to incentivize affiliates for their marketing efforts and ensure they are compensated for their contributions.

### Setting Affiliate Incentives

When creating an edition, builders can specify the following affiliate fee parameters:

- **Affiliate Fee Percentage**: The share value in percentage of the mint price.

### Example

Below is an example of how to set affiliate fees when creating an edition:

```javascript
const edition: Edition = await propsClient.editions.create({
  name:"Edition 1",
  symbol: "ED1",
  metadata: {
    name: "Edition 1",
    description: "First edition",
    image: "image_url",
  },
  options: {
    owner: wallets[0], // Owner of the edition
    maxSupply: 1000, // defaults to 100 if not set. Value cannot be changed later.,
    affiliateFeePercentage: 10, // Affiliate fee value in percentage of mint price
  }
});
```

## Tipping

In addition to the base fee and other configurable fees, minters have the option to give creators a tip. This tip is an additional amount that minters can choose to pay on top of the mint price. The entire tip amount (100%) goes directly to the creator, providing an extra incentive for creators to produce high-quality content.

