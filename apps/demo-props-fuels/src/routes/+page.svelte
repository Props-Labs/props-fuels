<script lang="ts">
    import { onMount } from 'svelte'
    import { PropsSDK } from '@props/fuels'
    import { account, connect, connected, createWalletStore, wallet } from 'svelte-fuels';
	import List from '$lib/components/List.svelte';

    let editionData = {};
    let editions = [];
    let editionsLoaded = false;
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
        propsClient.editions.create({
            name: 'My Edition',
            symbol: 'Ed1',
            metadata: {
                name: 'My Edition',
                description: 'This is my first edition',
                image: 'https://example.com/image.jpg',
            },
            options: {
                owner: $wallet,
                maxSupply: 1000,
            }
        }).then((edition) => {
            console.log("Edition created: ", edition)
            editionData = edition;
        }).catch(error => {
            console.error("Error creating edition: ", error);
        });
    }

    const listEditions = async () => {
        if(!propsClient) {
            console.error("Props client not initialized");
            return;
        };
        propsClient.editions.list($wallet?.address.toB256() ?? '', ).then((result) => {
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
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
          quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
        <button class="btn btn-primary btn-lg" on:click={handleCreateEdition}>Create Edition</button>
      </div>
    </div>
  </div>

  <main class="flex flex-col gap-3 justify-center">
    <h2 class="text-3xl text-center">My Editions</h2>
    <List items={editions} />
  </main>
</div>
