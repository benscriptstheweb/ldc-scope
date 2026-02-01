<script lang="ts">
	import { amenities } from '$lib/helpers/amenities';
	import { getProjects } from '$lib/helpers/getProjects';
	import Ex from '../icons/Ex.svelte';
	import Plus from '../icons/Plus.svelte';

	let { id } = $props();

	let address1 = $state('');
	let address2 = $state('');
	let city = $state('');
	let addressState = $state('');
	let zip = $state('');
	let congregation = $state('');
	let distance_to_project: null | number = $state(null);
	let max_days_stay: null | number = $state(null);
	let multiSelectAmenities = $state([]);
	let projectId: null | number = $state(null);
	let occupant_type = $state('A');
	let allergy = $state('');
	let homeownerAllergies: string[] = $state([]);
	let has_pets = $state(false);
	let parking_type = $state('street');
	let date_available = $state('');

	function addAllergyToList() {
		if (allergy.trim() !== '') {
			homeownerAllergies = [...homeownerAllergies, allergy];
			allergy = '';
		}
	}

	let newHomeDetails = $derived({
		address1,
		address2,
		city,
		state: addressState,
		zip,
		congregation,
		project: projectId,
		distance_to_project,
		max_days_stay,
		amenities: multiSelectAmenities,
		occupant_type,
		allergies: homeownerAllergies,
		has_pets,
		parking_type,
		date_available
	});

	let hostName = $state('');
	let hostEmail = $state('');
	let hostPhone: null | number = $state(null);

	let newHomeContact = $derived({
		name: hostName,
		phone: hostPhone,
		email: hostEmail,
		isPrimary: true
	});

	async function addHome(newHome: any) {
		const homeApiResponse = await fetch(`/api/homes`, {
			method: 'POST',
			body: JSON.stringify({
				home: newHome,
				contact: newHomeContact
			})
		});

		if (homeApiResponse.ok) {
			window.location.reload();
		}
	}

	function removeTag(tagName: string) {
		homeownerAllergies = homeownerAllergies.filter((e) => e !== tagName);
	}

	let modalPage = $state(1);

	function moveIfValid(moveAction: any) {
		if ((document.getElementById('add-form') as HTMLFormElement).reportValidity()) {
			moveAction();
		}
	}
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		<form id="add-form">
			<div class="flex items-center justify-between mb-7 mt-4">
				<h1 class="heading content-center">Add New Home</h1>
			</div>

			{#if modalPage === 1}
				<h1 class="page-heading">1. Home Details</h1>
				<input required bind:value={address1} type="text" placeholder="Address 1" />
				<input bind:value={address2} type="text" placeholder="Address 2" />

				<input required bind:value={city} type="text" placeholder="City" />

				<div class="flex">
					<input
						required
						bind:value={addressState}
						type="text"
						placeholder="State"
						class="w-30 mr-3"
					/>
					<input required bind:value={zip} type="text" placeholder="Zip" class="w-21" />
				</div>

				<div>
					<label class="label mb-5">
						<p>Stay Duration</p>
						<input bind:value={max_days_stay} type="number" class="w-15" />
					</label>
				</div>

				<label>
					Has pets?
					<input bind:checked={has_pets} type="checkbox" />
				</label>

				<p class="mt-4">Recommended Occupant</p>
				<select required class="select" bind:value={occupant_type}>
					<option value="S">Sister</option>
					<option value="B">Brother</option>
					<option value="C">Couple</option>
					<option value="A">Any</option>
				</select>

				<p class="mt-4">Parking Type</p>
				<select required class="select" bind:value={parking_type}>
					<option value="street">Street</option>
					<option value="garage">Garage</option>
				</select>

				<h3 class="subheading mt-7">Amenities (<i>Select all that apply</i>)</h3>
				<ul>
					{#each amenities as amenity}
						<li>
							<input
								class="mr-2"
								type="checkbox"
								value={amenity.type}
								bind:group={multiSelectAmenities}
							/>
							{amenity.type}
						</li>
					{/each}
				</ul>
			{/if}

			{#if modalPage === 2}
				<h1 class="page-heading">2. Project Details</h1>

				<p>Select project</p>
				<select required class="select mb-7" bind:value={projectId}>
					<option disabled selected>Select project</option>
					{#await getProjects() then projects}
						{#each projects as project}
							<option value={project.id}>{project.friendly_name}</option>
						{/each}
					{/await}
				</select>

				<label class="label">
					<p>Distance to Project (in miles)</p>
					<input required bind:value={distance_to_project} type="number" class="w-15" />
				</label>
			{/if}

			{#if modalPage === 3}
				<h1 class="page-heading">3. Homeowner Info</h1>
				<input required bind:value={hostName} type="text" placeholder="Name" />
				<input required bind:value={hostEmail} type="text" placeholder="Email" />
				<input required bind:value={hostPhone} type="number" placeholder="Phone" />
				<input bind:value={congregation} type="text" placeholder="Congregation" />

				<h3 class="subheading mt-7">Homeowner Allergies</h3>
				<input type="text" bind:value={allergy} />
				<button
					class="btn btn-soft btn-primary"
					onclick={(e) => {
						e.preventDefault();
						addAllergyToList();
					}}
				>
					<Plus />
				</button>
				<div class="allergies-list">
					{#each homeownerAllergies as tag}
						<div class="badge badge-primary mr-1">
							{tag}
							<button
								onclick={(e) => {
									e.preventDefault();
									removeTag(tag);
								}}
							>
								<Ex />
							</button>
						</div>
					{/each}
				</div>
				<div class="dates flex mb-10 items-center mt-6">
					<strong class="mr-3">4. Available as of</strong>
					<input bind:value={date_available} type="date" />
				</div>
			{/if}

			<!-- NEXT PREVIOUS BUTTONS -->
			<div class="flex justify-between mt-5">
				<button
					class="btn btn-outline btn-secondary"
					onclick={(e) => {
						e.preventDefault();
						(document.getElementById('add-form') as HTMLFormElement).reset();
						(document.getElementById(id) as HTMLDialogElement).close();
					}}>Close</button
				>
				{#if modalPage === 3}
					<div>
						<button
							class="btn btn-soft"
							onclick={(e) => {
								e.preventDefault();
								modalPage--;
							}}>Back</button
						>
						<button
							class="btn btn-soft btn-success"
							onclick={(e) => {
								e.preventDefault();
								moveIfValid(() => addHome(newHomeDetails));
							}}
						>
							<Plus />Add Home
						</button>
					</div>
				{:else}
					<div>
						{#if modalPage !== 1}
							<button
								class="btn btn-soft"
								onclick={(e) => {
									e.preventDefault();
									modalPage--;
								}}>Back</button
							>
						{/if}
						<button
							class="btn btn-soft btn-primary"
							onclick={(e) => {
								e.preventDefault();
								moveIfValid(() => modalPage++);
							}}>Next</button
						>
					</div>
				{/if}
			</div>
		</form>
	</div>
</dialog>

<style>
	.page-heading {
		font-size: 1.4em;
		margin-bottom: 15px;
	}

	.subheading {
		font-weight: bold;
		margin-bottom: 5px;
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

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
