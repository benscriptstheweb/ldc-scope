<script lang="ts">
	import type { Volunteer } from '$lib/types/volunteer';
	import { Timestamp } from 'firebase/firestore';
	import Plus from '../../icons/Plus.svelte';

	export let data;
	const volunteers = data.volunteers;

	const newVolunteerData = {
		project: 'San Bruno',
		name: 'Dylan',
		phone: 5168906678,
		email: 'dylanweldz@yahoo.com',
		dateStart: new Date('2025-08-07'),
		dateEnd: new Date('2025-08-08')
	};

	async function addVolunteer(newVolunteer: Partial<Volunteer>) {
		const res = await fetch(`/api/volunteers`, {
			method: 'POST',
			body: JSON.stringify(newVolunteer)
		});

		// if (res.ok) {
		// 	window.location.reload();
		// }
	}
</script>

<div class="add-btn-container">
	<p class="heading">Volunteers</p>
	<button onclick={() => addVolunteer(newVolunteerData)} class="btn btn-success">
		<Plus />
		New
	</button>
</div>

<div class="overflow-x-auto">
	<table class="table">
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
					{#if volunteer.assignedCity !== null}
						<td>{volunteer.assignedCity}</td>
					{:else}
						<td>
							<button class="btn btn-primary btn-xs">Assign</button>
						</td>
					{/if}
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
