<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Modal from './Modal.svelte';
	import CreateCollectionFormDemo from './CreateCollectionFormDemo.svelte';

    export let open: boolean = false;
    const dispatch = createEventDispatcher();
</script>

<Modal open={open} on:close={() => dispatch('close')}>
    <CreateCollectionFormDemo on:close={() => dispatch('close')} on:created={(e) => dispatch('created', e.detail)}/>
</Modal>
