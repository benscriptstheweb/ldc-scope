<script lang="ts">
	import { getProjectsByRegion } from '$lib/helpers/getProjects';

	let { selection = $bindable(), projectRegion } = $props();
</script>

<select bind:value={selection} class="select mb-7">
	{#await getProjectsByRegion(projectRegion) then projects}
		{#each projects as project}
			<option value={project.id}>{project.friendly_name}</option>
		{/each}
	{/await}
</select>
