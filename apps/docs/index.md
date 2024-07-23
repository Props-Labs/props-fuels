# Octane SDK

Welcome to the Octane SDK documentation. This SDK allows you to easily create, manage, and interact with NFTs on the Fuel network.

## Getting Started

### Installation

To install the SDK, run:

```bash
npm install octane-sdk
```

## Usage

To use the SDK, you must first create an instance of the `Octane` class:

```javascript
import { Octane } from 'octane-sdk';
import { Provider, Wallet } from 'fuels-ts-sdk';

const provider = new Provider('https://api.fuel.network');
const wallet = Wallet.fromPrivateKey('your-private-key');
const sdk = new Octane(provider, wallet);

async function createEdition() {
  const editionId = await sdk.edition.create('Edition 1', {
    name: 'Edition 1',
    description: 'First edition',
    image: 'image_url',
  });
  console.log(`Created edition with ID: ${editionId}`);
}

createEdition();
```