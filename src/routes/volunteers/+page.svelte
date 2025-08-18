<script lang="ts">
	import { tick } from 'svelte';
	import VolunteerDetailDrawer from '../../components/VolunteerDetailDrawer.svelte';
	import Plus from '../../icons/Plus.svelte';
	import NewVolunteerModal from '../../components/NewVolunteerModal.svelte';

	let { data } = $props();
	const volunteers = data.volunteers;

	let volunteerDetail: any = $state(null);
	let isEditingVolunteer = $state(false);

	async function openVolunteerDetailDrawer(volunteer: any) {
		isEditingVolunteer = true;
		volunteerDetail = volunteer;
		await tick();
	}

	let isAddingVolunteer = $state(false);
	async function openNewVolunteerModal() {
		isAddingVolunteer = true;

		await tick();
		const modalElement = document.getElementById('new-volunteer-modal') as HTMLDialogElement;
		modalElement?.showModal();
	}
</script>

{#if isEditingVolunteer}
	<VolunteerDetailDrawer id="volunteer-drawer" {volunteerDetail} />
{/if}

{#if isAddingVolunteer}
	<NewVolunteerModal id="new-volunteer-modal" />
{/if}

<div class="add-btn-container">
	<p class="heading">Volunteers</p>
	<button onclick={openNewVolunteerModal} class="btn btn-success">
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
				<th>Stay</th>
			</tr>
		</thead>

		<tbody>
			{#each volunteers as volunteer}
				<tr class="volunteer-rows" onclick={() => openVolunteerDetailDrawer(volunteer)}>
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

	.volunteer-rows:hover {
		background-color: black;
	}
</style>
