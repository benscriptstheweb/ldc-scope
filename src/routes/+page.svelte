<script lang="ts">
	import AddHomeForm from '../components/AddHomeForm.svelte';
	import HomeCard from '../components/HomeCard.svelte';
	import Plus from '../icons/Plus.svelte';
	import { getProjectsByRegion } from '$lib/helpers/getProjects';

	let { data } = $props();

	function sortedHomesByProject(projectName: string) {
		const organizedHomes = data.homes.filter((home: any) => home.project === projectName);
		return organizedHomes.sort((a: any, b: any) => a.distanceToProject - b.distanceToProject);
	}
</script>

<AddHomeForm id="add-home-form" />

<div class="header ml-8 mt-8 flex justify-between mr-8">
	<p class="heading">Inventory</p>
	<button
		class="btn btn-soft btn-success"
		onclick={() => (document.getElementById('add-home-form') as HTMLDialogElement).showModal()}
		><Plus />Add Home</button
	>
</div>

{#if data.user}
	{#await getProjectsByRegion(data.user.assignedRegion) then projects}
		<div class="projects-container ml-8">
			{#each projects as project}
				<p class="project-subheading">Homes for <strong>{project.friendly_name}</strong></p>
				<div class="cards-container mb-20">
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
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		padding: 20px;
	}
</style>
