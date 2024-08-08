<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let open: boolean = false;
</script>

<dialog id="my_modal_2" class="modal {open ? 'modal-open' : ''}" on:close={() => dispatch('close')}>
  <div class="modal-box max-w-3xl border-2 border-base-300">
    <slot/>
  </div>
  <form method="dialog" class="modal-backdrop" on:submit={() => dispatch('close')}>
    <button>close</button>
  </form>
</dialog>