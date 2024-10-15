# Collections Overview

Collections in the Props SDK represent a large token collection similar to a 721 Collection. Each collection has a unique identifier, a name, and associated metadata. To support large collections like 10k tokens, metadata is stored off-chain similar to the `base_uri` / `token_uri` equivalent on the ERC721 Standard. The metadata includes details such as the name, description, and image URL of the NFT. The metadata follows the standard equivalent of the ERC721 metadata as defined by [Opensea Standards](https://docs.opensea.io/docs/metadata-standards).

## Creating an Collection

To create an collection, you need to use the `create` method of the `collection` object in the `PropsSDK` SDK. Below is a guide on how to create an collection.

Use the `create` method to create a new collection. You need to provide the name of the collection and its metadata.

> **Note:** Due to how contracts on Fuel work, creating an Collection requires 2 transactions. The first transaction creates the collection contract, and the second transaction initializes ownership and sets metadata.

### Basic Example

```javascript
import { Wallet } from 'fuels';
import { PropsSDK, Collection } from '@props-labs/fuels';

const wallet = new Wallet('private_key');

const propsClient = new PropsSDK({
  network: 'testnet',
});

const collection: Collection = await propsClient.collections.create({
  name:"Collection 1",
  symbol: "ED1",
  baseUri: "ipfs://bafybeiaad7jp7bsk2fubp4wmks56yxevoz7ywst5fd4gqdschuqonpd2ee/",
  options: {
    owner: wallet, // Owner of the collection
    maxSupply: 1000, // defaults to 100 if not set. Value cannot be changed later.,
  }
});
```

> **Note:** The `baseUri` must end with a trailing slash. The contract expects the folder to contain numeric json files e.g 1.json, 2.json, etc. and will return `baseUri` + `tokenId` + `.json` when calling retrieving token metadata.

### Advanced Example

The advanced example below demonstrates how to create an collection with additional parameters such as builder fee and revenue share.
The `builderFeeAddress` is the address that will receive the builder fee, and `builderFee` is the fee value in wei on top of the base fee.
The `builderRevenueShareAddress` is the address that will receive the builder revenue share, and `builderRevenueShare` is the share value in percentage of the mint price.

```javascript
import { Wallet } from 'fuels';
import { PropsSDK, Collection } from '@props-labs/fuels';

const wallet = new Wallet('private_key');

const propsClient = new PropsSDK({
  network: 'testnet',
});

const collection: Collection = await propsClient.collections.create({
  name:"Collection 1",
  symbol: "ED1",
  baseUri: "ipfs://bafybeiaad7jp7bsk2fubp4wmks56yxevoz7ywst5fd4gqdschuqonpd2ee/",
  options: {
    owner: wallet, // Owner of the collection
    maxSupply: 1000, // defaults to 100 if not set. Value cannot be changed later.,
    builderFeeAddress: '0x1234567890123456789012345678901234567890', // Address to receive the builder fee
    builderFee: 10, // Builder fee value in wei on top of base fee
    builderRevenueShareAddress: '0x1234567890123456789012345678901234567890', // Address to receive the builder revenue share
    builderRevenueShare: 10, // Builder revenue share value in percentage of mint price
  }
});
```

### Setting Start and End Dates

The example below demonstrates how to create a collection with start and end dates. The `startDate` is the date when the collection will start, and the `endDate` is the date when the collection will end.

```javascript
import { Wallet } from 'fuels';
import { PropsSDK, Collection } from '@props-labs/fuels';

const wallet = new Wallet('private_key');

const propsClient = new PropsSDK({
  network: 'testnet',
});

const startDate = new Date('2024-10-01').getTime().toString();
const endDate = new Date('2025-01-31').getTime().toString();

const collection: Collection = await propsClient.collections.create({
  name:"Collection 1",
  symbol: "ED1",
  baseUri: "ipfs://bafybeiaad7jp7bsk2fubp4wmks56yxevoz7ywst5fd4gqdschuqonpd2ee/", // use trailing slash
  startDate,
  endDate,
  options: {
    owner: wallet,
    maxSupply: 1000,
  }
});
```

## Minting Tokens from an Collection

To mint tokens, you need to use the `mint` method of the `Collection` class. Below is a guide on how to mint tokens from an collection.

```javascript
import { Wallet } from 'fuels';
import { PropsSDK, Collection } from '@props-labs/fuels';

const collectionId = '0x1234567890123456789012345678901234567890' // Collection ID aka Contract ID

const propsClient = new PropsSDK({
  network: 'testnet',
});

const collection:Collection = await propsClient.collections.get(collectionId);

const wallet = new Wallet('private_key');
collection.connect(wallet);

await collection.mint('0x1234567890123456789012345678901234567890', 10);
```

## Listing Collections 

To list collections, you need to use the `list` method of the `collection` object in the `PropsSDK` SDK. Below is a guide on how to list collections.

```javascript
const collections: Collection[] = await propsClient.collections.list();
```

## Setting an Allowlist

You can limit who can mint and how many they can mint by setting an allowlist. The allowlist is a list of addresses and the number of tokens they can mint.

> **Note:** You can also create an allowlist without having a specific edition ready by calling the `propsClient.utils.createAllowlist` method.


```javascript
const rawAllowlist = [
  { address: '0x1234567890123456789012345678901234567890', amount: 10 },
  { address: '0x1234567890123456789012345678901234567891', amount: 10 },
];

const { root, allowlist } = collection.createAllowlist(rawAllowlist);

// Save the returned allowlist as .json file 
// and upload the file to e.g. IPFS or S3
// ...

// set the allowlist on the edition
await collection.setAllowlist(root, "ipfs://your-allowlist.json");
```

Now only the addresses in the allowlist can mint the tokens up to the max amount they are allowed to mint.
These addresses can be updated later by calling the `setAllowlist` method again with the new allowlist.

## Setting Mint Dates

When creating an collection, you can set the start and end dates for minting. This ensures that tokens can only be minted within the specified time frame.
You can set the start and end dates by passing the dates as parameters to the `create` method as seen in [this example](#setting-start-and-end-dates), or update them later by calling the `setDates` method.


```javascript
const startDate = new Date('2024-10-01').getTime().toString();
const endDate = new Date('2025-01-31').getTime().toString();
await collection.setDates(startDate, endDate);
```

## Events

The `Collections` class emits events that you can listen to. Below is a list of events that you can listen to.

### Listening for Events

```javascript
import { PropsSDK, Collections } from '@props-labs/fuels';

const propsClient = new PropsSDK({
  network: 'testnet',
});

const collection = await propsClient.collections.get('0x1234567890123456789012345678901234567890');

collection.on('transaction', (data) => {
  console.log('Transaction waiting for approval: ', collection);
  console.log('Transaction: ', data.transactionIndex, data.transactionCount, data.transactionHash);
});

collection.on('waiting', (data) => {
  console.log('Waiting for transaction to clear:', data);
});
```

### Available Events

- `transaction` - Emitted when a transaction is waiting for approval.
- `waiting` - Emitted when a transaction is waiting to clear.

## Get Token Metadata
To get the token metadata for a specific asset, you can use the `getTokenMetadata` method.

> **Note:** Please note that on fuel, each NFT is its 1-of-1 asset with its own unique assetId. In order to get the tokens metadata, you need to specify the assetId.

```javascript
const tokenMetadata = await collection.getTokenMetadata('0x1234567890123456789012345678901234567890');
```

## Collections API Reference

For more detailed information on the full API, please refer to the [API documentation here](/api/README.html).

## Used Fuel Standards

- Extended Payable version of SRC3
- [SRC5](https://docs.fuel.network/docs/sway-standards/src-5-ownership/)
- Extended SRC7 due to large token constraint
- [SRC20](https://docs.fuel.network/docs/sway-standards/src-20-native-asset/)