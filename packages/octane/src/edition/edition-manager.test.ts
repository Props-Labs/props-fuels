// import { describe, it, expect, beforeEach } from "vitest";
// import { Provider, Account } from "fuels";
// import { EditionManager } from "./edition-manager";
// import { setup } from "../utils/setup";

// describe("EditionManager", () => {
//   let manager: EditionManager;

//   beforeEach(async () => {
//     manager = new EditionManager();
//   });

//   it("should create a new edition", async () => {
//     const editionId = await manager.create("Edition 1", {
//       name: "Edition 1",
//       description: "First edition",
//       image: "image_url",
//     });
//     expect(editionId).toBe("edition-id");
//   });

//   it("should list all editions", async () => {
//     const editions = await manager.list();
//     expect(editions).toBeInstanceOf(Array);
//   });

//   it("should get a specific edition", async () => {
//     const editionId = "some-edition-id";
//     const editionData = await manager.get(editionId);
//     expect(editionData).toBeDefined();
//   });

//   it("should mint a new token in a specific edition", async () => {
//     const editionId = "some-edition-id";
//     const recipient = "some-recipient-address";
//     const tokenId = await manager.mint(editionId, recipient);
//     expect(tokenId).toBe("token-id");
//   });

//   it("should update metadata of a specific edition", async () => {
//     const editionId = "some-edition-id";
//     const metadata = {
//       name: "Updated Edition",
//       description: "Updated description",
//       image: "updated_image_url",
//     };
//     await manager.updateMetadata(editionId, metadata);
//     // Verify that the function completes without errors
//   });
// });
