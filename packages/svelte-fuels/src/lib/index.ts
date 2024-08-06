export { default as WalletProvider } from './WalletProvider.svelte';

import { Fuel, BN, Account } from 'fuels';
import { FuelWalletConnector } from '@fuels/connectors';

import { derived, writable } from 'svelte/store';

const fuel = new Fuel({
	connectors: [new FuelWalletConnector()]
});

type WalletState = {
	connected: boolean;
	currentAccount?: string;
	hasConnector?: boolean;
	wallet?: Account;
	walletBalance?: BN;
	fuel?: Fuel;
};

export const walletStore = writable<WalletState>({
	connected: false
});

export const loading = writable(true);

export const connected = derived(walletStore, ($walletStore) => {
	return $walletStore.connected;
});

export const account = derived(walletStore, ($walletStore) => {
	return $walletStore.currentAccount;
});

export const wallet = derived(walletStore, ($walletStore) => {
	return $walletStore.wallet;
});

export const fuelStore = derived(walletStore, ($walletStore) => {
	return $walletStore.fuel;
});

export const createWalletStore = () => {
	const handleConnection = async () => {
		const connected = await fuel?.isConnected();
		const hasConnector = await fuel?.hasConnector();

		let currentAccount: string | null = null;
		let wallet: Account | undefined = undefined;

		if (connected) {
			try {
				currentAccount = await fuel?.currentAccount();
				wallet = await fuel?.getWallet(currentAccount as string);
			} catch (e) {
				console.error(e);
				fuel?.disconnect();
				handleConnection();
			}
		}

		walletStore.update((state) => {
			state.connected = connected || false;
			state.currentAccount = currentAccount || undefined;
			state.hasConnector = hasConnector;
			state.wallet = wallet || undefined;
			state.fuel = fuel;

			return state;
		});
		loading.set(false);
	};

	fuel?.on(fuel.events.connection, handleConnection);
    fuel?.on(fuel.events.accounts, handleConnection);
    fuel?.on(fuel.events.currentAccount, handleConnection);
    fuel?.on(fuel.events.currentNetwork, handleConnection);
    fuel?.on(fuel.events.networks, handleConnection);

	handleConnection();
};

export const connect = async () => {
    await fuel?.connect();
};

export const disconnect = async () => {
    await fuel?.disconnect();
};
