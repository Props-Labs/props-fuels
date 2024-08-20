
import { NFTMetadata } from "../common/types";
import { BN } from "fuels";
import type { MetadataInput } from "../sway-api/contracts/Props721EditionContract";

/**
 * Encodes an NFTMetadata object into an array of values of MetadataInput.
 * @param {NFTMetadata} metadata - The metadata to encode.
 * @returns {Array<MetadataInput>} The encoded metadata.
 */
export function encodeMetadataValues(metadata: NFTMetadata): Array<MetadataInput> {
  return Object.entries(metadata).map(([key, value]) => {
    if (typeof value === "string") {
      return { String: value } as MetadataInput;
    } else if (typeof value === "number") {
      return { Int: value } as MetadataInput;
    } else if (BN.isBN(value)) {
      return { Int: value.toNumber() } as MetadataInput;
    } else {
      try {
        return { String: JSON.stringify(value) } as MetadataInput;
      } catch (error) {
        throw new Error(`Unsupported metadata value for key ${key}`);
      }
    }
  });
}

/**
 * Decodes a two-dimensional array of MetadataInput into an NFTMetadata object.
 * @param {Array<[string, MetadataInput]>} encodedMetadata - The encoded metadata to decode.
 * @returns {NFTMetadata} The decoded metadata.
 */
export function decodeContractMetadata(encodedMetadata: Array<[string, MetadataInput]>): NFTMetadata {
  const metadata: Partial<NFTMetadata> = {};

  encodedMetadata.forEach(([key, input]) => {
    if (key === 'attributes' && 'String' in input) {
      try {
        if (input.String !== undefined) {
          metadata[key] = JSON.parse(input.String);
        } else {
          throw new Error(`String value is undefined for key ${key}`);
        }
      } catch {
        throw new Error(`Failed to parse attributes for key ${key}`);
      }
    } else if ('String' in input) {
      try {
        if (input.String !== undefined) {
          try {
            metadata[key] = JSON.parse(input.String);
          } catch {
            metadata[key] = input.String;
          }
        } else {
          throw new Error(`String value is undefined for key ${key}`);
        }
      } catch {
        throw new Error(`Unsupported metadata input for key ${key}`);
      }
    } else if ('Int' in input) {
      if (input.Int !== undefined) {
        metadata[key] = (input as MetadataInput).Int;
      } else {
        throw new Error(`Int value is undefined for key ${key}`);
      }
    }
  });

  return metadata as NFTMetadata;
}



