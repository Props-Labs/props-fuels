import { toast } from "@zerodevx/svelte-toast";

export const warning = (m: string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': 'var(--warning)',
			'--toastColor': 'white',
			'--toastBarBackground': 'var(--warning)'
		}
	});

export const failure = (m: string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': 'var(--error)',
			'--toastColor': 'white',
			'--toastBarBackground': 'var(--error)'
		}
	});

export const info = (m: string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': 'var(--info)',
			'--toastColor': 'white',
			'--toastBarBackground': 'var(--info)'
		}
	});

export const success = (m: string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': 'var(--success)',
			'--toastColor': 'white',
			'--toastBarBackground': 'var(--success)'
		}
	});
