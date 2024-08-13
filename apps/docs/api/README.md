**@props/fuels** • [**Docs**](globals.md)

***

# Props SDK

The Props SDK allows anyone to integrate minting NFTs on Fuel with just a few lines of code with a powerful built-in incentive protocol that rewards builders, creators and collectors.

## Documentation

For detailed documentation and API reference, please visit our comprehensive documentation site:

[Props SDK Documentation](https://props-fuels.vercel.app)

## Getting Started

### Installation

To install the SDK, run:

```bash
npm install @props/fuels
```

```bash
pnpm install @props/fuels
```

```bash
yarn add @props/fuels
```

## Usage

To use the SDK, you must first create an instance of the `PropsSDK` class:

```javascript
import { PropsSDK } from '@props/fuels';
import { Provider, Wallet } from 'fuels';

const provider = new Provider('https://testnet.fuel.network');
const wallet = Wallet.fromPrivateKey('your-private-key');

const propsClient = new PropsSDK({
  network: 'testnet',
});

async function createEdition() {
  const edition: Edition = await propsClient.create({
    name:"Edition 1",
    symbol: "ED1",
    metadata: {
      name: "Edition 1",
      description: "First edition",
      image: "image_url",
    },
    options: {
      maxSupply: 100,
      owner: wallets[0],
    }
  });
  console.log(`Created edition with ID: ${editionId}`);
}

createEdition();
```

## TODO

- [ ] Merkle-Based Allowlists
- [ ] Flexible Mint Dates
