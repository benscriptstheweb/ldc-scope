<script lang="ts">
	import type { Volunteer } from '$lib/types/volunteer';
	import Plus from '../../icons/Plus.svelte';

	export let data;
	const volunteers = data.volunteers;

	// async function addVolunteer(volunteerInfo: Volunteer) {

	// }
</script>

<div class="add-btn-container">
	<p class="heading">Volunteers</p>
	<button class="btn btn-success">
		<Plus />
		New
	</button>
</div>

<div class="overflow-x-auto">
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th>Name</th>
				<th>Project</th>
				<th>Date Start</th>
				<th>Date End</th>
				<th>Home Assignment</th>
			</tr>
		</thead>
		<tbody>
			{#each volunteers as volunteer}
				<tr>
					<td>{volunteer.name}</td>
					<td>{volunteer.project}</td>
					<td>{volunteer.dateStart}</td>
					<td>{volunteer.dateEnd}</td>
					<td onclick={() => console.log(volunteer.assignedCity)}>{volunteer.assignedCity}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.add-btn-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30px;
	}
</style>
