<script lang="ts">
    import { onMount } from 'svelte'
    import { type Edition, PropsSDK } from '@props/fuels'
    import { account, connect, connected, createWalletStore, wallet } from 'svelte-fuels';
	import List from '$lib/components/List.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import { Loader2 } from 'lucide-svelte';
	import CreateModal from '$lib/components/CreateModal.svelte';

    let editions:Edition[] = [];
    let editionsLoaded = false;
    let loading = false;
    let loadingMessage = '';
    let propsClient:PropsSDK|null;
    let showCreate = false;

    onMount(() => {
        createWalletStore();
        console.log("We're here");
        propsClient = new PropsSDK({
            apiKey: 'YOUR_API_KEY',
            network: 'testnet'
        })
        console.log("Octane initiated: ", propsClient);
    })

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

    const mint = (edition: Edition) => {
        console.log("Minting: ", edition);
        if(!$wallet || !$wallet.address) return;
        edition.mint($wallet?.address.toString(), 1).then((result) => {
            console.log("Minted: ", result);
        }).catch(error => {
            console.error("Error minting: ", error);
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
        <button disabled={loading} class="btn btn-primary btn-lg" on:click|stopPropagation={() => showCreate = true}>
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
        <Grid items={editions} on:mint={(e) => mint(e.detail)} />
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

<CreateModal open={showCreate} on:close={() => showCreate = false} on:created={(e) => editions = [e.detail,...editions]}/>