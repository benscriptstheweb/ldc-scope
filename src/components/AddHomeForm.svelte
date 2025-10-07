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
	let hostCongregation = $state('');
	let distanceToProject: null | number = $state(null);
	let maxDays: null | number = $state(null);
	let multiSelectAmenities = $state([]);
	let projectId: null | number = $state(null);
	let recommendedOccupant = $state('A');
	let allergy = $state('');
	let homeownerAllergies: string[] = $state([]);

	function addAllergyToList() {
		if (allergy.trim() !== '') {
			homeownerAllergies = [...homeownerAllergies, allergy];
			allergy = '';
		}
	}

	let newHomeDetails = $derived({
		address1: address1,
		address2: address2,
		city: city,
		state: addressState,
		zip: zip,
		congregation: hostCongregation,
		project: projectId,
		distance_to_project: distanceToProject,
		max_days_stay: maxDays,
		amenities: multiSelectAmenities,
		occupant_type: recommendedOccupant,
		allergies: homeownerAllergies
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
		const res = await fetch(`/api/homes`, {
			method: 'POST',
			body: JSON.stringify({
				home: newHome,
				contact: newHomeContact
			})
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	function removeTag(tagName: string) {
		homeownerAllergies = homeownerAllergies.filter((e) => e !== tagName);
	}

	let modalPage = $state(1);
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		<form id="add-form">
			<div class="flex items-center justify-between mb-7 mt-4">
				<h1 class="heading content-center">Add New Home</h1>
				<button class="btn btn-soft btn-secondary">Close</button>
			</div>

			{#if modalPage === 1}
				<h1 class="page-heading">1. Home Details</h1>
				<input bind:value={address1} type="text" placeholder="Address 1" />
				<input bind:value={address2} type="text" placeholder="Address 2" />

				<input bind:value={city} type="text" placeholder="City" />

				<div class="flex">
					<input bind:value={addressState} type="text" placeholder="State" class="w-30 mr-3" />
					<input bind:value={zip} type="text" placeholder="Zip" class="w-21" />
				</div>

				<div>
					<label class="label mb-5">
						<p>Stay Duration</p>
						<input bind:value={maxDays} type="number" class="w-15" />
					</label>
				</div>

				<p>Recommended Occupant</p>
				<select class="select" bind:value={recommendedOccupant}>
					<option value="S">Sister</option>
					<option value="B">Brother</option>
					<option value="C">Couple</option>
					<option value="F">Family</option>
					<option value="A">Any</option>
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
				<div class="allergies-list mb-5">
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
			{/if}

			{#if modalPage === 2}
				<h1 class="page-heading">2. Project Details</h1>

				<p>Select project</p>
				<select class="select mb-7" bind:value={projectId}>
					<option disabled selected>Select project</option>
					{#await getProjects() then projects}
						{#each projects as project}
							<option value={project.id}>{project.friendly_name}</option>
						{/each}
					{/await}
				</select>

				<label class="label mb-5">
					<p>Distance to Project (in miles)</p>
					<input bind:value={distanceToProject} type="number" class="w-15" />
				</label>
			{/if}

			{#if modalPage === 3}
				<h1 class="page-heading">3. Contact Information</h1>
				<input bind:value={hostName} type="text" placeholder="Name" />
				<input bind:value={hostEmail} type="text" placeholder="Email" />
				<input bind:value={hostPhone} type="number" placeholder="Phone" />
				<input bind:value={hostCongregation} type="text" placeholder="Congregation" />

				<div class="mt-5">
					<button
						class="btn btn-soft"
						onclick={(e) => {
							e.preventDefault();
							modalPage--;
						}}>Back</button
					>
					<button class="btn btn-soft btn-success" onclick={() => addHome(newHomeDetails)}
						>Add</button
					>
				</div>
			{/if}

			<div class="flex">
				{#if modalPage !== 3}
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
							class="btn btn-soft"
							onclick={(e) => {
								e.preventDefault();
								modalPage++;
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
