import { createConfig } from 'fuels';
import dotenv from 'dotenv';

dotenv.config({
	path: ['.env']
});


const fuelCorePort = +(process.env.PUBLIC_FUEL_NODE_PORT as string) || 4000;

export default createConfig({
	contracts: ['packages/sway-programs/OctaneFeeSplitter-contract', 'packages/sway-programs/Octane721Edition-contract'],
	output: './packages/octane/src/sway-api',
	fuelCorePort,
	providerUrl: process.env.NODE_URL
});

/**
 * Check the docs:
 * https://docs.fuel.network/docs/fuels-ts/fuels-cli/config-file/
 */
