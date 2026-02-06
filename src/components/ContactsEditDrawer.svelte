<script lang="ts">
	import { onMount } from 'svelte';
	import Plus from '../icons/Plus.svelte';
	import Trash from '../icons/Trash.svelte';
	import DeleteConfirm from './DeleteConfirm.svelte';

	let { home, id } = $props();

	type Contact = {
		id: string;
		name: string;
		email: string;
		phone: number | null;
	};

	let newContact: Partial<Contact> = $state({
		name: '',
		phone: null,
		email: ''
	});

	let isDrawerOpen = $state(false);

	onMount(() => {
		newContact = {
			name: '',
			phone: null,
			email: ''
		};

		isDrawerOpen = false;
	});

	let isAddingNew = $state(false);
	async function addContact(newContact: Partial<Contact>) {
		const res = await fetch(`/api/homes/${home.id}/contacts`, {
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

	let editingId: string | null = $state(null);

	function startEditing(contact: Contact) {
		updatedDetails = contact;
		editingId = contact.id;
	}

	async function updateContact(contactId: string, fieldsToEdit: Partial<Contact>) {
		const res = await fetch(`/api/homes/${home.id}/contacts?contact=${contactId}`, {
			method: 'PATCH',
			body: JSON.stringify(fieldsToEdit)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	async function deleteContact(contactId: string) {
		const res = await fetch(`/api/homes/${home.id}/contacts?contact=${contactId}`, {
			method: 'DELETE'
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
			<h1>Edit Contacts</h1>

			<div class="contact-edit-list">
				{#each home.contacts as contact}
					{#if editingId === contact.id}
						<div class="contact-border p-3 bg-base-300 mb-9 mt-9">
							<input type="text" placeholder="Name" bind:value={updatedDetails.name} />
							<input type="number" placeholder="Phone" bind:value={updatedDetails.phone} />
							<input type="text" placeholder="Email" bind:value={updatedDetails.email} />

							<div class="button-container">
								<button class="btn btn-soft flex-4" onclick={() => (editingId = null)}>
									Cancel
								</button>
								<DeleteConfirm
									id="delete-contact-confirm"
									deleteFunction={() => deleteContact(contact.id)}
								/>
								<button
									class="btn btn-soft btn-primary"
									onclick={() => updateContact(contact.id, updatedDetails)}
								>
									Update
								</button>
								<button
									class="btn btn-dash btn-error ml-10"
									onclick={() =>
										(
											document.getElementById('delete-contact-confirm') as HTMLDialogElement
										).showModal()}
								>
									<Trash /></button
								>
							</div>
						</div>
					{:else}
						<div class="flex justify-between mb-5">
							<div class="flex contents-center">
								<div class="indicator">
									{contact.name}
								</div>
							</div>

							<button class="btn btn-soft btn-xs" onclick={() => startEditing(contact)}>
								View
							</button>
						</div>
					{/if}
				{/each}
			</div>

			<div class="divider mt-20">
				<button class="btn btn-xs btn-soft" onclick={() => (isAddingNew = !isAddingNew)}>
					<div class="flex items-center">
						<Plus size="size-4.5" />
						<p class="ml-2">New contact</p>
					</div>
				</button>
			</div>

			{#if isAddingNew}
				<input bind:value={newContact.name} placeholder="Name" />
				<input bind:value={newContact.phone} placeholder="Phone" />
				<input bind:value={newContact.email} placeholder="Email" />

				<button class="btn btn-soft btn-success" onclick={() => addContact(newContact)}>
					<Plus /> Add contact
				</button>
			{/if}
		</ul>
	</div>
</div>

<style>
	.contact-border {
		border-radius: 10px;
	}

	.custom-badge {
		border-radius: 25px;
		width: 20px;
	}
	.drawer {
		z-index: 99;
	}

	h1 {
		font-size: 30px;
		font-weight: bold;
		margin-bottom: 20px;
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
		margin-bottom: 15px;
		font-size: 1.1em;
	}
	input:focus {
		border: none;
		border-bottom: 1px solid white;
		outline: none;
	}
</style>
