<script lang="ts">
	import Plus from '../../icons/Plus.svelte';
	import { goto } from '$app/navigation';
	import Toast from '../../components/Toast.svelte';
	import Trash from '../../icons/Trash.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	const volunteers = data.volunteers;

	async function openVolunteerPage(volunteer: any) {
		goto(`/volunteers/${volunteer.id}`);
	}

	let isLinkCopied = $state(false);

	async function copySurveyLink() {
		isLinkCopied = true;
		setTimeout(() => {
			isLinkCopied = false;
		}, 3000);
		await navigator.clipboard.writeText('https://ldc-scope.vercel.app/survey');
	}

	let multiSelectVolunteers = $state([]);
	let isAllSelected = $state(false);

	onMount(() => {
		isAllSelected = false;
	});

	function toggleSelectAll() {
		isAllSelected = !isAllSelected;

		if (isAllSelected) {
			multiSelectVolunteers = volunteers.map((row) => row.id);
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
</script>

{#if isLinkCopied}
	<Toast
		infoText="Link copied to clipboard!"
		verticalPos="toast-bottom"
		alertType="alert-success"
	/>
{/if}

<div class="add-btn-container">
	<p class="heading">Volunteers</p>
	<button onclick={copySurveyLink} class="btn btn-success">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="3"
			stroke="currentColor"
			class="size-4"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
			/>
		</svg>

		Survey Link
	</button>
</div>

<div class="delete-container h-6 ml-4">
	<input type="checkbox" class="checkbox checkbox-xs checkbox-error" onclick={toggleSelectAll} />

	{#if multiSelectVolunteers.length > 0}
		<button class="btn btn-error btn-xs btn-soft ml-2" onclick={deleteMultiple}>
			<Trash /> Delete multiple
		</button>
	{/if}
</div>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th> </th>
				<th>Name</th>
				<th>Project</th>
				<th>Stay</th>
			</tr>
		</thead>

		<tbody>
			{#each volunteers as volunteer}
				<tr class="volunteer-rows">
					<th>
						<label>
							<input
								type="checkbox"
								value={volunteer.id}
								bind:group={multiSelectVolunteers}
								class="checkbox checkbox-accent checkbox-xs"
							/>
						</label>
					</th>
					<td class="name" onclick={() => openVolunteerPage(volunteer)}>
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
