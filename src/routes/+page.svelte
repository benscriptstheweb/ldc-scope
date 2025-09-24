<script lang="ts">
	import { supabase } from '$lib/supabase/supabaseClient';
	import HomeCard from '../components/HomeCard.svelte';
	import Plus from '../icons/Plus.svelte';

	let { data } = $props();

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

	let newHomeDetails = $derived({
		address1: address1,
		address2: address2,
		city: city,
		state: addressState,
		zip: zip,
		congregation: hostCongregation,
		distance_to_project: distanceToProject
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

<dialog id="add-home-form" class="modal">
	<div class="modal-box">
		<h1 class="heading mb-4">Add Home</h1>

		<h3 class="subheading">Address</h3>
		<input bind:value={address1} type="text" placeholder="Address 1" />
		<input bind:value={address2} type="text" placeholder="Address 2" />

		<input bind:value={city} type="text" placeholder="City" />
		<input bind:value={addressState} type="text" placeholder="State" />
		<input bind:value={zip} type="text" placeholder="Zip" />

		<h3 class="subheading mt-7">Project</h3>
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

		<h3 class="subheading mt-7">Host Details</h3>
		<input bind:value={hostCongregation} type="text" placeholder="Congregation" />

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

<div class="header ml-8 mt-8 flex justify-between mr-8">
	<p class="heading">Inventory</p>
	<button
		class="btn btn-soft btn-success"
		onclick={() => (document.getElementById('add-home-form') as HTMLDialogElement).showModal()}
		><Plus />Add Home</button
	>
</div>

<div class="cards-container">
	{#each data.homes as home}
		<HomeCard {home} />
	{/each}
</div>

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
	.cards-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		padding: 20px;
	}
</style>
