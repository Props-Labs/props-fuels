<script>
	import GridItem from "./GridItem.svelte";
	import ListItem from "./ListItem.svelte";

    export let items;
    console.log("Items: ", items);
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each items as item (item.id)}
        <GridItem {item} />
    {/each}
</div>
