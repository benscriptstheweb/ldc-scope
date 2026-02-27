<script lang="ts">
	import AddHomeForm from '../components/AddHomeForm.svelte';
	import HomeCard from '../components/HomeCard.svelte';
	import Plus from '../icons/Plus.svelte';
	import { getProjectsByRegion } from '$lib/helpers/getProjects';

	let { data } = $props();

	let searchedCongregation = $state('');
	let searchedProject = $state('');

	let supportingCongregationsSet = new Set(data.homes.map((e: any) => e.congregation));
	let supportingCongregations = [...supportingCongregationsSet];

	let filteredHomes = $derived(
		data.homes.filter(
			(e: any) =>
				(!searchedCongregation || e.congregation === searchedCongregation) &&
				(!searchedProject || e.project === searchedProject)
		)
	);

	function sortedHomesByProject(projectName: string) {
		const organizedHomes = filteredHomes.filter((home: any) => home.project === projectName);
		return organizedHomes.sort((a: any, b: any) => a.distanceToProject - b.distanceToProject);
	}
</script>

<AddHomeForm id="add-home-form" />

<div class="header mr-8 ml-8 mt-8 flex justify-between">
	<p class="heading">Inventory</p>
	<button
		class="btn btn-soft btn-success"
		onclick={() => (document.getElementById('add-home-form') as HTMLDialogElement).showModal()}
		><Plus />New</button
	>
</div>

{#if data.user}
	<!-- FILTERS -->
	<div class="ml-8 mr-8 mt-3 flex">
		<div>
			<select class="select" bind:value={searchedProject}>
				<option disabled value="">Project</option>
				<option selected value="">All</option>
				{#await getProjectsByRegion(data.user.assignedRegion) then projects}
					{#each projects as project}
						<option value={project.friendly_name}>{project.friendly_name}</option>
					{/each}
				{/await}
			</select>
		</div>
		<div>
			<select class="select" bind:value={searchedCongregation}>
				<option disabled value="">Congregation</option>
				<option selected value="">All</option>
				{#each supportingCongregations as cong}
					<option value={cong}>{cong}</option>
				{/each}
			</select>
		</div>
	</div>
	{#await getProjectsByRegion(data.user.assignedRegion) then projects}
		<div class="projects-container">
			{#each projects as project}
				{#if !searchedCongregation && !searchedProject}
					<p class="project-subheading ml-8 mt-8">
						Homes for <strong>{project.friendly_name}</strong>
					</p>
				{/if}
				<div class="cards-container">
					{#each sortedHomesByProject(project.friendly_name) as home}
						<HomeCard {home} />
					{/each}
				</div>
			{/each}
		</div>
	{/await}
{/if}

<style>
	.project-subheading {
		font-size: 20px;
	}
	.cards-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-wrap: wrap;
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.cards-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			flex-wrap: wrap;
		}
	}
	@media (min-width: 768px) {
		.project-subheading {
			margin-left: 32px;
		}
		.cards-container {
			margin-left: 32px;
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
		}
	}
</style>
