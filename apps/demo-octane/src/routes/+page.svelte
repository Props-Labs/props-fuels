<script>
    import { onMount } from 'svelte'
    import { Octane } from 'octane-fuels-ts'

    let editionData = {};

    onMount(() => {
        console.log("We're here");
        let octane = new Octane({
            apiKey: 'YOUR_API_KEY',
            network: 'testnet'
        })
        console.log("Octane initiated: ", octane);

        octane.edition.create("My Edition", {
            name: 'My Edition',
            description: 'This is my edition',
            image: 'https://octane.finance/logo.png',
        }).then(edition => {
            console.log("Edition created: ", edition)
            editionData = edition;
        })
    })
</script>

<!-- TODO -->
Octane Demo.
