<script>
    import { createEventDispatcher } from 'svelte';
	import GridItem from "./GridItem.svelte";

    export let items;
    const dispatch = createEventDispatcher();
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each items as item (item.id)}
        <GridItem {item}  on:mint={() => dispatch('mint', item)}/>
    {/each}
</div>
