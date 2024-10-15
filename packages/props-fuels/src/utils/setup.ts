import { WalletUnlocked, Provider, BytesLike, Address, BN, Account, randomBytes, BigNumberish } from "fuels";
import { launchTestNode, TestAssetId, TestMessage } from "fuels/test-utils";
import { Props721EditionContractFactory, PropsFeeSplitterContract, PropsFeeSplitterContractFactory, Props721CollectionContractFactory, Props721CollectionContract, PropsRegistryContractFactory, PropsRegistryContract } from "../sway-api/contracts";
import { Props721EditionContract } from "../sway-api/contracts/Props721EditionContract";
import { defaultEndDate, defaultStartDate, registryContractAddress } from "../common/defaults";

export async function setup(): Promise<
    {
        wallet1: WalletUnlocked;
        wallet2: WalletUnlocked;
        wallet3: WalletUnlocked;
        wallet4: WalletUnlocked;
        provider: Provider;
        feeSplitterContract: PropsFeeSplitterContract;
        cleanup: () => void;
    }
> {
  const assets = TestAssetId.random(2);
  const message = new TestMessage({ amount: 1000 });

  const launched = await launchTestNode({
    walletsConfig: {
      count: 4, // Number of wallets to create
      assets, // Assets to use
      coinsPerAsset: 1, // Number of coins per asset
      amountPerCoin: 1_000_000, // Amount per coin
      messages: [message], // Initial messages
    },
    providerOptions: {
      resourceCacheTTL: 50000,
    },
  });

  // Destructure the launched object to get wallets and contracts
  const {
    contracts: [],
    wallets: [wallet1, wallet2, wallet3, wallet4],
    provider,
    cleanup
  } = launched;

  const address = Address.fromDynamicInput(wallet1.address);
  const addressInput = { bits: address.toB256() };
  const addressIdentityInput = { Address: addressInput };

  const { waitForResult } =
    await PropsFeeSplitterContractFactory.deploy(
      wallet1,
      {
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000" as BytesLike,
      }
    );

  const { contract: feeSplitterContract, transactionResult } =
    await waitForResult();

  // Initialize the Fee Splitter Contract
  const { waitForResult: waitForFeeSplitterConstructorResult } =
    await feeSplitterContract.functions
      .constructor(addressIdentityInput)
      .call();

  await waitForFeeSplitterConstructorResult();

  // Log hash of deployed fee splitter contract
  const feeSplitterContractId = feeSplitterContract.id;
  console.log(
    "Props Fee Splitter Contract deployed at:",
    feeSplitterContractId.toB256()
  );

  // Deploy Props Registry Contract
  const { waitForResult: waitForPropsRegistryResult } =
    await PropsRegistryContractFactory.deploy(
      wallet1,
      {
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000" as BytesLike,
      }
    );

  const { contract: propsRegistryContract } =
    await waitForPropsRegistryResult();

  // Initialize the Props Registry Contract
  const { waitForResult: waitForPropsRegistryConstructorResult } =
    await propsRegistryContract.functions
      .constructor(addressIdentityInput)
      .call();

  await waitForPropsRegistryConstructorResult();

  // Log hash of deployed registry contract
  const registryContractId = propsRegistryContract.id;
  console.log(
    "Props Registry Contract deployed at:",
    registryContractId.toB256()
  );

  return { wallet1, wallet2, wallet3, wallet4, provider, feeSplitterContract, cleanup };
}

export async function deployProps721EditionContract(wallet1:Account): Promise<Props721EditionContract> {
    const salt: BytesLike = randomBytes(32);
    const {waitForResult} = await Props721EditionContractFactory.deploy(
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

    const registryContract = new PropsRegistryContract(
      registryContractAddress,
      wallet1
    );

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
      .addContracts([registryContract])
      .call();

    await waitForConstructorResult();

    return contract;
}
export async function deployProps721CollectionContract(wallet1: Account): Promise<Props721CollectionContract> {
  const salt: BytesLike = randomBytes(32);
  const { waitForResult } = await Props721CollectionContractFactory.deploy(
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

  const registryContract = new PropsRegistryContract(
    registryContractAddress,
    wallet1
  );

  const { waitForResult: waitForConstructorResult } = await contract.functions
    .constructor(
      addressIdentityInput,
      "Test Collection",
      "TESTC",
      "https://propsassets.s3.amazonaws.com/fuel/sample-collection/",
      0,
      defaultStartDate,
      defaultEndDate
    )
    .addContracts([registryContract])
    .call();

  await waitForConstructorResult();

  // console.log("Collection Contract: ", contract.id.toHexString());

  return contract;
}