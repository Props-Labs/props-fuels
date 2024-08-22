<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import GridItem from "./GridItem.svelte";
	import type { Edition } from '@props-labs/fuels';

    export let items: Array<Edition | Collection>;
    export let type: 'collection' | 'edition' = 'edition';
    const dispatch = createEventDispatcher();
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each items as item (item.id)}
        <GridItem {item} {type} on:mint={() => dispatch('mint', item)} on:airdrop={() => dispatch('airdrop', item)}/>
    {/each}
</div>
