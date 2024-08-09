[**@props/fuels**](../README.md) • **Docs**

***

[@props/fuels](../README.md) / Props721EditionContractAbi\_\_factory

# Variable: Props721EditionContractAbi\_\_factory

> `const` **Props721EditionContractAbi\_\_factory**: `object`

## Type declaration

### abi

> **abi**: `object` = `_abi`

### abi.configurables

> **configurables**: (`object` \| `object`)[]

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

[`Props721EditionContractAbi`](../classes/Props721EditionContractAbi.md)

### createInterface()

#### Returns

`Props721EditionContractAbiInterface`

### deployContract()

#### Parameters

• **bytecode**: `BytesLike`

• **wallet**: `Account`

• **options**: `DeployContractOptions` = `{}`

#### Returns

`Promise`\<`DeployContractResult`\<[`Props721EditionContractAbi`](../classes/Props721EditionContractAbi.md)\>\>

## Defined in

[packages/props-fuels/src/sway-api/contracts/factories/Props721EditionContractAbi\_\_factory.ts:4394](https://github.com/Props-Labs/octane/blob/2f5b62c99caca23a485b671ce2fbd114bfd5aae1/packages/props-fuels/src/sway-api/contracts/factories/Props721EditionContractAbi__factory.ts#L4394)