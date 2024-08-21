<script>
  import { SvelteToast } from '@zerodevx/svelte-toast'

  // Optionally set default options here
  const options = {
    duration: 15000,
    position: 'bottom-right',
    type: 'success',
    dismissible: true,
    pauseOnHover: true,
    accent: '#ee0000',
    theme: 'dark',
    transition: 'fade'
  }
</script>

<slot/>

<SvelteToast {options} />

<style>
    :global(:root){
        --toastContainerBottom: 20px;
    }
</style>