<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { Loader2, Plus } from 'lucide-svelte';
	import { wallet, connected, connect } from 'svelte-fuels';
	import { PropsSDK, Collection } from '@props/fuels';
    import { debounce } from 'lodash';
    const dispatch = createEventDispatcher();

    let propsClient:PropsSDK|null;

    let name: string = '';
    let symbol: string = '';
    let baseUri: string = '';
    let price: number = 0;

    let options: any = {
        maxSupply: 1000,
        builderFeeAddress: '0x0000000000000000000000000000000000000000',
        builderFee: 0,
        builderRevenueShareAddress: '0x0000000000000000000000000000000000000000',
        builderRevenuePercentage: 0
    }

    let loading = false;
    let loadingMessage = "";
    let previewImages: string[] = [];
    let previewLoading = false;

    $: isFormValid = name && symbol && baseUri && options.maxSupply > 0 && price >= 0;

    onMount(() => {
        propsClient = new PropsSDK({
            apiKey: 'YOUR_API_KEY',
            network: 'testnet'
        })
    })

    const handleCreateCollection = async () => {
        if(!propsClient || !$wallet) {
            console.error("Props client not initialized");
            return;
        };

        loading = true;

        propsClient.collections.on('transaction', (data) => {
            console.log("Waiting for transaction: ", data);
            loadingMessage = "Please approve transaction " + data.transactionIndex + " of " + data.transactionCount;
        });

        propsClient.collections.on('pending', (data) => {
            console.log("Pending transaction: ", data);
            loadingMessage = "Please wait for transaction to clear...";
        });

        console.log("Creating collection with baseUri: ", baseUri);

        propsClient.collections.create({
            name,
            symbol,
            baseUri,
            price, // #TODO Convert price to wei (1 ETH = 1e9 wei in Fuel)
            options: {
                ...options,
                owner: $wallet,
            }
        }).then((collection:Collection) => {
            console.log("Collection created: ", collection);
            loading = false;
            loadingMessage = '';
            dispatch('close');
            dispatch('created', collection);
        }).catch(error => {
            console.error("Error creating collection: ", error);
            loading = false;
            loadingMessage = '';
        });
    }

    const loadPreviewImages = debounce(async () => {
        if (!baseUri) return;
        
        previewLoading = true;
        previewImages = [];
        try {
            for (let i = 1; i <= 3; i++) {
                const response = await fetch(baseUri + i);
                const data = await response.json();
                previewImages.push(data.image);
            }
        } catch (error) {
            console.error("Error loading preview images:", error);
        } finally {
            previewLoading = false;
        }
    }, 2000);

    $: {
        if (baseUri) {
            loadPreviewImages();
        } else {
            previewImages = [];
        }
    }
</script>

<div class="flex flex-col gap-4">
    <div>
        <h1>Launch Your Collection</h1>
    </div>
    <div class="flex gap-4">
        <div class="flex-1">
            <div class="flex flex-col gap-3 w-full">
                <div class="flex flex-col md:flex-row gap-3">
                    <input class="input input-bordered w-full" type="text" required bind:value={name} placeholder="Name (E.g. 'Props Collection')">
                    <input class="input input-bordered w-full" type="text" required bind:value={symbol} placeholder="Symbol (E.g. 'PNFT')">
                </div>
                <input class="input input-bordered w-full" type="text" required bind:value={baseUri} placeholder="Base URI">

                <div class="flex gap-2">
                    <label for="maxSupply" class="label w-[100px]">Max Supply</label>
                    <input id="maxSupply" required class="input input-bordered w-full" type="number" bind:value={options.maxSupply} placeholder="Max Supply" />
                </div>

                <div class="flex gap-2">
                    <label for="price" class="label w-[100px]">Price</label>
                    <input id="price" required class="input input-bordered w-full" type="number" min="0" step="0.01" bind:value={price} placeholder="Price" />
                </div>
            </div>
            <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-4">
                <input type="checkbox" /> 
                <div class="collapse-title font-medium">
                    Advanced Options
                </div>
                <div class="collapse-content"> 
                    <div class="flex flex-col gap-3">
                        <div class="flex gap-2">
                            <label for="builderFeeAddress" class="label w-[150px]">Builder Fee Address</label>
                            <input id="builderFeeAddress" class="input input-bordered w-full" type="text" bind:value={options.builderFeeAddress} placeholder="Builder Fee Address" />
                        </div>
                        <div class="flex gap-2">
                            <label for="builderFee" class="label w-[150px]">Builder Fee</label>
                            <input id="builderFee" class="input input-bordered w-full" type="number" bind:value={options.builderFee} placeholder="Builder Fee" min="0" step="1" />
                        </div>
                        <div class="flex gap-2">
                            <label for="builderRevenueShareAddress" class="label w-[150px]">Builder Revenue Share Address</label>
                            <input id="builderRevenueShareAddress" class="input input-bordered w-full" type="text" bind:value={options.builderRevenueShareAddress} placeholder="Builder Revenue Share Address" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="builderRevenuePercentage" class="label flex justify-between">
                                <span>Builder Revenue Percentage</span>
                                <span>{options.builderRevenuePercentage}%</span>
                            </label>
                            <input id="builderRevenuePercentage" type="range" min="0" max="100" bind:value={options.builderRevenuePercentage} class="range" step="1" />
                            <div class="w-full flex justify-between text-xs px-2">
                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-1 flex items-center justify-center">
            {#if previewLoading}
                <div class="animate-spin">
                    <Loader2 size={48} />
                </div>
            {:else if previewImages.length > 0}
                <div class="relative w-64 h-64">
                    {#each previewImages as image, i}
                        <img src={image} alt="Preview {i+1}" class="absolute max-w-full max-h-64 object-contain shadow-lg" style="top: {-15 + i * 10}px; left: {-15 + i * 10}px; z-index: {3 - i};" />
                    {/each}
                </div>
            {:else}
                <div class="text-gray-400">No preview available</div>
            {/if}
        </div>
    </div>
    <div class="flex flex-col md:flex-row justify-end gap-2">
        <button class="btn btn-lg btn-ghost" on:click={() => dispatch('close')}>Cancel</button>
        {#if !$connected}
        <button class="btn btn-primary btn-lg" on:click={connect}>
            Connect Wallet
        </button>
        {:else}
        {#key loadingMessage}
        <button disabled={!isFormValid} class="btn btn-primary btn-lg" on:click|stopPropagation={handleCreateCollection}>
            {#if loading}
                <span class="animate-spin mr-2">
                    <Loader2/>
                </span>
                <span>{loadingMessage}</span>
            {:else}
                Create Collection
            {/if}
        </button>
        {/key}
        {/if}
    </div>
</div>