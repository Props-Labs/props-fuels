import { Wallet, Provider, Contract, ContractFactory, WalletLocked, WalletUnlocked, BytesLike, randomBytes, Address } from 'fuels';
import { Props721EditionContractAbi__factory, PropsRegistryContractAbi__factory } from "@props/fuels/src/sway-api/contracts";
import bytecode from '@props/fuels/src/sway-api/contracts/Props721EditionContractAbi.hex';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Initialize provider and wallet
    const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
    const walletAddress = process.env.WALLET_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    
    if (!walletAddress || !privateKey) {
      throw new Error(
        "Please set your WALLET_ADDRESS and PRIVATE_KEY in the .env file"
      );
    }

    const lockedWallet: WalletLocked = Wallet.fromAddress(walletAddress);

    const unlockedWallet: WalletUnlocked = lockedWallet.unlock(privateKey);
    unlockedWallet.connect(provider);

    console.log("DEPLOYING CONTRACT");

    const salt: BytesLike = randomBytes(32);
    const { waitForResult } =
      await PropsRegistryContractAbi__factory.deployContract(
        bytecode,
        unlockedWallet,
        {
          salt,
        }
      );

    const { contract } = await waitForResult();

    const address = Address.fromDynamicInput(unlockedWallet.address);
    const addressInput = { bits: address.toB256() };
    const addressIdentityInput = { Address: addressInput };

    console.log("REGISTRY CONTRACT ADDRESS: ", contract.id.toB256());

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
