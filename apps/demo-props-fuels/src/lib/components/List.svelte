<script>
	import ListItem from "./ListItem.svelte";

    export let items;
    console.log("Items: ", items);
</script>

<ul class="flex flex-col gap-3">
    {#each items as item (item.id)}
        <ListItem {item} />
    {/each}
</ul>
