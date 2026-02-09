<script lang="ts">
	import { type Hosts } from '$lib/supabase/types/hosts';

	let { home, id } = $props();

	let isDrawerOpen = $state(false);
	let updatedDetails = $state(structuredClone(home.hosts));

	async function updateContact(contactId: string, fieldsToEdit: Partial<Hosts>) {
		const res = await fetch(`/api/homes/${home.id}/contacts?contact=${contactId}`, {
			method: 'PATCH',
			body: JSON.stringify(fieldsToEdit)
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
				<div class="contact-border mb-9">
					<p><strong>Primary</strong></p>
					<input type="text" placeholder="Name" bind:value={updatedDetails.name} />
					<input type="number" placeholder="Phone" bind:value={updatedDetails.phone} />
					<input type="text" placeholder="Email" bind:value={updatedDetails.email} />

					<p class="mt-3"><strong>Secondary</strong></p>
					<input type="text" placeholder="Name" bind:value={updatedDetails.name_secondary} />
					<input type="number" placeholder="Phone" bind:value={updatedDetails.phone_secondary} />
					<input type="text" placeholder="Email" bind:value={updatedDetails.email_secondary} />

					<div class="button-container">
						<button
							class="btn btn-soft btn-primary"
							onclick={() => updateContact(home.hosts.id, updatedDetails)}
						>
							Update
						</button>
					</div>
				</div>
			</div>
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
