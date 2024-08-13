import { describe, it, expect, beforeEach, vi } from "vitest";
import { PropsUtilities } from "./props-utilities";

describe("PropsUtilities", () => {
  describe("createAllowlist", () => {
    it("should create an allowlist with valid entries", () => {
      const entries = [
        { address: "0x1234567890abcdef1234567890abcdef12345678", amount: 100 },
        { address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", amount: 200 },
      ];

      const result = PropsUtilities.createAllowlist(entries);

      console.log(result);

      expect(result).toHaveProperty("root");
      expect(result).toHaveProperty("allowlist");
      expect(Object.keys(result.allowlist)).toHaveLength(entries.length);
      entries.forEach((entry) => {
        expect(result.allowlist).toHaveProperty(entry.address);
        expect(Array.isArray(result.allowlist[entry.address].proof)).toBe(true);
      });
    });

    it("should throw an error if entries is not an array", () => {
      expect(() => {
        PropsUtilities.createAllowlist("invalid" as any);
      }).toThrow("Entries must be an array");
    });

    it("should throw an error if an entry has an invalid address or amount", () => {
      const invalidEntries = [
        { address: 12345, amount: 100 },
        {
          address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
          amount: "200",
        },
      ];

      invalidEntries.forEach((entry) => {
        expect(() => {
          PropsUtilities.createAllowlist([entry] as any);
        }).toThrow(
          "Each entry must have an address of type string and an amount of type number"
        );
      });
    });
  });
});
