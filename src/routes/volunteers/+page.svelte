<script lang="ts">
	import type { Volunteer } from '$lib/types/volunteer';
	import HomeAssignmentModal from '../../components/HomeAssignmentModal.svelte';
	import Arrow from '../../icons/Arrow.svelte';
	import Plus from '../../icons/Plus.svelte';

	let { data } = $props();
	const volunteers = data.volunteers;

	// async function addVolunteer(newVolunteer: Partial<Volunteer>) {
	// 	const res = await fetch('/api/volunteers', {
	// 		method: 'POST',
	// 		body: JSON.stringify(newVolunteer)
	// 	});

	// 	if (res.ok) {
	// 		window.location.reload();
	// 	}
	// }

	let assignableHomes: any = $state(null);
	let idFromVolunteerData: any = $state(null);

	async function openAssignmentModal(volunteerId: string) {
		const modalElement = document.getElementById('my_modal_1') as HTMLDialogElement;
		modalElement?.showModal();

		idFromVolunteerData = volunteerId;

		const res = await fetch('api/homes/assignable');
		assignableHomes = await res.json();
	}

	let editingId: string | null = $state(null);

	function startEditing(volunteerId: string) {
		editingId = volunteerId;
	}
</script>

<HomeAssignmentModal {assignableHomes} {idFromVolunteerData} />

<div class="add-btn-container">
	<p class="heading">Volunteers</p>
	<button onclick={() => console.log('create new')} class="btn btn-success">
		<Plus />
		New
	</button>
</div>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Name</th>
				<th></th>
				<th>Project - Region</th>
				<th></th>
				<th>Stay</th>
			</tr>
		</thead>

		<tbody>
			{#each volunteers as volunteer}
				<tr>
					<td class="name">{volunteer.name}</td>
					<td class="spacer"><Arrow /></td>
					<td class="project-region">
						<div class="badge badge-soft badge-accent">
							{volunteer.assignedProject}
						</div>
						<div class="badge badge-soft badge-secondary">
							{volunteer.region}
						</div>
					</td>
					<td class="spacer"> <Arrow /></td>
					{#if volunteer.assignedHome !== null}
						<td class="stay">{volunteer.assignedHome}</td>
					{:else}
						<td class="stay">
							<button
								onclick={() => openAssignmentModal(volunteer.id)}
								class="btn btn-outline btn-primary btn-xs">Assign</button
							>
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
