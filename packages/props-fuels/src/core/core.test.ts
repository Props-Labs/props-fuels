import { describe, it, expect, beforeEach, vi } from "vitest";
import { Account, AssetId } from "fuels";
import { PropsSDK } from "./core";
import { setup } from "../utils/setup";
import { supportedNetworks } from "../common/constants";

describe("PropsSDK", () => {
  let octane: PropsSDK;
  let wallets: Account[];

  beforeEach(async () => {
    const { wallet1, wallet2, wallet3, wallet4 } = await setup();
    wallets = [wallet1, wallet2, wallet3, wallet4];
  });

  it("should initialize Props with the correct network", async () => {
    octane = new PropsSDK({
      apiKey: "test-api-key",
      network: "beta-5",
    });

    expect(octane.getNetwork().id).toEqual("beta-5");
  });

  it("should throw an error if an unsupported network is provided", async () => {
    const supportedNetworkIds = supportedNetworks
      .map((net) => net.id)
      .join(", ");
    expect(() => {
      octane = new PropsSDK({
        apiKey: "test-api-key",
        network: "unsupported-network",
      });
    }).toThrowError(
      `Network unsupported-network is not supported. It must be one of: ${supportedNetworkIds}.`
    );
  });

  // it("should return the health status of the network", async () => {
  //   octane = new PropsSDK({
  //     apiKey: "test-api-key",
  //     network: "beta-5",
  //   });

  //   const mockResponse = {
  //     data: {
  //       health: "Healthy",
  //     },
  //   };
  //   // Mock the fetch function
  //   global.fetch = vi.fn(() =>
  //     Promise.resolve({
  //       ...new Response(),
  //       json: () => Promise.resolve(mockResponse),
  //     })
  //   );

  //   const healthStatus = await octane.getHealth();
  //   expect(healthStatus).toEqual(mockResponse);
  // });
});