import { Wallet, Provider, Contract, ContractFactory, WalletLocked, WalletUnlocked, BytesLike, randomBytes, Address } from 'fuels';
import { Props721EditionContractAbi__factory, PropsRegistryContractAbi__factory } from "@props/fuels/src/sway-api/contracts";
import bytecode from '@props/fuels/src/sway-api/contracts/Props721EditionContractAbi.hex';
import dotenv from 'dotenv';
import { encodeMetadataValues } from '@props/fuels/src/utils/metadata';
import util from 'util';
dotenv.config();

async function main() {
    // Initialize provider and wallet
    const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
    const walletAddress = process.env.WALLET_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const registryContractAddress = process.env.REGISTRY_CONTRACT_ADDRESS;
    const testContractAddress = process.env.TEST_CONTRACT_ADDRESS;

    if (!walletAddress || !privateKey || !registryContractAddress || !testContractAddress) {
      throw new Error(
        "Please set your WALLET_ADDRESS and PRIVATE_KEY in the .env file"
      );
    }

    

    const lockedWallet: WalletLocked = Wallet.fromAddress(walletAddress);

    const unlockedWallet: WalletUnlocked = lockedWallet.unlock(privateKey);
    unlockedWallet.connect(provider);

    console.log("UNLOCKED WALLET ADDRESS: ", unlockedWallet.address.toB256());

    const contract = Props721EditionContractAbi__factory.connect(
      testContractAddress,
      unlockedWallet
    );

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

    let metadata: any = {
      name: '',
      image: 'https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png',
      description: '',
      attributes: []
    };

    let price: number = 0;
    let startDate: Date = new Date();
    let endDate: Date = new Date();

    const startTimestamp = BigInt(Math.floor(startDate.getTime() / 1000));
    const endTimestamp = BigInt(Math.floor(endDate.getTime() / 1000));


    let options: any = {
      maxSupply: 1000,
      builderFeeAddress: '0x0000000000000000000000000000000000000000',
      builderFee: 0,
      builderRevenueShareAddress: '0x0000000000000000000000000000000000000000',
      builderRevenuePercentage: 0
  }

  try{
    const { waitForResult: waitForResultConstructor } =
      await registryContract.functions
        .init_contract(
          { bits: contract.id.toB256() },
          addressIdentityInput,
          "Contract"
        )
        .addContracts([contract])
        //.addContracts([contract])
        // .callParams({
        //   gasLimit: 10_000_000,
        // })
        // .txParams({
        //   gasLimit: 10_000_000,
        // })
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
