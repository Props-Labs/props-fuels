import { calcRoot, constructTree, getProof } from "@fuel-ts/merkle";
import { toHex, sha256 } from "fuels";
import { Allowlist, AllowListInput } from "../common/types";

/**
 * Utility class for various Props related operations.
 */
export class PropsUtilities {
  /**
   * Creates an instance of PropsUtilities.
   */
  constructor() {}

  /**
   * Creates an allowlist for a given set of addresses and amounts.
   * @param {Array<{address: string, amount: number}>} entries - The entries to include in the allowlist.
   * @returns {{ root: string, allowlist: Allowlist }} An object containing the Merkle root and the allowlist with proofs.
   */
  static createAllowlist(entries: AllowListInput): {
    root: string;
    allowlist: Allowlist;
  } {
    // Validate entries
    if (!Array.isArray(entries)) {
      throw new Error("Entries must be an array");
    }

    for (const entry of entries) {
      if (
        typeof entry.address !== "string" ||
        typeof entry.amount !== "number"
      ) {
        throw new Error(
          "Each entry must have an address of type string and an amount of type number"
        );
      }
    }

    // Convert entries to leaves
    const leaves = entries.map((entry) => {
      const addressBytes = hexToUint8Array(entry.address.slice(2));
      const amountBytes = numberToLittleEndianUint8Array(entry.amount, 8);
      const concatenatedBytes = new Uint8Array([...addressBytes.reverse(), ...amountBytes]);
      const hash = sha256(toHex(concatenatedBytes));
      return hash;
    });

    // console.log("Leaves:", leaves);

    // Construct the Merkle tree
    const tree = constructTree(leaves);

    // Calculate the Merkle root
    const root = calcRoot(leaves);

    // Generate proofs for each leaf
    const allowlist: {
      [key: string]: { amount: number; proof: string[]; key: number };
    } = {};
    entries.forEach((entry, index) => {
      allowlist[entry.address] = {
        amount: entry.amount,
        proof: getProof(tree, index),
        key: index,
      };
    });

    return { root, allowlist };
  }
}

// Helper functions

function hexToUint8Array(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

function numberToLittleEndianUint8Array(num: number, byteLength: number): Uint8Array {
  const arr = new Uint8Array(byteLength);
  let value = BigInt(num);
  for (let i = 0; i < byteLength; i++) {
    arr[i] = Number(value & BigInt(255));
    value >>= BigInt(8);
  }
  return arr;
}