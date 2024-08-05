# Editions Overview

Editions in the Props SDK represent a limited supply serial edition of a token. Each edition has a unique identifier, a name, and associated metadata. The metadata includes details such as the name, description, and image URL of the NFT. The metadata follows the standard equivalent of the ERC721 metadata as defined by [Opensea Standards](https://docs.opensea.io/docs/metadata-standards).

## Creating an Edition

To create an edition, you need to use the `create` method of the `edition` object in the `Octane` SDK. Below is a guide on how to create an edition.

Use the `create` method to create a new edition. You need to provide the name of the edition and its metadata.

### Basic Example

```javascript
const edition: Edition = await propsClient.edition.create({
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
  }
});
```

### Advanced Example

The advanced example below demonstrates how to create an edition with additional parameters such as builder fee and revenue share.
The `builderFeeAddress` is the address that will receive the builder fee, and `builderFee` is the fee value in wei on top of the base fee.
The `builderRevenueShareAddress` is the address that will receive the builder revenue share, and `builderRevenueShare` is the share value in percentage of the mint price.

```javascript
const edition: Edition = await propsClient.edition.create({
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

## Minting Tokens from an Edition

To mint tokens, you need to use the `mint` method of the `Edition` class. Below is a guide on how to mint tokens from an edition.

```javascript
import { Wallet } from 'fuels';
import { PropsSDK, Edition } from '@props/fuels';

const editionId = '0x1234567890123456789012345678901234567890' // Edition ID aka Contract ID

const propsClient = new PropsSDK({
  network: 'testnet',
});

const edition:Edition = await propsClient.edition.get(editionId);

const wallet = new Wallet('private_key');
edition.connect(wallet);

await edition.mint('0x1234567890123456789012345678901234567890', 10);
```

## Listing Editions 

To list editions, you need to use the `list` method of the `edition` object in the `Octane` SDK. Below is a guide on how to list editions.

```javascript
const editions: Edition[] = await propsClient.edition.list();
```

## Editions API Reference

For more detailed information on the full API, please refer to the [API documentation here](/api/README.html).

