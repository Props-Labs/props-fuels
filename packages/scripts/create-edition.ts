import { Wallet, Provider, Address } from 'fuels';
import { EditionManager } from '@props-labs/fuels/src/edition/edition-manager';
import { EditionCreateOptions } from '@props-labs/fuels/src/common/types';

async function main() {
  // Check if required arguments are provided
  if (process.argv.length < 4) {
    console.error('Usage: node create-edition.js <node-url> <private-key>');
    process.exit(1);
  }

  const nodeUrl = process.argv[2];
  const privateKey = process.argv[3];

  console.log('nodeUrl', nodeUrl);
  console.log('privateKey', privateKey);

  // Create a provider with the given node URL
  const provider = await Provider.create(nodeUrl);

  // Create a wallet instance
  const wallet = Wallet.fromPrivateKey(privateKey, provider);

  // Create an instance of EditionManager
  const editionManager = new EditionManager();

  // Example edition creation options
  const editionOptions: EditionCreateOptions = {
    name: 'My Test Edition',
    symbol: 'MTE',
    metadata: {
      name: 'My Test Edition',
      description: 'This is a test edition created via script',
      image: '',
    },
    price: 100, // Set an appropriate price
    options: {
      owner: wallet,
      maxSupply: 1000
    },
  };

  try {
    console.log('Creating edition...');
    const edition = await editionManager.create(editionOptions);
    console.log('Edition created successfully!');
    console.log('Edition ID:', edition.id);
    console.log('Contract Address:', edition.contract?.id.toString());
  } catch (error) {
    console.error('Error creating edition:', error);
  }
}

main().catch(console.error);
