<script lang="ts">
	import type { Volunteer } from '$lib/types/volunteer';
	import { tick } from 'svelte';
	import HomeAssignmentModal from '../../components/HomeAssignmentModal.svelte';
	import VolunteerDetailDrawer from '../../components/VolunteerDetailDrawer.svelte';
	import Arrow from '../../icons/Arrow.svelte';
	import Plus from '../../icons/Plus.svelte';

	let { data } = $props();
	const volunteers = data.volunteers;

	async function addVolunteer(newVolunteer: Partial<Volunteer>) {
		const res = await fetch('/api/volunteers', {
			method: 'POST',
			body: JSON.stringify(newVolunteer)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	let assignableHomes: any = $state(null);
	let idFromVolunteerData: any = $state(null);
	let isAssigningHome = $state(false);

	async function openAssignmentModal(volunteerId: string, event: MouseEvent) {
		isAssigningHome = true;
		idFromVolunteerData = volunteerId;

		event.stopPropagation();

		await tick();
		const modalElement = document.getElementById('home-assigner') as HTMLDialogElement;
		modalElement?.showModal();

		const res = await fetch('api/homes/assignable');
		assignableHomes = await res.json();
	}

	let volunteerDetail: any = $state(null);
	let isEditingVolunteer = $state(false);

	async function openVolunteerDetailModal(volunteer: any) {
		isEditingVolunteer = true;
		volunteerDetail = volunteer;

		await tick();
		const modalElement = document.getElementById('volunteer-detail') as HTMLDialogElement;
		modalElement?.showModal();
	}
</script>

{#if isAssigningHome}
	<HomeAssignmentModal id="home-assigner" {assignableHomes} {idFromVolunteerData} />
{/if}

{#if isEditingVolunteer}
	<VolunteerDetailDrawer {volunteerDetail} />
{/if}

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
				<tr onclick={() => openVolunteerDetailModal(volunteer)}>
					<td class="name">
						<label for="my-drawer" class="btn drawer-button">
							{volunteer.name}
						</label>
					</td>
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
								onclick={(event) => openAssignmentModal(volunteer.id, event)}
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
