[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / PropsFeeSplitterContractAbi\_\_factory

# Variable: PropsFeeSplitterContractAbi\_\_factory

> `const` **PropsFeeSplitterContractAbi\_\_factory**: `object`

## Type declaration

### abi

> **abi**: `object` = `_abi`

### abi.configurables

> **configurables**: `never`[] = `[]`

### abi.encoding

> **encoding**: `string` = `"1"`

### abi.functions

> **functions**: (`object` \| `object` \| `object`)[]

### abi.loggedTypes

> **loggedTypes**: (`object` \| `object`)[]

### abi.messagesTypes

> **messagesTypes**: `never`[] = `[]`

### abi.types

> **types**: (`object` \| `object` \| `object`)[]

### storageSlots

> **storageSlots**: `StorageSlot`[] = `_storageSlots`

### connect()

#### Parameters

• **id**: `string` \| `AbstractAddress`

• **accountOrProvider**: `Account` \| `Provider`

#### Returns

[`PropsFeeSplitterContractAbi`](../classes/PropsFeeSplitterContractAbi.md)

### createInterface()

#### Returns

`PropsFeeSplitterContractAbiInterface`

### deployContract()

#### Parameters

• **bytecode**: `BytesLike`

• **wallet**: `Account`

• **options**: `DeployContractOptions` = `{}`

#### Returns

`Promise`\<`DeployContractResult`\<[`PropsFeeSplitterContractAbi`](../classes/PropsFeeSplitterContractAbi.md)\>\>

## Defined in

[packages/props-fuels/src/sway-api/contracts/factories/PropsFeeSplitterContractAbi\_\_factory.ts:1752](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/sway-api/contracts/factories/PropsFeeSplitterContractAbi__factory.ts#L1752)