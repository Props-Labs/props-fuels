# Octane SDK

Welcome to the Octane SDK documentation. This SDK allows you to easily create, manage, and interact with NFTs on the Fuel network.

## Getting Started

### Installation

To install the SDK, run:

```bash
npm install octane-fuels-ts
```

```bash
pnpm install octane-fuels-ts
```

```bash
yarn add octane-fuels-ts
```

## Usage

To use the SDK, you must first create an instance of the `Octane` class:

```javascript
import { Octane } from 'octane-fuels-ts';
import { Provider, Wallet } from 'fuels';

const provider = new Provider('https://testnet.fuel.network');
const wallet = Wallet.fromPrivateKey('your-private-key');

const octane = new Octane({
  network: 'testnet',
});

async function createEdition() {
  const editionId = await octane.edition.create('Edition 1', {
    name: 'Edition 1',
    description: 'First edition',
    image: 'image_url',
  });
  console.log(`Created edition with ID: ${editionId}`);
}

createEdition();
```