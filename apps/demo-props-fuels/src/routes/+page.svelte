<script lang="ts">
    import { onMount } from 'svelte'
    import { type Edition, PropsSDK } from '@props/fuels'
    import { account, connect, connected, createWalletStore, wallet } from 'svelte-fuels';
	import List from '$lib/components/List.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import { Loader2 } from 'lucide-svelte';

    let editions:Edition[] = [];
    let editionsLoaded = false;
    let loading = false;
    let loadingMessage = '';
    let propsClient:PropsSDK|null;

    onMount(() => {
        createWalletStore();
        console.log("We're here");
        propsClient = new PropsSDK({
            apiKey: 'YOUR_API_KEY',
            network: 'testnet'
        })
        console.log("Octane initiated: ", propsClient);
    })

    const handleCreateEdition = async () => {
        // console.log("Creating edition...");
        if(!propsClient || !$wallet) {
            console.error("Props client not initialized");
            return;
        };

        loading = true;

        propsClient.editions.on('transaction', (data) => {
            console.log("Waiting for transaction: ", data);
            loadingMessage = "Please approve transaction " + data.transactionIndex + " of " + data.transactionCount;
        });

        propsClient.editions.on('pending', (data) => {
            console.log("Pending transaction: ", data);
            loadingMessage = "Please wait for transaction to clear...";
        });

        propsClient.editions.create({
            name: 'My Edition',
            symbol: 'Ed1',
            metadata: {
                name: 'Friendly OpenSea Creature',
                description: 'Friendly OpenSea Creature that enjoys long swims in the ocean.',
                image: 'https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png',
                attributes: [
                    {
                        trait_type: 'Base',
                        value: 'Aqua'
                    },
                    {
                        trait_type: 'Eyes',
                        value: 'Waves'
                    },
                    {
                        trait_type: 'Mouth',
                        value: 'Smile'
                    }
                ]
            },
            options: {
                owner: $wallet,
                maxSupply: 1000,
            }
        }).then((edition) => {
            console.log("Edition created: ", edition)
            editions.push(edition);
        }).catch(error => {
            console.error("Error creating edition: ", error);
            loading = false;
            loadingMessage = '';
        });
    }

    const listEditions = async () => {
        if(!propsClient || !$wallet) {
            console.error("Props client not initialized");
            return;
        };
        propsClient.editions.list($wallet).then((result) => {
            editions = result;
            editionsLoaded = true;
            console.log("Editions: ", editions);
        }).catch(error => {
            console.error("Error listing editions: ", error);
        });
    }

    $: if($connected && propsClient) {
        listEditions();
    }
</script>

<div class="container mx-auto p-4 flex flex-col gap-6">
  <div class="hero bg-base-200 min-h-[50vh]">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Welcome to PropsSDK for Fuel Demo</h1>
        <p class="py-6">
            This is a demo application to showcase the PropsSDK for Fuel. You can create editions and list them here.
        </p>
        {#key loadingMessage}
        <button disabled={loading} class="btn btn-primary btn-lg" on:click={handleCreateEdition}>
            {#if loading}
                <span class="animate-spin mr-2">
                    <Loader2/>
                </span>
                <span>{loadingMessage}</span>
            {:else}
                Create Edition
            {/if}
        </button>
        {/key}
      </div>
    </div>
  </div>

  <main class="flex flex-col gap-3 justify-center mb-40">
    {#if $connected}
    <h2 class="text-3xl text-center">My Editions</h2>
    {#if editionsLoaded}
        <Grid items={editions} />
    {:else}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="w-full p-2 skeleton h-48 bg-base-200">
        </div>
        <div class="w-full p-2 skeleton h-48 bg-base-200">
        </div>
        <div class="w-full p-2 skeleton h-48 bg-base-200">
        </div>
    </div>
    {/if}
    {/if}
  </main>
</div>
