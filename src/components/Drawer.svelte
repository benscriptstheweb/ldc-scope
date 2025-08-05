<script lang="ts">
	import { onMount } from 'svelte';
	import Plus from '../icons/Plus.svelte';
	import Trash from '../icons/Trash.svelte';
	import Edit from '../icons/Edit.svelte';
	import type { Contact, HomeAddress } from '$lib/types/homes';

	let { home } = $props();

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

	async function deleteContact(homeId: string, contactId: string) {
		const res = await fetch(`/api/homes/${homeId}/contacts/${contactId}`, { method: 'DELETE' });

		if (res.ok) {
			window.location.reload();
		}
	}

	// We use Partial<T> for the add operations because the database auto-assigns a uuid upon creation.
	async function addContact(homeId: string, newContact: Partial<Contact>) {
		const res = await fetch(`/api/homes/${homeId}/contacts`, {
			method: 'POST',
			body: JSON.stringify(newContact)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	let updatedDetails: Partial<Contact> = $state({
		name: '',
		phone: null,
		email: ''
	});

	async function editContact(homeId: string, contactId: string, fieldsToEdit: Partial<Contact>) {
		const res = await fetch(`/api/homes/${homeId}/contacts/${contactId}`, {
			method: 'PATCH',
			body: JSON.stringify(fieldsToEdit)
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

	async function updateHome(homeId: string, newHomeDetails: Partial<HomeAddress>) {
		const res = await fetch(`/api/homes/${homeId}`, {
			method: 'PATCH',
			body: JSON.stringify(newHomeDetails)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	let editingId: string | null = $state(null);

	function startEditing(contact: Contact) {
		// Populate form with current details from the contact object.
		updatedDetails = contact;
		editingId = contact.id;
	}
</script>

<div class="drawer">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />

	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<div class="header">
				<h1>Edit Home</h1>
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
								<input
									type="text"
									placeholder="Name"
									class="input"
									bind:value={updatedDetails.name}
								/>
								<input
									type="text"
									placeholder="Phone"
									class="input"
									bind:value={updatedDetails.phone}
								/>
								<input
									type="text"
									placeholder="Email"
									class="input"
									bind:value={updatedDetails.email}
								/>

								<div class="button-container">
									<button
										class="btn btn-error flex-2"
										onclick={() => deleteContact(home.id, contact.id)}
										aria-label="delete"
									>
										<Trash />
									</button>
									<button
										class="btn btn-primary flex-3"
										onclick={() => editContact(home.id, contact.id, updatedDetails)}
									>
										Update
									</button>
									<button class="btn cancel flex-4" onclick={() => (editingId = null)}>
										Cancel
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
				<label class="label mt-3">
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
		margin: 5px 5px;
	}
</style>
