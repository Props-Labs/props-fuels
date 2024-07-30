# Creating Editions

Editions in the Octane SDK represent a limited supply serial edition of a token. Each edition has a unique identifier, a name, and associated metadata. The metadata includes details such as the name, description, and image URL of the NFT. The metadata follows the standard equivalent of the ERC721 metadata as defined by [Opensea Standards](https://docs.opensea.io/docs/metadata-standards).

## Creating an Edition

To create an edition, you need to use the `create` method of the `edition` object in the `Octane` SDK. Below is a guide on how to create an edition.

### Step 1: Call the `create` Method

Use the `create` method to create a new edition. You need to provide the name of the edition and its metadata.

```javascript
const editionId = await octane.edition.create('Edition 1', {
  name: 'Edition 1',
  description: 'First edition',
  image: 'image_url',
}, {
  maxSupply: 1000, // defaults to 100 if not set
});
```

