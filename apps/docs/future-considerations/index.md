# Future Considerations

As the PropsSDK for Fuel continues to evolve, there are several areas where we envision potential extensions and improvements. This section outlines some of the future considerations for expanding the capabilities of the SDK.

- **Indexing Other NFT Contracts** - At the time of writing and to our knowledge, there is no way  to understand the nature of an NFT contract without knowing its abi (e.g. an equivalent to supportsInterface on EVM). This means that we are unable to index and display NFTs from contracts that are not deployed by us aka bytecode not known. It would be awesome to be able to use partial abis to query a contract and understand the standard it conforms to.

- **Royalty Enforcement** - in order to enforce royalties on secondary sales, we need to implement a way to track and enforce royalties on secondary sales. Due to fuel's current limitations (native asset transfers are controlled by the chain) this is currently not possible.

- **1155 Support** - Implement support for ERC1155 tokens

- **Auction Support** - Implement support for Auctions Mechanics (Regular, Dutch, English)

- **ERC6551 Support** - Implement support for ERC6551 - Allowing assets to own other assets.

- **ERC6059 Support** - Implement support for ERC6059 - Allowing assets to maintain child/parent relationships.

- **Revenue Split Protocols** - Implement support for revenue split protocols similar to 0xSplits

- **Credit Card Checkout** - Implement support for credit card checkout

