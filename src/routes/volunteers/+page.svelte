<script lang="ts">
	import { goto } from '$app/navigation';
	import Toast from '../../components/Toast.svelte';
	import Trash from '../../icons/Trash.svelte';
	import { onMount } from 'svelte';
	import Link from '../../icons/Link.svelte';
	import RecommendedOccupantBadge from '../../components/RecommendedOccupantBadge.svelte';
	import DeleteConfirm from '../../components/DeleteConfirm.svelte';
	import CustomBadge from '../../components/CustomBadge.svelte';

	let { data } = $props();
	const volunteers = data.volunteers;

	async function openVolunteerPage(volunteer: any) {
		goto(`/volunteers/${volunteer.id}`);
	}

	let multiSelectVolunteers = $state([]);
	let isAllSelected = $state(false);

	onMount(() => {
		isAllSelected = false;
	});

	let isLinkCopied = $state(false);
	async function copySurveyLink() {
		isLinkCopied = true;
		setTimeout(() => {
			isLinkCopied = false;
		}, 3000);
		await navigator.clipboard.writeText('https://ldc-scope.vercel.app/survey');
	}

	function toggleSelectAll() {
		isAllSelected = !isAllSelected;

		if (isAllSelected) {
			multiSelectVolunteers = volunteers.map((row: any) => row.id);
		} else {
			multiSelectVolunteers = [];
		}
	}
	async function deleteMultiple() {
		const res = await fetch(`/api/volunteers`, {
			method: 'DELETE',
			body: JSON.stringify(multiSelectVolunteers)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	let sortedVolunteers = $state(volunteers);
	let cycleSortState = $state(0);

	function toggleSort(sorter: string) {
		cycleSortState += 1;

		if (cycleSortState === 1) {
			sortedVolunteers = [...volunteers].sort((a, b) => {
				if (sorter === 'project') {
					return a.project.friendly_name.localeCompare(b.project.friendly_name);
				} else if (sorter === 'status') {
					return a.isAssigned - b.isAssigned;
				} else if (sorter === 'name') {
					return a.name.localeCompare(b.name);
				}
			});
		} else if (cycleSortState === 2) {
			sortedVolunteers = [...volunteers].sort((a, b) => {
				if (sorter === 'project') {
					return b.project.friendly_name.localeCompare(a.project.friendly_name);
				} else if (sorter === 'status') {
					return b.isAssigned - a.isAssigned;
				} else if (sorter === 'name') {
					return b.name.localeCompare(a.name);
				}
			});

			// reset
			cycleSortState = 0;
		}
	}
</script>

<DeleteConfirm
	id="batch-delete-confirm"
	deleteFunction={deleteMultiple}
	message={`Do you want to delete ${multiSelectVolunteers.length} volunteer(s)?`}
/>

{#if isLinkCopied}
	<Toast
		infoText="Link copied to clipboard!"
		verticalPos="toast-bottom"
		alertType="alert-success"
	/>
{/if}

<div class="add-btn-container">
	<p class="heading">Volunteers</p>
	<button onclick={copySurveyLink} class="btn btn-soft btn-primary">
		<Link /> Survey
	</button>
</div>

<div class="flex delete-container justify-between h-8 ml-2 mb-2">
	<button
		class="btn btn-error btn-soft ml-2"
		disabled={multiSelectVolunteers.length <= 0}
		onclick={() =>
			(document.getElementById('batch-delete-confirm') as HTMLDialogElement).showModal()}
	>
		<Trash />
		{#if multiSelectVolunteers.length !== 0}
			{#if multiSelectVolunteers.length === 1}
				<p>{multiSelectVolunteers.length} volunteer</p>
			{:else}
				<p>{multiSelectVolunteers.length} volunteers</p>
			{/if}
		{/if}
	</button>
</div>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>
					<input type="checkbox" onclick={toggleSelectAll} />
				</th>
				<th class="cursor-pointer" onclick={() => toggleSort('name')}>Name</th>
				<th class="cursor-pointer" onclick={() => toggleSort('project')}>Project</th>
				<th class="cursor-pointer text-right" onclick={() => toggleSort('status')}>Status</th>
			</tr>
		</thead>

		<tbody>
			{#each sortedVolunteers as volunteer}
				<tr class="volunteer-rows" onclick={() => openVolunteerPage(volunteer)}>
					<th>
						<label>
							<input
								onclick={(e) => e.stopPropagation()}
								type="checkbox"
								value={volunteer.id}
								bind:group={multiSelectVolunteers}
							/>
						</label>
					</th>
					<td class="name">
						<label for="volunteer-drawer" class="drawer-button">
							{volunteer.name}
						</label>
					</td>
					<td class="project-region">
						{volunteer.assignedProject.friendly_name}
					</td>
					<td class="info-status flex justify-end">
						{#if volunteer.assignedHome === null}
							<CustomBadge type="unassigned" />
						{/if}
						<RecommendedOccupantBadge occupantType={volunteer.type} />
						<CustomBadge type="days" days={volunteer.daysAssigned} />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.info-status {
		font-weight: bold;
	}
	.add-btn-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30px;
	}
	.volunteer-rows:hover {
		background-color: var(--color-base-300);
		cursor: pointer;
	}
</style>
