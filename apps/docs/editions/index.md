# Editions Overview

Editions in the Props SDK represent a limited supply serial edition of a token. Each edition has a unique identifier, a name, and associated metadata stored on-chain. The metadata includes details such as the name, description, and image URL of the NFT. The metadata follows the standard equivalent of the ERC721 metadata as defined by [Opensea Standards](https://docs.opensea.io/docs/metadata-standards).

## Creating an Edition

To create an edition, you need to use the `create` method of the `edition` object in the `PropsSDK` SDK. Below is a guide on how to create an edition.

Use the `create` method to create a new edition. You need to provide the name of the edition and its metadata.

> **Note:** Due to how contracts on Fuel work, creating an Edition requires 2 transactions. The first transaction creates the edition contract, and the second transaction initializes ownership and sets metadata.

### Basic Example

```javascript
import { Wallet } from 'fuels';
import { PropsSDK, Edition } from '@props-labs/fuels';

const wallet = new Wallet('private_key');

const propsClient = new PropsSDK({
  network: 'testnet',
});

const edition: Edition = await propsClient.editions.create({
  name:"Edition 1",
  symbol: "ED1",
  metadata: {
    name: "Edition 1",
    description: "First edition",
    image: "image_url",
  },
  options: {
    owner: wallet, // Owner of the edition
    maxSupply: 1000, // defaults to 100 if not set. Value cannot be changed later.,
  }
});
```

### Advanced Example

The advanced example below demonstrates how to create an edition with additional parameters such as builder fee and revenue share.
The `builderFeeAddress` is the address that will receive the builder fee, and `builderFee` is the fee value in wei on top of the base fee.
The `builderRevenueShareAddress` is the address that will receive the builder revenue share, and `builderRevenueShare` is the share value in percentage of the mint price.

```javascript
import { Wallet } from 'fuels';
import { PropsSDK, Edition } from '@props-labs/fuels';

const wallet = new Wallet('private_key');

const propsClient = new PropsSDK({
  network: 'testnet',
});

const edition: Edition = await propsClient.editions.create({
  name:"Edition 1",
  symbol: "ED1",
  metadata: {
    name: "Edition 1",
    description: "First edition",
    image: "image_url",
  },
  options: {
    owner: wallet, // Owner of the edition
    maxSupply: 1000, // defaults to 100 if not set. Value cannot be changed later.,
    builderFeeAddress: '0x1234567890123456789012345678901234567890', // Address to receive the builder fee
    builderFee: 10, // Builder fee value in wei on top of base fee
    builderRevenueShareAddress: '0x1234567890123456789012345678901234567890', // Address to receive the builder revenue share
    builderRevenueShare: 10, // Builder revenue share value in percentage of mint price
  }
});
```

### Setting Start and End Dates

The example below demonstrates how to create an edition with start and end dates. The `startDate` is the date when the edition will start, and the `endDate` is the date when the edition will end.

```javascript
import { Wallet } from 'fuels';
import { PropsSDK, Edition } from '@props-labs/fuels';

const wallet = new Wallet('private_key');

const propsClient = new PropsSDK({
  network: 'testnet',
});

const startDate = new Date('2024-10-01').getTime().toString();
const endDate = new Date('2025-01-31').getTime().toString();

const edition: Edition = await propsClient.editions.create({
  name: "Edition 1",
  symbol: "ED1",
  metadata: {
    name: "Edition 1",
    description: "First edition",
    image: "image_url",
  },
  startDate,
  endDate,
  options: {
    owner: wallet,
    maxSupply: 1000,
  }
});
```


## Minting Tokens from an Edition

To mint tokens, you need to use the `mint` method of the `Edition` class. Below is a guide on how to mint tokens from an edition.

```javascript
import { Wallet } from 'fuels';
import { PropsSDK, Edition } from '@props-labs/fuels';

const editionId = '0x1234567890123456789012345678901234567890' // Edition ID aka Contract ID

const propsClient = new PropsSDK({
  network: 'testnet',
});

const edition:Edition = await propsClient.editions.get(editionId);

const wallet = new Wallet('private_key');
edition.connect(wallet);

await edition.mint('0x1234567890123456789012345678901234567890', 10);
```

## Listing Editions 

To list editions, you need to use the `list` method of the `edition` object in the `PropsSDK` SDK. Below is a guide on how to list editions.

```javascript
const editions: Edition[] = await propsClient.editions.list();
```

## Setting an Allowlist

You can limit who can mint and how many they can mint by setting an allowlist. The allowlist is a list of addresses and the number of tokens they can mint.

> **Note:** You can also create an allowlist without having a specific edition ready by calling the `propsClient.utils.createAllowlist` method.


```javascript
const rawAllowlist = [
  { address: '0x1234567890123456789012345678901234567890', amount: 10 },
  { address: '0x1234567890123456789012345678901234567891', amount: 10 },
];

const { root, allowlist } = edition.createAllowlist(rawAllowlist);

// Save the returned allowlist as .json file 
// and upload the file to e.g. IPFS or S3
// ...

// set the allowlist on the edition
await edition.setAllowlist(root, "ipfs://your-allowlist.json");
```

Now only the addresses in the allowlist can mint the tokens up to the max amount they are allowed to mint.
These addresses can be updated later by calling the `setAllowlist` method again with the new allowlist.

## Setting Mint Dates

When creating an edition, you can set the start and end dates for minting. This ensures that tokens can only be minted within the specified time frame.
You can set the start and end dates by passing the dates as parameters to the `create` method as seen in [this example](#setting-start-and-end-dates), or update them later by calling the `setDates` method.


```javascript
const startDate = new Date('2024-10-01').getTime().toString();
const endDate = new Date('2025-01-31').getTime().toString();
await edition.setDates(startDate, endDate);
```

## Events

The `Editions` class emits events that you can listen to. Below is a list of events that you can listen to.

### Listening for Events

```javascript
import { PropsSDK, Editions } from '@props-labs/fuels';

const propsClient = new PropsSDK({
  network: 'testnet',
});

propsClient.editions.on('transaction', (data) => {
  console.log('Transaction waiting for approval: ', edition);
  console.log('Transaction: ', data.transactionIndex, data.transactionCount, data.transactionHash);
});

propsClient.editions.on('waiting', (data) => {
  console.log('Waiting for transaction to clear:', data);
});
```

### Available Events

- `transaction` - Emitted when a transaction is waiting for approval.
- `waiting` - Emitted when a transaction is waiting to clear.

## Editions API Reference

For more detailed information on the full API, please refer to the [API documentation here](/api/README.html).

## Used Fuel Standards

- Extended Payable version of SRC3
- [SRC5](https://docs.fuel.network/docs/sway-standards/src-5-ownership/)
- [SRC7](https://docs.fuel.network/docs/sway-standards/src-7-asset-metadata/)
- [SRC20](https://docs.fuel.network/docs/sway-standards/src-20-native-asset/)