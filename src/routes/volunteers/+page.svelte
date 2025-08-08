<script lang="ts">
	import type { Volunteer } from '$lib/types/volunteer';
	import Info from '../../icons/Info.svelte';
	import Plus from '../../icons/Plus.svelte';

	let { data } = $props();
	const volunteers = data.volunteers;

	const newVolunteerData = {
		project: 'San Bruno',
		name: 'Janetta',
		phone: 5168906678,
		email: 'jlcatzson@yahoo.com',
		dateStart: new Date('2025-08-07'),
		dateEnd: new Date('2025-08-08')
	};

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

	async function openAssignmentModal(volunteerId: string) {
		const modalElement = document.getElementById('my_modal_1') as HTMLDialogElement;
		modalElement?.showModal();

		const res = await fetch('api/homes/assignable');
		assignableHomes = await res.json();
	}
</script>

<!-- START MODAL -->
<dialog id="my_modal_1" class="modal">
	<div class="modal-box">
		{#if assignableHomes === null}
			<div class="flex w-52 flex-col gap-4">
				<div class="skeleton h-8 w-28"></div>
				<div class="skeleton h-4 w-full"></div>
				<div class="skeleton h-4 w-full"></div>
			</div>
		{:else}
			<p class="heading">Available Homes</p>
			<ul class="list bg-base-100 rounded-box shadow-md">
				{#each assignableHomes as home}
					<li class="list-row">
						{home.address1}
						<div>
							<button class="mr-4 btn btn-outline btn-xs btn-circle btn-info"><Info /></button>
							<button class="btn btn-xs btn-circle btn-success"><Plus /></button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
			</form>
		</div>
	</div>
</dialog>
<!-- END MODAL -->

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
				<th>Assignment</th>
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

	.list-row {
		display: flex;
		justify-content: space-between;
	}
</style>
