<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Loader2, Plus } from 'lucide-svelte';
    import Select from 'svelte-select';
    const dispatch = createEventDispatcher();

    let media: string = '';
    let mediaType: string = '';
    let name: string = 'My Token';
    let symbol: string = 'MTKN';
    let description: string = '';
    let maxSupply: number = 1000;
    let price: number = 0;
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    let metadata: any = {
        attributes: []
    };

    let fileInput: HTMLInputElement | null = null; 
    let file: File | null = null;
    let localFileUrl: string | null = null;

    const handleCreate = () => {
        // TODO: Create the edition
    };

    const handleFileChange = (event: Event) => {
        const selectedFile = (event.target as HTMLInputElement).files?.[0];
        if (selectedFile) {
            file = selectedFile;
            localFileUrl = URL.createObjectURL(selectedFile);
            mediaType = selectedFile.type;
        }
    };
</script>

<div class="flex flex-col gap-4">
    <div>
        <h1>Launch Your Edition</h1>
    </div>
    <div class="flex flex-col md:flex-row gap-4 mt-4">
        <div class="flex flex-col gap-2 order-last md:order-first">
            <input bind:this={fileInput} accept="image/jpeg,image/png,image/gif,video/mp4" type="file" id="fileInput" on:change={handleFileChange} hidden>
            <div on:keydown on:click={() => fileInput?.click()} class="btn btn-ghost w-full min-w-72 min-h-72 text-primary border-2 border-base-300 shrink-0 object-cover rounded-lg bg-base-300 flex items-center justify-center p-0">
                {#if localFileUrl}
                    {#if mediaType.startsWith('image')}
                        <img src={localFileUrl} alt={name} class="object-contain h-full w-full" />
                    {:else if mediaType.startsWith('video')}
                        <video controlsList="nodownload" src={localFileUrl} muted autoplay loop playsinline class="object-contain w-full h-full"></video>
                    {:else}
                        <model-viewer id="reveal" loading="eager" auto-rotate src={localFileUrl} shadow-intensity="1" alt="{metadata?.description || ''}"></model-viewer>
                    {/if}
                {:else}
                    <Plus size=48 color="#FFF"/>
                {/if}
            </div>
            <p class="text-xs opacity-50 leading-0">Supported Types: Image (PNG, JPEG, GIF), Video (MP4)</p>
            <p class="text-xs opacity-50 leading-0 mt-2">Max File Size: 35MB (Image), 100MB (Video)</p>
        </div>
        <div class="flex flex-col gap-3 w-full">

            <div class="flex flex-col md:flex-row gap-3">
                <input class="input input-bordered w-full" type="text" bind:value={name} placeholder="Name (E.g. 'Props Edition Tokens')">
                <input class="input input-bordered w-full" type="text" bind:value={symbol} placeholder="Symbol (E.g. 'PNFTE')">
            </div>
            <textarea maxlength="250" class="textarea grow textarea-bordered w-full" bind:value={metadata.description} placeholder="Description"></textarea>

            <div class="flex gap-2">
                <label for="maxSupply" class="label w-[100px]">Max Supply</label>
                <input id="maxSupply" class="input input-bordered w-full" type="number" bind:value={maxSupply} placeholder="Max Supply" />
            </div>

            <div class="flex gap-2">
                <label for="price" class="label w-[100px]">Price</label>
                <input id="price" class="input input-bordered w-full" type="number" min="0" step="0.01" bind:value={price} placeholder="Price" />
            </div>

            <div class="flex flex-col gap-3 mt-4">
                <h3 class="text-lg font-semibold">Attributes</h3>
                {#each metadata.attributes as attribute, i}
                    <div class="flex gap-2 items-center">
                        <input
                            class="input input-bordered w-full"
                            type="text"
                            bind:value={attribute.trait_type}
                            placeholder="Trait Type"
                        />
                        <input
                            class="input input-bordered w-full"
                            type="text"
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
    <div class="flex flex-col md:flex-row justify-end gap-2">
        <button class="btn btn-lg btn-ghost" on:click={() => dispatch('close')}>Cancel</button>
        <button class="btn btn-lg btn-primary" on:click|preventDefault|stopPropagation={handleCreate}>
            Create
        </button>
    </div>
</div>