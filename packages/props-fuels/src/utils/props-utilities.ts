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
      const addressBytes = Buffer.from(entry.address.slice(2), "hex");
      const amountBytes = Buffer.alloc(8);
      amountBytes.writeBigUInt64LE(BigInt(entry.amount));
      const concatenatedBytes = Buffer.concat([addressBytes.reverse(), amountBytes]);
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

  /**
   * Parses and normalizes URLs, supporting IPFS URIs and CIDs.
   * @param {string} url - The URL or CID to parse.
   * @returns {string} The normalized URL.
   */
  static parseUrl(url: string): string {
    // Check if the input is a valid CID
    const isCID = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50})$/.test(url);

    if (isCID) {
      // If it's a CID, convert it to an IPFS gateway URL
      return `https://ipfs.io/ipfs/${url}`;
    } else if (url.startsWith('ipfs://')) {
      // Convert IPFS URI to a gateway URL
      const cid = url.slice(7);
      return `https://ipfs.io/ipfs/${cid}`;
    } else if (url.startsWith('ar://')) {
      // Convert Arweave URI to a gateway URL
      const id = url.slice(5);
      return `https://arweave.net/${id}`;
    } else if (url.startsWith('data:')) {
      // Data URIs are returned as-is
      return url;
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Assume HTTPS for URLs without a protocol
      return `https://${url}`;
    }
    // Return other URLs as-is
    return url;
  }
}
