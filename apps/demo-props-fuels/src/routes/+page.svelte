<script lang="ts">
    import { onMount } from 'svelte'
    import { Provider, Wallet } from 'fuels';
    import { PropsSDK, type Edition } from '@props/fuels'

    let editionData = {};

    onMount(() => {
        console.log("We're here");
        let octane = new PropsSDK({
            apiKey: 'YOUR_API_KEY',
            network: 'testnet'
        })
        console.log("Octane initiated: ", octane);

        const provider = Provider.create('https://testnet.fuel.network');
        const wallet = Wallet.generate({
            provider: provider,
            network: 'testnet'
        });
        console.log("New wallet created: ", wallet.address.toString());

        octane.editions.create({
            name: 'My Edition',
            symbol: 'Ed1',
            metadata: {
                name: 'My Edition',
                description: 'This is my first edition',
                image: 'https://example.com/image.jpg',
            },
            options: {
                owner: wallet,
                maxSupply: 1000,
            }
        }).then((edition: Edition) => {
            console.log("Edition created: ", edition)
            editionData = edition;
        }).catch(error => {
            console.error("Error creating edition: ", error);
        });
    })
</script>

<!-- TODO -->
Octane Demo.
