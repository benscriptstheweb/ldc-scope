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
		isPrimary: boolean;
	};

	let newContact: Partial<Contact> = $state({
		name: '',
		phone: null,
		email: '',
		isPrimary: false
	});

	let isDrawerOpen = $state(false);

	onMount(() => {
		newContact = {
			name: '',
			phone: null,
			email: '',
			isPrimary: false
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
		email: '',
		isPrimary: false
	});

	let editingId: string | null = $state(null);

	function startEditing(contact: Contact) {
		updatedDetails = contact;
		editingId = contact.id;
	}

	async function updateContact(contactId: string, fieldsToEdit: Partial<Contact>) {
		const res = await fetch(`/api/homes/${home.id}/contacts/${contactId}`, {
			method: 'PATCH',
			body: JSON.stringify(fieldsToEdit)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	async function deleteContact(contactId: string) {
		const res = await fetch(`/api/homes/${home.id}/contacts/${contactId}`, { method: 'DELETE' });

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
						<div class="mb-9 mt-9">
							<input type="text" placeholder="Name" bind:value={updatedDetails.name} />
							<input class="ml-5" type="checkbox" bind:checked={updatedDetails.isPrimary} /> Primary
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
								{contact.name}
								{#if contact.isPrimary}
									<div class="custom-badge badge badge-info ml-2">P</div>
								{/if}
							</div>

							<button class="btn btn-soft btn-xs" onclick={() => startEditing(contact)}>
								<Plus />
							</button>
						</div>
					{/if}
				{/each}
			</div>

			<div class="divider">
				<button onclick={() => (isAddingNew = !isAddingNew)}>
					<Plus size="size-4.5" />
				</button>
			</div>

			{#if isAddingNew}
				<input bind:value={newContact.name} placeholder="Name" />
				<input bind:value={newContact.phone} placeholder="Phone" />
				<input bind:value={newContact.email} placeholder="Email" />

				<div class="primary-checkbox">
					<input type="checkbox" bind:checked={newContact.isPrimary} />
					<span>Primary</span>
				</div>

				<button class="btn btn-success" onclick={() => addContact(newContact)}>
					<Plus /> Add New Contact
				</button>
			{/if}
		</ul>
	</div>
</div>

<style>
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
