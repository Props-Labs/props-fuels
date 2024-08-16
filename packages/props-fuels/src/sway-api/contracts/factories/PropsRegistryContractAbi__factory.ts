/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.93.0
  Forc version: 0.62.0
  Fuel-Core version: 0.31.0
*/

import { Interface, Contract, ContractFactory } from "fuels";
import type { Provider, Account, AbstractAddress, BytesLike, DeployContractOptions, StorageSlot, DeployContractResult } from "fuels";
import type { PropsRegistryContractAbi, PropsRegistryContractAbiInterface } from "../PropsRegistryContractAbi";

const _abi = {
  "encoding": "1",
  "types": [
    {
      "typeId": 0,
      "type": "()",
      "components": [],
      "typeParameters": null
    },
    {
      "typeId": 1,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "enum AccessError",
      "components": [
        {
          "name": "NotOwner",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "enum Identity",
      "components": [
        {
          "name": "Address",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "ContractId",
          "type": 7,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "enum InitializationError",
      "components": [
        {
          "name": "CannotReinitialized",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "enum State",
      "components": [
        {
          "name": "Uninitialized",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "Initialized",
          "type": 3,
          "typeArguments": null
        },
        {
          "name": "Revoked",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "struct Address",
      "components": [
        {
          "name": "bits",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "struct ContractId",
      "components": [
        {
          "name": "bits",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "struct DeregisterEvent",
      "components": [
        {
          "name": "contract_id",
          "type": 7,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 9,
      "type": "struct OwnershipSet",
      "components": [
        {
          "name": "new_owner",
          "type": 3,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 10,
      "type": "struct RegisterEvent",
      "components": [
        {
          "name": "contract_id",
          "type": 7,
          "typeArguments": null
        },
        {
          "name": "owner",
          "type": 3,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [],
      "name": "owner",
      "output": {
        "name": "",
        "type": 5,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Returns the owner."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Return Values"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * [State] - Represents the state of ownership for this contract."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Number of Storage Accesses"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * Reads: `1`"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Examples"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ```sway"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " use standards::src5::SRC5;"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " fn foo(contract_id: ContractId) {"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "     let ownership_abi = abi(contract_id, SRC_5);"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "     match ownership_abi.owner() {"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "         State::Uninitalized => log(\"The ownership is uninitalized\"),"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "         State::Initialized(owner) => log(\"The ownership is initalized\"),"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "         State::Revoked => log(\"The ownership is revoked\"),"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "     }"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " }"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ```"
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "owner",
          "type": 3,
          "typeArguments": null
        }
      ],
      "name": "constructor",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Sets the defaults for the contract."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Arguments"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * `owner`: [Identity] - The `Identity` that will be the first owner."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Reverts"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * When ownership has been set before."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Storage Accesses"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * Reads: `1`"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * Writes: `1`"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Examples"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ```sway"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " use standards::src5::SRC5;"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " use nft::Constructor;"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " fn foo(contract: ContractId, owner: Identity) {"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "     let src_5_abi = abi(SRC5, contract.bits());"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "     assert(src_5_abi.owner() == State::Uninitialized);"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "     let constructor_abi = abi(Constructor, contract.bits());"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "     constructor_abi.constructor(owner);"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            "     assert(src_5_abi.owner() == State::Initialized(owner));"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " }"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ```"
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "contractId",
          "type": 7,
          "typeArguments": null
        }
      ],
      "name": "deregister",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Deregisters a contract"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Arguments"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * `contractId`: The ID of the contract to be deregistered"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Effects"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " Removes the contract ID from the registry"
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "contractId",
          "type": 7,
          "typeArguments": null
        },
        {
          "name": "owner",
          "type": 3,
          "typeArguments": null
        }
      ],
      "name": "register",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Registers a contract with its owner"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Arguments"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * `contractId`: The ID of the contract to be registered"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * `owner`: The Identity of the contract owner"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " # Effects"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " Inserts the contract ID and owner pair into the registry"
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    }
  ],
  "loggedTypes": [
    {
      "logId": "2161305517876418151",
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": "16280289466020123285",
      "loggedType": {
        "name": "",
        "type": 9,
        "typeArguments": []
      }
    },
    {
      "logId": "4571204900286667806",
      "loggedType": {
        "name": "",
        "type": 2,
        "typeArguments": []
      }
    },
    {
      "logId": "13294799498124198676",
      "loggedType": {
        "name": "",
        "type": 8,
        "typeArguments": []
      }
    },
    {
      "logId": "8719680026594948895",
      "loggedType": {
        "name": "",
        "type": 10,
        "typeArguments": []
      }
    }
  ],
  "messagesTypes": [],
  "configurables": []
};

const _storageSlots: StorageSlot[] = [];

export const PropsRegistryContractAbi__factory = {
  abi: _abi,

  storageSlots: _storageSlots,

  createInterface(): PropsRegistryContractAbiInterface {
    return new Interface(_abi) as unknown as PropsRegistryContractAbiInterface
  },

  connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): PropsRegistryContractAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as PropsRegistryContractAbi
  },

  async deployContract(
    bytecode: BytesLike,
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<DeployContractResult<PropsRegistryContractAbi>> {
    const factory = new ContractFactory(bytecode, _abi, wallet);

    return factory.deployContract<PropsRegistryContractAbi>({
      storageSlots: _storageSlots,
      ...options,
    });
  },
}
