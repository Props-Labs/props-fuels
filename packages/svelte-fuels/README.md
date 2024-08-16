# Svelte-Fuels

Svelte-Fuels is a package that provides a collection of Svelte stores and functions for integrating authentication using Fuels with Svelte. It utilizes the Fuels SDK for wallet management and transaction signing.

## Installation

To install the package and its peer dependencies, run the following command:

```bash
npm install svelte-fuels fuels
```

## Usage

To initialize the package, you can simply wrap you layout slot in the provided WalletProvider component.

```svelte
<script>
  import { WalletProvider } from 'svelte-fuels';
</script>

<WalletProvider>
  <slot />
</WalletProvider>
```

### Stores

- **connected**: Indicates whether the application is currently connected to a Fuel provider. It is a boolean store.
- **account**: Contains the wallet address of the connected account. It is a string store.
- **wallet**: Contains the wallet instance. It is an object store.
- **fuel**: Contains the Fuel instance. It is an object store.

### Functions

- **createWalletStore**: Initializes the wallet store. Call this function to set up the wallet connection.
- **disconnect**: Disconnects the current wallet.
- **connect**: Connects to a Fuel provider.

### Example Usage

#### `connected`

The `connected` store indicates whether the application is currently connected to a Fuel provider.

```svelte
<script>
  import { connected } from 'svelte-fuels';
</script>

{#if $connected}
  <p>Connected to Fuel</p>
{:else}
  <p>Not connected to Fuel</p>
{/if}
```

#### `account`

The `account` store contains the wallet address of the connected account.

```svelte
<script>
  import { account } from 'svelte-fuels';
</script>

{#if $account}
  <p>Wallet Address: {$account}</p>
{:else}
  <p>No wallet connected</p>
{/if}
```

#### `wallet`

The `wallet` store contains the wallet instance.

```svelte
<script>
  import { wallet } from 'svelte-fuels';
</script>

{#if $wallet}
  <p>Wallet is initialized</p>
{:else}
  <p>No wallet available</p>
{/if}
```

#### `fuel`

The `fuelStore` store contains the Fuel instance.

```svelte
<script>
  import { fuelStore } from 'svelte-fuels';
</script>

{#if $fuelStore}
  <p>Fuel instance is available</p>
{:else}
  <p>No Fuel instance</p>
{/if}
```

### `createWalletStore`

The `createWalletStore` function initializes the wallet store. Call this function to set up the wallet connection.

```svelte
<script>
  import { createWalletStore } from 'svelte-fuels';

  createWalletStore();
</script>
```

### `disconnect`

The `disconnect` function disconnects the current wallet.

```svelte
<script>
  import { disconnect } from 'svelte-fuels';

  function handleDisconnect() {
    disconnect();
  }
</script>

<button on:click={handleDisconnect}>Disconnect from Fuel</button>
```

### `connect`

The `connect` function connects to a Fuel provider.

```svelte
<script>
  import { connect } from 'svelte-fuels';

  async function handleConnect() {
    await connect();
  }
</script>

<button on:click={handleConnect}>Connect to Fuel</button>
```

## Roadmap

This is a basic package created for projects that require authentication using Fuels with Svelte. Additional features can be added based on community feedback and requirements.
