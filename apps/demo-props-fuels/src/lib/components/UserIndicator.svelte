<script>
    import { fuelStore, connected, account } from "svelte-fuels";
    import { Wallet } from 'lucide-svelte'; 
</script>

<div>
    {#if !$connected}
        <button class="btn btn-primary" on:click={() => {
            $fuelStore?.connect();
        }}>Connect</button>
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