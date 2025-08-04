<script lang="ts">
	import { onMount } from 'svelte';
	import Ex from '../icons/Ex.svelte';
	import Plus from '../icons/Plus.svelte';
	import Trash from '../icons/Trash.svelte';
	import Edit from '../icons/Edit.svelte';

	let { home } = $props();

	let newContact = $state({
		name: '',
		phone: '',
		email: '',
		isPrimary: false
	});

	let isDrawerOpen = $state(false);

	onMount(() => {
		newContact = {
			name: '',
			phone: '',
			email: '',
			isPrimary: false
		};

		homeFields = {
			address1: home.address1,
			address2: home.address2,
			city: home.city,
			state: home.state,
			zip: home.zip
		};

		isDrawerOpen = false;
	});

	async function deleteContact(homeId: string, contactId: string) {
		const res = await fetch(`/api/homes/${homeId}/contacts/${contactId}`, { method: 'DELETE' });

		if (res.ok) {
			window.location.reload();
		}
	}

	async function addContact(homeId: string, newContact: any) {
		const res = await fetch(`/api/homes/${homeId}/contacts`, {
			method: 'POST',
			body: JSON.stringify(newContact)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	let homeFields = $state({
		address1: home.address1,
		address2: home.address2,
		city: home.city,
		state: home.state,
		zip: home.zip
	});

	async function updateHome(homeId: string, newHomeDetails: any) {
		const res = await fetch(`/api/homes/${homeId}`, {
			method: 'PATCH',
			body: JSON.stringify(newHomeDetails)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	let editingId: number | null = $state(null);
	let editedContactPhone: number | null = null;
	let editedContactEmail = '';

	function startEditing(contact) {
		editingId = contact.id;
		editedContactPhone = contact.phone;
		editedContactEmail = contact.email;
	}
</script>

<div class="drawer">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />

	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<div class="header">
				<h1>Edit Home</h1>
				<Ex onclick={() => (isDrawerOpen = false)} />
			</div>
			<h2 class="edit-heading">Address</h2>
			<div class="row-inputs">
				<input type="text" placeholder="Address 1" class="input" bind:value={homeFields.address1} />
				<input type="text" placeholder="Address 2" class="input" bind:value={homeFields.address2} />
			</div>
			<input type="text" placeholder="City" class="input" bind:value={homeFields.city} />
			<div class="row-inputs">
				<input type="text" placeholder="State" class="input" bind:value={homeFields.state} />
				<input type="text" placeholder="Zip" class="input" bind:value={homeFields.zip} />
			</div>
			<button onclick={() => updateHome(home.id, homeFields)} class="btn btn-primary">Update</button
			>

			<div class="divider"></div>
			<h2 class="edit-heading">Contacts</h2>

			<div class="contact-edit-list">
				{#each home.contacts as contact (contact.id)}
					<div class="list-item">
						{#if editingId === contact.id}
							<div>
								<input type="text" placeholder="Name" class="input" value={contact.name} />
								<input type="text" placeholder="Phone" class="input" value={contact.phone} />
								<input type="text" placeholder="Email" class="input" value={contact.email} />

								<div class="button-container">
									<button class="btn" onclick={() => (editingId = null)}> Cancel </button>
									<button
										class="btn btn-error"
										onclick={() => deleteContact(home.id, contact.id)}
										aria-label="delete"
									>
										<Trash />
									</button>
								</div>
							</div>
						{:else}
							{contact.name}

							<button class="btn" onclick={() => startEditing(contact)}>
								<Edit />
							</button>
						{/if}
					</div>
				{/each}
			</div>

			<div class="divider">New Contact</div>
			<input class="input input-sm" bind:value={newContact.name} placeholder="Name" />
			<input class="input input-sm" bind:value={newContact.phone} placeholder="Phone" />
			<input class="input input-sm" bind:value={newContact.email} placeholder="Email" />

			<div class="button-container">
				<label class="label">
					<input
						type="checkbox"
						bind:checked={newContact.isPrimary}
						class="checkbox checkbox-info"
					/>
					Primary Contact
				</label>

				<button
					class="btn btn-success"
					onclick={() => addContact(home.id, newContact)}
					aria-label="add"
				>
					<Plus />
				</button>
			</div>
		</ul>
	</div>
</div>

<style>
	.header {
		display: flex;
		justify-content: space-between;
	}

	h1 {
		font-size: 30px;
		font-weight: bold;
		margin-bottom: 20px;
	}

	.drawer {
		z-index: 99;
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

	.contact-edit-list {
		display: flex;
		flex-direction: column;
	}
	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.button-container {
		width: 100%;
	}
	.button-container > button {
		float: right;
	}
</style>
