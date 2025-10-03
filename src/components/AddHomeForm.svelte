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

	function removeTag(e: any) {
		const tagName = e.currentTarget?.parentElement.innerText;
		homeownerAllergies = homeownerAllergies.filter(
			(_e, i) => i !== homeownerAllergies.indexOf(tagName)
		);
	}
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		<h1 class="heading mb-4">Add New Home</h1>

		<div class="divider">1. Property Data</div>
		<input bind:value={address1} type="text" placeholder="Address 1" />
		<input bind:value={address2} type="text" placeholder="Address 2" />

		<input bind:value={city} type="text" placeholder="City" />

		<div class="flex">
			<input bind:value={addressState} type="text" placeholder="State" class="w-30 mr-3" />
			<input bind:value={zip} type="text" placeholder="Zip" class="w-21" />
		</div>

		<div>
			<label class="label">
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
					{amenity.type}
					<input type="checkbox" value={amenity.type} bind:group={multiSelectAmenities} />
				</li>
			{/each}
		</ul>

		<h3 class="subheading mt-7">Homeowner Allergies</h3>
		<input type="text" bind:value={allergy} />
		<button class="btn btn-soft btn-primary" onclick={() => addAllergyToList()}>
			<Plus />
		</button>
		<div class="allergies-list">
			{#each homeownerAllergies as tag}
				<div class="badge badge-primary mr-1">
					{tag}
					<button onclick={(e) => removeTag(e)}>
						<Ex />
					</button>
				</div>
			{/each}
		</div>

		<div class="divider mt-7">2. Project</div>
		<select class="select mb-7" bind:value={projectId}>
			<option disabled selected>Select project</option>
			{#await getProjects() then projects}
				{#each projects as project}
					<option value={project.id}>{project.friendly_name}</option>
				{/each}
			{/await}
		</select>

		<label class="label">
			<p>Distance to Project (in miles)</p>
			<input bind:value={distanceToProject} type="number" class="w-15" />
		</label>

		<div class="divider mt-7">3. Primary Host Details</div>
		<input bind:value={hostName} type="text" placeholder="Name" />
		<input bind:value={hostEmail} type="text" placeholder="Email" />
		<input bind:value={hostPhone} type="number" placeholder="Phone" />
		<input bind:value={hostCongregation} type="text" placeholder="Congregation" />

		<div class="mt-30 mb-20">
			<button
				class="btn btn-soft"
				onclick={() => (document.getElementById(id) as HTMLDialogElement).close()}>Close</button
			>
			<button type="submit" class="btn btn-soft btn-success" onclick={() => addHome(newHomeDetails)}
				>Add</button
			>
		</div>
	</div>
</dialog>

<style>
	.divider {
		font-style: italic;
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
