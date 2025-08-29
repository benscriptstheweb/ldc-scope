<script lang="ts">
	import { onMount } from 'svelte';
	import Plus from '../icons/Plus.svelte';
	import Edit from '../icons/Edit.svelte';
	import type { Contact, HomeAddress } from '$lib/types/homes';
	import Trash from '../icons/Trash.svelte';

	let { home, id } = $props();

	let newContact: Partial<Contact> = $state({
		name: '',
		phone: null,
		email: '',
		isPrimary: false
	});

	let isDrawerOpen = $state(false);

	onMount(() => {
		// BUG: To mitigate a bug where the new contact form is filled with the previously
		// deleted contact information, make sure that the new contact field and the update
		// home fields start out with...

		// ... an empty form
		newContact = {
			name: '',
			phone: null,
			email: '',
			isPrimary: false
		};

		// ... the current address
		homeFields = {
			address1: home.address1,
			address2: home.address2,
			city: home.city,
			state: home.state,
			zip: home.zip
		};

		isDrawerOpen = false;
	});

	let homeFields = $state({
		address1: home.address1,
		address2: home.address2,
		city: home.city,
		state: home.state,
		zip: home.zip
	});

	async function updateHome(newHomeDetails: Partial<HomeAddress>) {
		const res = await fetch(`/api/homes/${home.id}`, {
			method: 'PATCH',
			body: JSON.stringify(newHomeDetails)
		});

		if (res.ok) {
			window.location.reload();
		}
	}
</script>

<div class="drawer">
	<input {id} type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />

	<div class="drawer-side">
		<label for={id} aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<h1>Edit Home</h1>

			<h2 class="edit-heading">Address</h2>
			<input type="text" placeholder="Address 1" bind:value={homeFields.address1} />
			<input type="text" placeholder="Address 2" bind:value={homeFields.address2} />

			<input type="text" placeholder="City" bind:value={homeFields.city} />

			<div class="state-zip">
				<input class="w-20" type="text" placeholder="State" bind:value={homeFields.state} />
				<input class="w-50" type="text" placeholder="Zip" bind:value={homeFields.zip} />
			</div>
			<button onclick={() => updateHome(homeFields)} class="btn btn-primary">Update Address</button>
		</ul>
	</div>
</div>

<style>
	.drawer {
		z-index: 99;
	}

	h1 {
		font-size: 30px;
		font-weight: bold;
		margin-bottom: 20px;
	}

	.edit-heading {
		font-size: 15px;
		font-style: italic;
		padding-bottom: 10px;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}

	input {
		border: none;
		border-bottom: 1px solid rgba(110, 109, 112, 0.589);
		outline: none;
		padding: 5px;
		margin-bottom: 15px;
		font-size: 1.1em;
	}
	input:focus {
		border: none;
		border-bottom: 1px solid white;
		outline: none;
	}
</style>
