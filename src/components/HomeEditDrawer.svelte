<script lang="ts">
	import { goto } from '$app/navigation';
	import DeleteConfirm from './DeleteConfirm.svelte';
	import { amenities } from '$lib/helpers/amenities';
	import Trash from '../icons/Trash.svelte';
	import { fade } from 'svelte/transition';

	let { home, id, photoUrls } = $props();

	type HomeAddress = {
		id: string;
		address1: string;
		address2: string;
		city: string;
		state: string;
		zip: string;
		distanceToProject: number;
	};

	let isDrawerOpen = $state(false);

	let homeFields = $state({
		address1: home.address1,
		address2: home.address2,
		city: home.city,
		state: home.state,
		zip: home.zip,
		distanceToProject: home.distanceToProject,
		amenities: home.amenities,
		occupantType: home.occupant_type,
		hasPets: home.hasPets,
		parkingType: home.parkingType
	});

	let images: File[] = $state([]);

	async function updateHome(newHomeDetails: Partial<HomeAddress>) {
		await uploadImages();

		const res = await fetch(`/api/homes?id=${home.id}`, {
			method: 'PATCH',
			body: JSON.stringify(newHomeDetails)
		});

		// if (res.ok) {
		// 	window.location.reload();
		// }
	}

	async function deleteHome() {
		const res = await fetch('/api/homes', {
			method: 'DELETE',
			body: JSON.stringify(home.id)
		});

		if (res.ok) {
			goto('/');
		}
	}

	let fileTooLarge = $state(false);
	let fileIsInvalid = $state(false);

	async function uploadImages() {
		const form = new FormData();

		images.forEach((imageFile) => {
			form.append('images', imageFile);
		});

		const res = await fetch(`/api/homes/${home.id}/photos`, {
			method: 'POST',
			body: form
		});

		// 415: file type unsupported
		if (res.status === 415) {
			fileIsInvalid = true;
			setTimeout(() => {
				fileIsInvalid = false;
			}, 3000);
		}

		// 413: file too large
		if (res.status === 413) {
			fileTooLarge = true;
			setTimeout(() => {
				fileTooLarge = false;
			}, 3000);
		}
	}

	async function deleteImages(imageName: string) {
		const res = await fetch(`/api/homes/${home.id}/photos`, {
			method: 'DELETE',
			body: JSON.stringify(imageName)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	let formChanged = $state(false);
</script>

<DeleteConfirm id="delete-home-confirm" deleteFunction={deleteHome} />

<div class="drawer">
	<input {id} type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />

	<div class="drawer-side">
		<label for={id} aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<form
				onchange={() => {
					formChanged = true;
				}}
			>
				<h1>Edit Home</h1>

				<h2 class="edit-heading">Address</h2>
				<input required type="text" placeholder="Address 1" bind:value={homeFields.address1} />
				<input type="text" placeholder="Address 2" bind:value={homeFields.address2} />

				<input required type="text" placeholder="City" bind:value={homeFields.city} />

				<div class="state-zip">
					<input
						required
						class="w-20"
						type="text"
						placeholder="State"
						bind:value={homeFields.state}
					/>
					<input required class="w-30" type="text" placeholder="Zip" bind:value={homeFields.zip} />
				</div>

				<label class="label">
					Distance to project:
					<input required bind:value={homeFields.distanceToProject} type="number" class="w-10" />
				</label>

				<div class="divider"></div>
				<i>
					<h2 class="edit-heading mb-3">Amenities</h2>
				</i>
				<ul>
					{#each amenities as amenity}
						<div class="flex flex-row">
							<label>
								<input
									class="mr-2"
									type="checkbox"
									value={amenity.type}
									bind:group={homeFields.amenities}
								/>
								{amenity.type}
							</label>
						</div>
					{/each}
				</ul>
				<div class="flex flex-row mt-3">
					<label>
						<input class="mr-2" bind:checked={homeFields.hasPets} type="checkbox" />
						Pet(s)
					</label>
				</div>

				<div class="divider"></div>
				<i>
					<h2 class="edit-heading mb-3">Parking Type</h2>
				</i>
				<select required class="select" bind:value={homeFields.parkingType}>
					<option value="street">Street</option>
					<option value="garage">Garage</option>
				</select>

				<div class="divider"></div>
				<h2 class="edit-heading">Occupant Type</h2>
				<select required class="select" bind:value={homeFields.occupantType}>
					<option value="S">Sister</option>
					<option value="B">Brother</option>
					<option value="C">Couple</option>
					<option value="A">Any</option>
				</select>

				<div class="divider"></div>
				<h2 class="edit-heading">Images</h2>

				<ul class="list bg-base-100 rounded-box shadow-md">
					{#each photoUrls.filenames as filename}
						<div class="flex list-row items-center justify-between">
							<p>{filename}</p>
							<button class="btn btn-error btn-dash" onclick={() => deleteImages(filename)}>
								<Trash />
							</button>
						</div>
					{/each}
				</ul>

				{#if photoUrls.urls.length < 10}
					<div class="flex justify-center">
						<h2 class="edit-heading mt-10">Add New Images</h2>
					</div>
					<input
						class="file-input"
						type="file"
						accept="image/*"
						multiple
						onchange={(e) => {
							const target = e.target as HTMLInputElement;
							const files = Array.from(target.files ?? []);
							images = files;
						}}
					/>
					{#if fileTooLarge}
						<div transition:fade class="alert alert-error">File is too large</div>
					{/if}
					{#if fileIsInvalid}
						<div transition:fade class="alert alert-error">Unsupported file type detected</div>
					{/if}
				{/if}

				<div class="pt-10 flex justify-between">
					<button
						class="btn btn-dash btn-error"
						onclick={(e) => {
							e.preventDefault();
							(document.getElementById('delete-home-confirm') as HTMLDialogElement).showModal();
						}}>Delete Home</button
					>

					<button
						onclick={(e) => {
							e.preventDefault();
							updateHome(homeFields);
						}}
						class="btn btn-primary"
						disabled={!formChanged}>Update Details</button
					>
				</div>
			</form>
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

	input:user-invalid {
		border-bottom: 1px solid var(--color-error);
	}
</style>
