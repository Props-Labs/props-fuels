<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { Loader2, Plus } from 'lucide-svelte';
	import { wallet, connected, connect } from 'svelte-fuels';
	import { PropsSDK, Edition } from '@props-labs/fuels';
    const dispatch = createEventDispatcher();

    let propsClient:PropsSDK|null;

    let symbol: string = '';

    let price: number = 0;

    let startDate: Date = new Date();
    let endDate: Date = new Date();

    let metadata: any = {
        name: '',
        image: 'https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png',
        description: '',
        attributes: []
    };

    let options: any = {
        maxSupply: 1000,
        builderFeeAddress: '0x0000000000000000000000000000000000000000',
        builderFee: 0,
        builderRevenueShareAddress: '0x0000000000000000000000000000000000000000',
        builderRevenuePercentage: 0
    }

    let loading = false;
    let loadingMessage = "";

    $: isFormValid = metadata.name && symbol && options.maxSupply > 0 && price >= 0 && 
        metadata.attributes.every((attr: {trait_type: string, value: string}) => attr.trait_type.trim() !== '' && attr.value.trim() !== '');

    onMount(() => {
        propsClient = new PropsSDK({
            apiKey: 'YOUR_API_KEY',
            network: 'testnet'
        })
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

        console.log("metadata: ", metadata);

        propsClient.editions.create({
            name: metadata.name,
            symbol,
            metadata,
            price, // #TODO Convert price to wei (1 ETH = 1e9 wei in Fuel)
            options: {
                ...options,
                owner: $wallet,
            }
        }).then((edition:Edition) => {
            console.log("Edition created: ", edition);
            loading = false;
            loadingMessage = '';
            dispatch('close');
            dispatch('created', edition);
        }).catch(error => {
            console.error("Error creating edition: ", error);
            loading = false;
            loadingMessage = '';
        });
    }
</script>

<div class="flex flex-col gap-4">
    <div>
        <h1>Launch Your Edition</h1>
    </div>
    <div class="flex flex-col md:flex-row gap-4 mt-4">
        <div class="flex flex-col gap-2 order-last md:order-first">
            <div class="w-full min-w-72 min-h-72 border-2 border-base-300 shrink-0 object-cover rounded-lg bg-base-300 flex items-center justify-center p-0 overflow-hidden">
                <img src={metadata.image} class="object-contain h-full w-full" />
            </div>
            <p class="text-xs opacity-50 leading-0">Fixed image from OpenSea for Demo purposes.</p>
        </div>
        <div class="flex flex-col gap-3 w-full">

            <div class="flex flex-col md:flex-row gap-3">
                <input class="input input-bordered w-full" type="text" required bind:value={metadata.name} placeholder="Name (E.g. 'Props Edition Tokens')">
                <input class="input input-bordered w-full" type="text" required bind:value={symbol} placeholder="Symbol (E.g. 'PNFTE')">
            </div>
            <textarea maxlength="250" class="textarea grow textarea-bordered w-full" bind:value={metadata.description} placeholder="Description"></textarea>

            <div class="flex gap-2">
                <label for="maxSupply" class="label w-[100px]">Max Supply</label>
                <input id="maxSupply" required class="input input-bordered w-full" type="number" bind:value={options.maxSupply} placeholder="Max Supply" />
            </div>

            <div class="flex gap-2">
                <label for="price" class="label w-[100px]">Price</label>
                <input id="price" required class="input input-bordered w-full" type="number" min="0" step="0.01" bind:value={price} placeholder="Price" />
            </div>

            <div class="flex flex-col gap-3 mt-4">
                <h3 class="text-lg font-semibold">Attributes</h3>
                {#each metadata.attributes as attribute, i}
                    <div class="flex gap-2 items-center">
                        <input
                            class="input input-bordered w-full"
                            type="text"
                            required
                            bind:value={attribute.trait_type}
                            placeholder="Trait Type"
                        />
                        <input
                            class="input input-bordered w-full"
                            type="text"
                            required
                            bind:value={attribute.value}
                            placeholder="Value"
                        />
                        <button
                            class="btn btn-square btn-outline btn-error"
                            on:click={() => {metadata.attributes.splice(i, 1); metadata = {...metadata}}}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                {/each}
                <button
                    class="btn btn-outline btn-primary w-full"
                    on:click={() => {metadata.attributes = [...metadata.attributes, { trait_type: '', value: '' }]; metadata = {...metadata}}}
                >
                    Add Attribute
                </button>
            </div>
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
    <div class="flex flex-col md:flex-row justify-end gap-2">
        <button class="btn btn-lg btn-ghost" on:click={() => dispatch('close')}>Cancel</button>
        {#if !$connected}
        <button class="btn btn-primary btn-lg" on:click={connect}>
            Connect Wallet
        </button>
        {:else}
        {#key loadingMessage}
        <button disabled={!isFormValid} class="btn btn-primary btn-lg" on:click|stopPropagation={handleCreateEdition}>
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
        {/if}
    </div>
</div>