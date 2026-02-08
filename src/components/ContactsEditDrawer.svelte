<script lang="ts">
	import Plus from '../icons/Plus.svelte';
	import Trash from '../icons/Trash.svelte';
	import DeleteConfirm from './DeleteConfirm.svelte';
	import { type Hosts } from '$lib/supabase/types/hosts';

	let { home, id } = $props();

	let newContact: Partial<Hosts> = $state({
		name_secondary: '',
		phone_secondary: null,
		email_secondary: ''
	});

	let isDrawerOpen = $state(false);

	let isAddingNew = $state(false);

	async function addSecondaryContact(contactId: string, newContact: Partial<Hosts>) {
		const res = await fetch(`/api/homes/${home.id}/contacts?contact=${contactId}`, {
			method: 'PATCH',
			body: JSON.stringify(newContact)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	let updatedDetails: Partial<Hosts> = $state({
		name: '',
		phone: null,
		email: ''
	});

	let editingId: string | null = $state(null);

	function startEditing(contact: Hosts) {
		updatedDetails = contact;
		editingId = contact.id;
	}

	async function updateContact(contactId: string, fieldsToEdit: Partial<Hosts>) {
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
				{#if editingId === home.hosts.id}
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
								deleteFunction={() => deleteContact(home.hosts.id)}
							/>
							<button
								class="btn btn-soft btn-primary"
								onclick={() => updateContact(home.hosts.id, updatedDetails)}
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
								{home.hosts.name}
							</div>
						</div>

						<button class="btn btn-soft btn-xs" onclick={() => startEditing(home.hosts)}>
							View
						</button>
					</div>
				{/if}
			</div>

			<div class="divider mt-20">
				<button class="btn btn-xs btn-soft" onclick={() => (isAddingNew = !isAddingNew)}>
					<div class="flex items-center">
						<Plus size="size-4.5" />
						<p class="ml-2">Add secondary contact</p>
					</div>
				</button>
			</div>

			{#if isAddingNew}
				<input bind:value={newContact.name_secondary} placeholder="Name" />
				<input bind:value={newContact.phone_secondary} placeholder="Phone" />
				<input bind:value={newContact.email_secondary} placeholder="Email" />

				<button
					class="btn btn-soft btn-success"
					onclick={() => addSecondaryContact(home.hosts.id, newContact)}
				>
					<Plus /> Add
				</button>
			{/if}
		</ul>
	</div>
</div>

<style>
	.contact-border {
		border-radius: 10px;
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
