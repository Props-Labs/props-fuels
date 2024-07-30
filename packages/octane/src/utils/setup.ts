import { WalletUnlocked, Provider, BytesLike, Address, BN, Account } from "fuels";
import { launchTestNode, AssetId, TestMessage } from "fuels/test-utils";
import { Octane721EditionContractAbi__factory, OctaneFeeSplitterContractAbi, OctaneFeeSplitterContractAbi__factory } from "../sway-api/contracts";
import octaneFeeSplitterBytecode from "../sway-api/contracts/OctaneFeeSplitterContractAbi.hex";
import crypto from "crypto";
import { MetadataInput, Octane721EditionContractAbi } from "../sway-api/contracts/Octane721EditionContractAbi";
import bytecode from "../sway-api/contracts/Octane721EditionContractAbi.hex";

export async function setup(): Promise<
    {
        wallet1: WalletUnlocked;
        wallet2: WalletUnlocked;
        wallet3: WalletUnlocked;
        wallet4: WalletUnlocked;
        provider: Provider;
        feeSplitterContract: OctaneFeeSplitterContractAbi;
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
          bytecode: octaneFeeSplitterBytecode, // Contract bytecode,
          walletIndex: 0, // Index of the wallet to deploy the contract
        },
      ],
      launchNodeServerPort: '4000',
    });

    // Destructure the launched object to get wallets and contracts
    const {
      contracts: [
        
      ],
      wallets: [wallet1, wallet2, wallet3, wallet4],
      provider
    } = launched;

    const feeSplitterContract = await OctaneFeeSplitterContractAbi__factory.deployContract(
      octaneFeeSplitterBytecode,
      wallet1,
      {
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000" as BytesLike
      }
    );

    return { wallet1, wallet2, wallet3, wallet4, provider, feeSplitterContract };
}

export async function deployOctane721EditionContract(wallet1:Account): Promise<Octane721EditionContractAbi> {
    const salt: BytesLike = crypto.randomBytes(32);
    const contract = await Octane721EditionContractAbi__factory.deployContract(
      bytecode,
      wallet1,
      {
        configurableConstants: {
          MAX_SUPPLY: 100
        },
        salt,
      }
    );

    const address = Address.fromDynamicInput(wallet1.address);
    const addressInput = { bits: address.toB256() };
    const addressIdentityInput = { Address: addressInput };

    await contract.functions
      .constructor(
        addressIdentityInput,
        "Test Edition",
        "TEST",
        ["name", "description", "image"],
        [{ String: "Test Edition" }, { String: "A test edition" }, { String: "test_image_url" }],
        0
      )
      .call();

    return contract;
}
