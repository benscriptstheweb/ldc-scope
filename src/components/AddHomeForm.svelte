<script lang="ts">
	import { amenities } from '$lib/helpers/amenities';
	import { supabase } from '$lib/supabase/supabaseClient';

	let { id } = $props();

	async function getProjects() {
		const { data, error } = await supabase.from('projects').select('*');

		if (error) {
			console.error('Error fetching assignable homes:', error);
			return [];
		}

		return data;
	}

	let address1 = $state('');
	let address2 = $state('');
	let city = $state('');
	let addressState = $state('');
	let zip = $state('');
	let hostCongregation = $state('');
	let distanceToProject: null | number = $state(null);
	let multiSelectAmenities = $state([]);

	let newHomeDetails = $derived({
		address1: address1,
		address2: address2,
		city: city,
		state: addressState,
		zip: zip,
		congregation: hostCongregation,
		distance_to_project: distanceToProject,
		amenities: multiSelectAmenities
	});

	let hostName = $state('');
	let hostEmail = $state('');
	let hostPhone: null | number = $state(null);

	//TODO first insert home, then insert contact, then link contact to home by uuid
	let newHomeContact = $derived({
		name: hostName,
		phone: hostPhone,
		email: hostEmail,
		isPrimary: true
	});

	async function addHome(newHome: any) {
		// const res = await fetch(`/api/homes`, {
		// 	method: 'POST',
		// 	body: JSON.stringify(newHome)
		// });
		// if (res.ok) {
		// 	window.location.reload();
		// }
	}
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		<h1 class="heading mb-4">Add Home</h1>

		<div class="divider">Property Data</div>
		<input bind:value={address1} type="text" placeholder="Address 1" />
		<input bind:value={address2} type="text" placeholder="Address 2" />

		<input bind:value={city} type="text" placeholder="City" />
		<input bind:value={addressState} type="text" placeholder="State" />
		<input bind:value={zip} type="text" placeholder="Zip" />

		<h3 class="subheading mt-7">Amenities (<i>Select all that apply</i>)</h3>
		<ul>
			{#each amenities as amenity}
				<li>
					{amenity.type}
					<input type="checkbox" value={amenity.type} bind:group={multiSelectAmenities} />
				</li>
			{/each}
		</ul>

		<div class="divider mt-7">Project</div>
		<select class="select mb-7">
			<option disabled selected>Select project</option>
			{#await getProjects() then projects}
				{#each projects as project}
					<option value={project.id}>{project.friendly_name}</option>
				{/each}
			{/await}
		</select>

		<p>Distance to Project (in miles)</p>
		<input bind:value={distanceToProject} type="number" class="w-15" />

		<div class="divider mt-7">Host Details</div>
		<input bind:value={hostName} type="text" placeholder="Primary Host Name" />
		<input bind:value={hostEmail} type="text" placeholder="Host Email" />
		<input bind:value={hostPhone} type="number" placeholder="Host Phone" />
		<input bind:value={hostCongregation} type="text" placeholder="Host Congregation" />

		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
				<button
					class="btn btn-success"
					onclick={(e) => {
						e.preventDefault();
						addHome(newHomeDetails);
					}}>Add</button
				>
			</form>
		</div>
	</div>
</dialog>

<style>
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
</style>
