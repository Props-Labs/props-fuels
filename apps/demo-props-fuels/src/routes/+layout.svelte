<script>
	import Navbar from "$lib/components/Navbar.svelte";
  import "../app.pcss";
  import { WalletProvider } from 'svelte-fuels';
</script>

<WalletProvider>
  <Navbar/>
  <slot />
</WalletProvider>