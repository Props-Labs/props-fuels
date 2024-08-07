<script lang="ts">
	import type { Edition } from "@props/fuels";

    export let item:Edition;
</script>

<li class="p-4 rounded-md bg-base-200">
    {item.id} {JSON.stringify(item.metadata)}
</li>