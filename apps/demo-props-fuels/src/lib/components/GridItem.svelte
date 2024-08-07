<script lang="ts">
	import type { Edition } from "@props/fuels";

    export let item:Edition;
</script>

<div class="card w-full bg-base-200 shadow-xl">
  {#if item.metadata && item.metadata.image}
    <figure class="bg-base-300">
      <img src={item.metadata.image} alt={item.metadata.name || 'Image'} class="max-w-40 min-w-40 min-h-40 m-6 border-base-100 border-2 bg-white rounded-md shadow-lg"/>
    </figure>
  {/if}
  <div class="card-body">
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
    <small class="truncate w-[200px]">ID: {item.id}</small>
  </div>
  <div class="card-actions justify-end p-4">
    <button class="btn btn-primary btn-lg">Mint</button>
  </div>
</div>