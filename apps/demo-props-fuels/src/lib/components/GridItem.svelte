<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
	import { Collection, type Edition, type NFTMetadata } from "@props/fuels";
  export let item:Edition|Collection;
  export let type: 'edition'|'collection' = 'edition';
  const dispatch = createEventDispatcher();

  let tokens: Array<NFTMetadata> = item instanceof Collection ? item.sampleTokens || [] : [];

  onMount(async() => {
    if(type === 'collection' && (item as Collection).sampleTokens.length === 0) {
      tokens = await (item as Collection).fetchSampleTokens();
    }
  });
</script>

<div class="card w-full bg-base-200 shadow-xl">
  {#if type === 'collection' && tokens && tokens.length > 0}
    <figure class="bg-base-300 relative min-h-40 flex items-center justify-center">
      <div class="w-64 h-64 relative">
      {#each tokens as token, index}
        <img src={token.image} alt={token.name || 'Image'} class="absolute max-w-40 min-w-40 min-h-40 m-6 border-base-100 border-2 bg-white rounded-md shadow-lg" style="top: {index * 10}px; left: {index * 10}px; z-index: {3 - index};" />
      {/each}
      </div>
    </figure>
  {:else if item.metadata && item.metadata.image}
    <figure class="bg-base-300">
      <img src={item.metadata.image} alt={item.metadata.name || 'Image'} class="max-w-40 min-w-40 min-h-40 m-6 border-base-100 border-2 bg-white rounded-md shadow-lg"/>
    </figure>
  {/if}
  <div class="card-body">
    {#if type === 'collection' && tokens && tokens[0]}
      <h2 class="card-title !mb-0 !pb-0">{tokens[0].name}</h2>
      {#if tokens[0].description}
        <p class="line-clamp-3">{tokens[0].description}</p>
      {/if}
      {#if tokens[0].attributes && tokens[0].attributes.length > 0}
        <h3 class="text-sm font-bold">Attributes</h3>
        <ul class="list-disc list-inside">
          {#each tokens[0].attributes as attribute}
            <li>{attribute.trait_type}: {attribute.value}</li>
          {/each}
        </ul>
      {/if}
    {:else}
      {#if item.metadata && item.metadata.name}
        <h2 class="card-title !mb-0 !pb-0">{item.metadata.name}</h2>
      {/if}
      {#if item.metadata && item.metadata.description}
        <p>{item.metadata.description}</p>
      {/if}
      {#if item.metadata && item.metadata.attributes && item.metadata.attributes.length > 0}
        <h3 class="text-sm font-bold">Attributes</h3>
        <ul class="list-disc list-inside">
          {#each item.metadata.attributes as attribute}
            <li>{attribute.trait_type}: {attribute.value}</li>
          {/each}
        </ul>
      {/if}
    {/if}
    <small class="w-[200px] text-xs">ID: {item.id}</small>
  </div>
  <div class="card-actions justify-end p-4">
    <button class="btn btn-primary btn-lg" on:click={() => dispatch('mint', item)}>Mint</button>
    <button class="btn btn-primary btn-lg" on:click={() => dispatch('airdrop', item)}>Airdrop To Self</button>
  </div>
</div>