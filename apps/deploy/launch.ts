import { Wallet, Provider, Contract, ContractFactory, WalletLocked, WalletUnlocked, BytesLike, randomBytes, Address } from 'fuels';
import { Props721EditionContractAbi__factory, PropsRegistryContractAbi, PropsRegistryContractAbi__factory } from "@props/fuels/src/sway-api/contracts/";
import bytecode from '@props/fuels/src/sway-api/contracts/Props721EditionContractAbi.hex';
import dotenv from 'dotenv';
import util from 'util';

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

    console.log("DEPLOYING CONTRACT");

    const salt: BytesLike = randomBytes(32);
    const { waitForResult } =
      await Props721EditionContractAbi__factory.deployContract(
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

    console.log("CONTRACT ADDRESS: ", contract.id.toB256());

    console.log("CONNECTING TO REGISTRY CONTRACT");

    const registryContract = PropsRegistryContractAbi__factory.connect(
      registryContractAddress,
      unlockedWallet
    );

    console.log("INITIALIZING CONTRACT THROUGH REGISTRY CONTRACT");
    console.log("REGISTRY CONTRACT ADDRESS: ", registryContract.id.toB256());

    try{
      const { waitForResult: waitForResultConstructor } = await registryContract.functions
          .init_contract(
            { bits: contract.id.toB256() },
            addressIdentityInput,
            "Test",
          )
          .addContracts([contract])
          .call();

      const { transactionResult } = await waitForResultConstructor();

      console.log(transactionResult);
  }
  catch(error){
    console.log("WTF")
    console.log(util.inspect(error, false, null, true /* enable colors */))
  }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
