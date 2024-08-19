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
    const registryContractAddress = process.env.REGISTRY_CONTRACT_ADDRESS;
    
    if (!walletAddress || !privateKey || !registryContractAddress) {
      throw new Error(
        "Please set your WALLET_ADDRESS and PRIVATE_KEY in the .env file"
      );
    }

    const lockedWallet: WalletLocked = Wallet.fromAddress(walletAddress);

    const unlockedWallet: WalletUnlocked = lockedWallet.unlock(privateKey);
    unlockedWallet.connect(provider);

    const address = Address.fromDynamicInput(unlockedWallet.address);
    const addressInput = { bits: address.toB256() };
    const addressIdentityInput = { Address: addressInput };

    const registryContract = PropsRegistryContractAbi__factory.connect(
      registryContractAddress,
      unlockedWallet
    );

    console.log("CALLING REGISTRY CONTRACT CONSTRUCTOR");
    console.log("REGISTRY CONTRACT ADDRESS: ", registryContract.id.toB256());

    const { waitForResult: waitForResultConstructor } =
      await registryContract.functions
        .constructor(
            addressIdentityInput
        )
        .call();

    console.log("WAITING FOR waitForResultConstructor");

    const { transactionResult } = await waitForResultConstructor();

    console.log(transactionResult);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
