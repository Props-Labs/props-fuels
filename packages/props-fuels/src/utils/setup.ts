import { WalletUnlocked, Provider, BytesLike, Address, BN, Account, randomBytes, BigNumberish } from "fuels";
import { launchTestNode, AssetId, TestMessage } from "fuels/test-utils";
import { Props721EditionContractAbi__factory, PropsFeeSplitterContractAbi, PropsFeeSplitterContractAbi__factory, Props721CollectionContractAbi__factory, Props721CollectionContractAbi, PropsRegistryContractAbi__factory, PropsRegistryContractAbi } from "../sway-api/contracts";
import { Props721EditionContractAbi } from "../sway-api/contracts/Props721EditionContractAbi";
import octaneFeeSplitterBytecode from "../sway-api/contracts/PropsFeeSplitterContractAbi.hex";
import propsRegistryBytecode from "../sway-api/contracts/PropsRegistryContractAbi.hex";
import bytecode from "../sway-api/contracts/Props721EditionContractAbi.hex";
import { defaultEndDate, defaultStartDate } from "../common/defaults";

export async function setup(): Promise<
    {
        wallet1: WalletUnlocked;
        wallet2: WalletUnlocked;
        wallet3: WalletUnlocked;
        wallet4: WalletUnlocked;
        provider: Provider;
        feeSplitterContract: PropsFeeSplitterContractAbi;
    }
> {
  const assets = AssetId.random(2);
  const message = new TestMessage({ amount: 1000 });

  const launched = await launchTestNode({
    walletsConfig: {
      count: 4, // Number of wallets to create
      assets, // Assets to use
      coinsPerAsset: 1, // Number of coins per asset
      amountPerCoin: 1_000_000, // Amount per coin
      messages: [message], // Initial messages
    },
    nodeOptions: {
      port: "4000",
    },
    launchNodeServerPort: "4000",
  });

  // Destructure the launched object to get wallets and contracts
  const {
    contracts: [],
    wallets: [wallet1, wallet2, wallet3, wallet4],
    provider,
  } = launched;

  const address = Address.fromDynamicInput(wallet1.address);
  const addressInput = { bits: address.toB256() };
  const addressIdentityInput = { Address: addressInput };

  const { waitForResult } =
    await PropsFeeSplitterContractAbi__factory.deployContract(
      octaneFeeSplitterBytecode,
      wallet1,
      {
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000" as BytesLike,
      }
    );

  const { contract: feeSplitterContract, transactionResult } =
    await waitForResult();

  // Initialize the Fee Splitter Contract
  // const { waitForResult: waitForFeeSplitterConstructorResult } =
  //   await feeSplitterContract.functions
  //     .constructor(addressIdentityInput)
  //     .call();

  // await waitForFeeSplitterConstructorResult();

  // Log hash of deployed fee splitter contract
  const feeSplitterContractId = feeSplitterContract.id;
  // console.log(
  //   "Props Fee Splitter Contract deployed at:",
  //   feeSplitterContractId.toB256()
  // );

  // Deploy Props Registry Contract
  const { waitForResult: waitForPropsRegistryResult } =
    await PropsRegistryContractAbi__factory.deployContract(
      propsRegistryBytecode,
      wallet1,
      {
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000" as BytesLike,
      }
    );

  const { contract: propsRegistryContract } =
    await waitForPropsRegistryResult();

  // Initialize the Props Registry Contract
  // const { waitForResult: waitForPropsRegistryConstructorResult } =
  //   await propsRegistryContract.functions
  //     .constructor(addressIdentityInput)
  //     .call();

  // await waitForPropsRegistryConstructorResult();

  // Log hash of deployed registry contract
  const registryContractId = propsRegistryContract.id;
  // console.log(
  //   "Props Registry Contract deployed at:",
  //   registryContractId.toB256()
  // );

  return { wallet1, wallet2, wallet3, wallet4, provider, feeSplitterContract };
}

export async function deployProps721EditionContract(wallet1:Account): Promise<Props721EditionContractAbi> {
    const salt: BytesLike = randomBytes(32);
    const {waitForResult} = await Props721EditionContractAbi__factory.deployContract(
      bytecode,
      wallet1,
      {
        configurableConstants: {
          MAX_SUPPLY: 100
        },
        salt,
      }
    );

    const { contract, transactionResult } = await waitForResult();

    const address = Address.fromDynamicInput(wallet1.address);
    const addressInput = { bits: address.toB256() };
    const addressIdentityInput = { Address: addressInput };

    const { waitForResult: waitForConstructorResult } = await contract.functions
      .constructor(
        addressIdentityInput,
        "Test Edition",
        "TEST",
        ["name", "description", "image"],
        [
          { String: "Test Edition" },
          { String: "A test edition" },
          { String: "test_image_url" },
        ],
        0,
        defaultStartDate,
        defaultEndDate
      )
      .call();

    await waitForConstructorResult();

    return contract;
}
export async function deployProps721CollectionContract(wallet1: Account): Promise<Props721CollectionContractAbi> {
  const salt: BytesLike = randomBytes(32);
  const { waitForResult } = await Props721CollectionContractAbi__factory.deployContract(
    bytecode,
    wallet1,
    {
      configurableConstants: {
        MAX_SUPPLY: 100
      },
      salt,
    }
  );

  const { contract, transactionResult } = await waitForResult();

  // console.log("Contract: ", contract);
  // console.log("Transaction Result: ", transactionResult);

  const address = Address.fromDynamicInput(wallet1.address);
  const addressInput = { bits: address.toB256() };
  const addressIdentityInput = { Address: addressInput };

  const { waitForResult: waitForConstructorResult } = await contract.functions
    .constructor(
      addressIdentityInput,
      "Test Collection",
      "TESTC",
      "https://example.com/metadata/",
      0,
      defaultStartDate,
      defaultEndDate
    )
    .call();

  await waitForConstructorResult();

  console.log("Collection Contract: ", contract.id.toHexString());

  return contract;
}