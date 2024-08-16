# Props SDK

Welcome to documentation of the Props SDK for Fuel Network. This SDK allows you to easily create, manage, and interact with NFTs on the Fuel network.

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
      owner: wallet,
    }
  });
  console.log(`Created edition with ID: ${editionId}`);
}

createEdition();
```