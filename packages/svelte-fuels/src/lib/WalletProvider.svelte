<script lang="ts">
	import { onMount } from 'svelte';
	import { createWalletStore } from './index.js';

	onMount(() => {
		createWalletStore();
	});
</script>

<slot />
