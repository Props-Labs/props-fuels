<script lang="ts">
    import { onMount } from 'svelte'
    import { type Edition, type Collection, PropsSDK } from '@props-labs/fuels'
    import { account, connect, connected, createWalletStore, wallet, loading as loadingWallet } from 'svelte-fuels';
	import List from '$lib/components/List.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import { Loader2 } from 'lucide-svelte';
	import CreateModal from '$lib/components/CreateModal.svelte';
	import CreateCollectionModal from '$lib/components/CreateCollectionModal.svelte';
	import { success } from '$lib/utils/notifications';
	import { airdropping, minting } from '$lib/utils/store';

    let editions:Edition[] = [];
    let collections:Collection[] = [];
    let editionsLoaded = false;
    let collectionsLoaded = false;
    let loading = false;
    let loadingMessage = '';
    let propsClient:PropsSDK|null;

    let showCreate = false;
    let showCreateCollection = false;
    
    onMount(() => {
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
            editions[0].contract?.functions.price().get().then((result) => {
                console.log("Price: ", result);
            }).catch(error => {
                console.error("Error getting price: ", error);
            });
        }).catch(error => {
            console.error("Error listing editions: ", error);
        });
    }

    const listCollections = async () => {
        if(!propsClient || !$wallet) {
            console.error("Props client not initialized");
            return;
        };
        propsClient.collections.list($wallet).then((result) => {
            collections = result;
            collectionsLoaded = true;
            console.log("Collections: ", collections);
        }).catch(error => {
            console.error("Error listing collections: ", error);
        });
    }

    const mint = (edition: Edition) => {
        console.log("Minting: ", edition);
        $minting = true;
        if(!$wallet || !$wallet.address) return;
        edition.mint($wallet?.address.toString(), 1).then((result) => {
            console.log("Minted: ", result);
            success("Minted 1 successfully");
            $minting = false;
        }).catch(error => {
            console.error("Error minting: ", error);
            $minting = false;
        });
    }

    const airdrop = (edition: Edition) => {
        console.log("Airdropping: ", edition);
        $airdropping = true;
        if(!$wallet || !$wallet.address) return;
        edition.airdrop($wallet?.address.toString(), 1).then((result) => {
            console.log("Airdropped: ", result);
            success("Airdropped 1 successfully");
            $airdropping = false;
        }).catch(error => {
            console.error("Error airdropping: ", error);
            $airdropping = false;
        });
    }

    $: if($connected && propsClient) {
        listEditions();
        listCollections();
    }
</script>

<div class="container mx-auto p-4 flex flex-col gap-6">
  <div class="hero bg-base-200 min-h-[50vh]">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Welcome to PropsSDK for Fuel Demo</h1>
        <p class="py-6">
            This is a demo application to showcase the PropsSDK for Fuel. You can create editions and collections and list them here.
        </p>
        <div class="flex justify-center gap-4">
            {#if $connected}
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
            <button class="btn btn-secondary btn-lg" on:click|stopPropagation={() => showCreateCollection = true}>
                Create Collection
            </button>
            {:else}
                <button disabled={$loadingWallet} class="btn btn-secondary btn-lg" on:click|stopPropagation={() => connect()}>
                    {#if $loadingWallet}
                        <span class="animate-spin mr-2">
                            <Loader2/>
                        </span>
                    {/if}
                    Connect Wallet
                </button>
            {/if}
        </div>
      </div>
    </div>
  </div>

  <main class="flex flex-col gap-3 justify-center mb-40">
    {#if $connected}
    <h2 class="text-3xl text-center">My Editions</h2>
    {#if editionsLoaded}
        {#if editions.length > 0}
            <Grid items={editions} 
            on:mint={(e) => mint(e.detail)} 
            on:airdrop={(e) => airdrop(e.detail)} 
            />
        {:else}
            <div class="bg-base-200 p-8 text-center rounded-lg">
                <p class="text-xl">No editions created yet</p>
            </div>
        {/if}
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

    <h2 class="text-3xl text-center mt-8">My Collections</h2>
    {#if collectionsLoaded}
        {#if collections.length > 0}
            <Grid items={collections} type="collection" />
        {:else}
            <div class="bg-base-200 p-8 text-center rounded-lg">
                <p class="text-xl">No collections created yet</p>
            </div>
        {/if}
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

<CreateModal open={showCreate} on:close={() => showCreate = false} on:created={(e) => {editions = [e.detail,...editions]; success("Edition created successfully"); }}/>
<CreateCollectionModal open={showCreateCollection} on:close={() => showCreateCollection = false} on:created={(e) => {collections = [e.detail,...collections]; success("Collection created successfully"); }}/>