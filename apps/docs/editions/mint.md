# Minting from an Edition

Minting tokens from an edition in the Octane SDK involves calling the `mint` method on an existing edition. This process allows you to create new tokens and assign them to a specified address.

## Minting Tokens

To mint tokens, you need to use the `mint` method of the `Edition` class. Below is a guide on how to mint tokens from an edition.

```javascript
import { Wallet } from 'fuels';
import { Octane, Edition } from 'octane-fuels-ts';

const editionId = '0x1234567890123456789012345678901234567890' // Edition ID aka Contract ID

const octane = new Octane({
  network: 'testnet',
});

const edition:Edition = await octane.edition.get(editionId);

const wallet = new Wallet('private_key');
edition.connect(wallet);

await edition.mint('0x1234567890123456789012345678901234567890', 10);
```