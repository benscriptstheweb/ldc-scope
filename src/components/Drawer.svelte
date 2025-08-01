<script lang="ts">
	import { onMount } from 'svelte';

	let { home } = $props();

	let newContact = $state({
		name: '',
		phone: '',
		email: '',
		isPrimary: false
	});

	async function deleteContact(homeId: string, contactId: string) {
		await fetch(`/api/homes/${homeId}/contacts/${contactId}`, { method: 'DELETE' });
	}

	async function addContact(homeId: string, newContact: any) {
		await fetch(`/api/homes/${homeId}/contacts`, {
			method: 'POST',
			body: JSON.stringify(newContact)
		});
	}

	let homeFields = $state({
		address1: '',
		address2: '',
		city: '',
		state: '',
		zip: ''
	});

	onMount(() => {
		homeFields = {
			address1: home.address1,
			address2: home.address2,
			city: home.city,
			state: home.state,
			zip: home.zip
		};
	});

	async function updateHome(homeId: string, newHomeDetails: any) {
		await fetch(`/api/homes/${homeId}`, {
			method: 'PATCH',
			body: JSON.stringify(newHomeDetails)
		});
	}
</script>

<div class="drawer">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />

	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<h1>Edit Home</h1>

			<h2 class="edit-heading">Address</h2>
			<input type="text" placeholder="Address 1" class="input" bind:value={homeFields.address1} />
			<input type="text" placeholder="Address 2" class="input" bind:value={homeFields.address2} />
			<input type="text" placeholder="City" class="input" bind:value={homeFields.city} />
			<div class="row-inputs">
				<input type="text" placeholder="State" class="input" bind:value={homeFields.state} />
				<input type="text" placeholder="Zip" class="input" bind:value={homeFields.zip} />
			</div>
			<button onclick={() => updateHome(home.id, homeFields)} class="btn btn-primary">Update</button
			>

			<div class="divider"></div>

			<h2 class="edit-heading">Contacts</h2>
			{#each home.contacts as contact}
				{contact.name}
				<input type="text" placeholder="Phone" class="input" value={contact.phone} />
				<input type="text" placeholder="Email" class="input" value={contact.email} />
				<button
					onclick={() => deleteContact(home.id, contact.id)}
					class="btn btn-error delete"
					aria-label="delete"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</button>
			{/each}

			<div class="divider">Add New Contact</div>

			<input class="input" bind:value={newContact.name} placeholder="Name" />
			<input class="input" bind:value={newContact.phone} placeholder="Phone" />
			<input class="input" bind:value={newContact.email} placeholder="Email" />
			<label class="label">
				Primary Contact?
				<input type="checkbox" bind:checked={newContact.isPrimary} class="checkbox checkbox-info" />
			</label>
			<button
				class="btn btn-success"
				onclick={() => addContact(home.id, newContact)}
				aria-label="add"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			</button>
		</ul>
	</div>
</div>

<style>
	h1 {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 20px;
	}

	.edit-heading {
		font-size: 15px;
		font-style: italic;
		padding-bottom: 10px;
	}

	input {
		margin: 2px 0;
	}

	.row-inputs {
		display: flex;
	}
</style>
