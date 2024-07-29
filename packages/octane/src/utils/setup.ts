import { WalletUnlocked } from "fuels";
import { launchTestNode, AssetId, TestMessage } from "fuels/test-utils";
import { OctaneFeeSplitterContractAbi__factory } from "../sway-api/contracts";
import octaneFeeSplitterBytecode from "../sway-api/contracts/OctaneFeeSplitterContractAbi.hex";

export async function setup(): Promise<
    {
        wallet1: WalletUnlocked;
        wallet2: WalletUnlocked;
        wallet3: WalletUnlocked;
        wallet4: WalletUnlocked;
    }
> {

    const assets = AssetId.random(2);
    const message = new TestMessage({ amount: 1000 });
    
    const launched = await launchTestNode({
      walletsConfig: {
        count: 4, // Number of wallets to create
        assets, // Assets to use
        coinsPerAsset: 2, // Number of coins per asset
        amountPerCoin: 1_000_000, // Amount per coin
        messages: [message], // Initial messages
      },
      nodeOptions: {
        port: "4000",
      },
      contractsConfigs: [
        {
          deployer: OctaneFeeSplitterContractAbi__factory, // Contract deployer factory
          bytecode: octaneFeeSplitterBytecode, // Contract bytecode
          walletIndex: 0, // Index of the wallet to deploy the contract
          options: { storageSlots: [] }, // Storage options for the contract
        },
      ],
    });

    // Destructure the launched object to get wallets and contracts
    const {
      contracts: [],
      wallets: [wallet1, wallet2, wallet3, wallet4],
    } = launched;

    return { wallet1, wallet2, wallet3, wallet4 };
}