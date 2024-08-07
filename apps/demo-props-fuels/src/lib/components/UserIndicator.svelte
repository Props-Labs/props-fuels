<script>
    import { fuelStore, connected, account, loading } from "svelte-fuels";
    import { Loader2, Wallet } from 'lucide-svelte'; 
</script>

<div>
    {#if !$connected}
        <button disabled={$loading} class="btn btn-primary" on:click={() => {
            $fuelStore?.connect();
        }}>
            {#if $loading}
                <span class="animate-spin mr-2">
                    <Loader2/>
                </span>
                <span>Connecting...</span>
            {:else}
                Connect Wallet
            {/if}
        </button>
    {:else}
        <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost">
                <span class="indicator-item badge badge-success mr-2"></span>
                <Wallet size={16} />
                {$account?.substring(0, 6)}...{$account?.substring($account.length - 4)}
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                    <a on:click={() => {
                        $fuelStore?.disconnect();
                    }}>Disconnect</a>
                </li>
            </ul>
        </div>
    {/if}
</div>