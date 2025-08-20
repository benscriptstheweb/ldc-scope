<script lang="ts">
	import Plus from '../../icons/Plus.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const volunteers = data.volunteers;

	async function openVolunteerPage(volunteer: any) {
		goto(`/volunteers/${volunteer.id}`);
	}

	// let isAddingVolunteer = $state(false);
	// async function openNewVolunteerModal() {
	// 	isAddingVolunteer = true;

	// 	await tick();
	// 	const modalElement = document.getElementById('new-volunteer-modal') as HTMLDialogElement;
	// 	modalElement?.showModal();
	// }
</script>

<!-- TODO: move new volunteer to to shareable survey  -->
<!-- {#if isAddingVolunteer}
	<NewVolunteerModal id="new-volunteer-modal" />
{/if} -->

<div class="add-btn-container">
	<p class="heading">Volunteers</p>
	<button onclick={() => console.log('shareable!')} class="btn btn-success">
		<Plus />
		Share Survey
	</button>
</div>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Name</th>
				<th>Project</th>
				<th>Stay</th>
			</tr>
		</thead>

		<tbody>
			{#each volunteers as volunteer}
				<tr class="volunteer-rows" onclick={() => openVolunteerPage(volunteer)}>
					<td class="name">
						<label for="volunteer-drawer" class="drawer-button">
							{volunteer.name}
						</label>
					</td>
					<td class="project-region">
						<div class="badge badge-soft badge-accent">
							{volunteer.assignedProject.friendly_name}
						</div>
					</td>
					{#if volunteer.assignedHome !== null}
						<td class="stay">{volunteer.assignedHome.address1}</td>
					{:else}
						<td class="stay">
							<button class="btn btn-outline btn-primary btn-xs btn-circle">
								<label for="volunteer-drawer" class="drawer-button">
									<Plus />
								</label>
							</button>
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
	tr:hover {
		background-color: var(--color-base-300);
		cursor: pointer;
	}
</style>
