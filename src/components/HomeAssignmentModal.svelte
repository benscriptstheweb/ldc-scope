<script lang="ts">
	import { isOverlapping } from '$lib/helpers/overlappingVolunteers';
	import Plus from '../icons/Plus.svelte';
	import Dots from '../icons/Dots.svelte';
	import ProjectByRegionSelector from './ProjectByRegionSelector.svelte';

	let { volunteerToAssign, id } = $props();

	async function createAssignment(home: any, volunteer: any, dateRange: string[]) {
		const res = await fetch('/api/assignments', {
			method: 'POST',
			body: JSON.stringify({
				volunteer: volunteer,
				home: home,
				dateRange
			})
		});
		if (res.ok) {
			window.location.reload();
		}
	}

	function closeModal() {
		(document.getElementById(id) as HTMLDialogElement).close();
	}

	async function getHomesByVolunteerProject(projectId: string) {
		const res = await fetch(`/api/homes?projectId=${projectId}`);
		const homesByProject = res.json();

		return homesByProject;
	}

	let startDate = $state(volunteerToAssign.date_start);
	let endDate = $state(volunteerToAssign.date_end);

	async function getUpdatedHomes(start: string, end: string, projectId: string) {
		if (!start || !end) {
			return { assignableHomes: [], unAssignableHomes: [] };
		}

		const homes = await getHomesByVolunteerProject(projectId);

		let newAssignable = [];
		let newUnAssignable = [];

		for (const home of homes) {
			const hasOverlap = await isOverlapping(home, [start, end]);
			const daysRange =
				(new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);

			if (
				!hasOverlap &&
				new Date(home.date_available).getTime() <= new Date(startDate).getTime() &&
				home.max_days_stay >= daysRange &&
				home.occupant_type.includes(volunteerToAssign.type)
			) {
				newAssignable.push(home);
			} else {
				newUnAssignable.push(home);
			}
		}

		return { assignableHomes: newAssignable, unAssignableHomes: newUnAssignable };
	}
	let currentProjectId = $state(volunteerToAssign.project.id);
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		<h2 class="subheading mb-2">Select Dates</h2>
		<div class="w-55">
			<div class="flex justify-between">
				<strong class="label join-item">Start</strong>
				<input class="mb-2 join-item" bind:value={startDate} type="date" />
			</div>
			<div class="flex justify-between">
				<strong class="label">End</strong>
				<input bind:value={endDate} type="date" />
			</div>
		</div>

		<p class="mt-4 mb-2"><strong>Project</strong></p>
		<ProjectByRegionSelector
			bind:selection={currentProjectId}
			projectRegion={volunteerToAssign.project.region}
		/>

		<div class="divider"></div>
		{#await getUpdatedHomes(startDate, endDate, currentProjectId)}
			<div class="skeleton h-4 w-60 mb-3"></div>
			<div class="skeleton h-4 w-30 mb-3"></div>
			<div class="skeleton h-4 w-40"></div>
		{:then { assignableHomes, unAssignableHomes }}
			{#if !assignableHomes.length && !unAssignableHomes.length}
				There are no homes for this project 🏡
			{/if}

			{#if assignableHomes.length > 0}
				<h2 class="subheading text-center mb-2">Assignable homes</h2>
				<ul class="list mb-8">
					{#each assignableHomes as home}
						<li class="list-row">
							<div class="flex flex-col">
								<p>{home.address1}</p>
								<div class="flex flex-row items-center">
									<p class="address-city">{home.city}</p>
									{#if home.project === volunteerToAssign.project.id}
										<div class="badge badge-xs ml-2">{home.distance_to_project} mi</div>
									{/if}
								</div>
							</div>
							<div class="flex flex-col">
								<div>
									<button
										onclick={() => createAssignment(home, volunteerToAssign, [startDate, endDate])}
										class="btn btn-success btn-xs btn-circle"><Plus /></button
									>

									<details class="dropdown dropdown-end">
										<summary class="btn btn-ghost btn-xs btn-circle m-1"><Dots /></summary>
										<ul
											class="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm"
										>
											<li><a href="/homes/{home.id}">View Home</a></li>
											<li>
												<details>
													<summary>Contact Host</summary>
													<ul>
														<li><a href="sms:{home.hosts.phone}">Text</a></li>
														<li><a href="mailto:{home.hosts.email}">Email</a></li>
														<li><a href="tel:{home.hosts.phone}">Call</a></li>
													</ul>
												</details>
											</li>
										</ul>
									</details>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{/if}

			{#if unAssignableHomes.length > 0}
				<div class="collapse collapse-arrow">
					<input type="checkbox" name="accordion-unassignable" checked={false} />
					<div class="collapse-title font-semibold">
						<p class="subheading text-center mb-3">Unassignable homes</p>
					</div>
					<div class="collapse-content">
						<ul class="list">
							{#each unAssignableHomes as badHome}
								<li class="list-row">
									{badHome.address1}
									<div>
										<details class="dropdown dropdown-end">
											<summary class="btn btn-ghost btn-xs btn-circle m-1"><Dots /></summary>
											<ul
												class="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm"
											>
												<li><a href="/homes/{badHome.id}">View Home</a></li>
											</ul>
										</details>
									</div>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}

			<div class="modal-action">
				<form method="dialog">
					<button onclick={() => closeModal()} class="btn">Close</button>
				</form>
			</div>
		{/await}
	</div>
</dialog>

<style>
	.address-city {
		font-size: 0.9em;
	}
	.subheading {
		font-size: 1.3em;
		font-weight: bold;
	}
	.list-row {
		display: flex;
		justify-content: space-between;
	}
	input {
		border: 1px solid rgba(110, 109, 112, 0.589);
		padding: 5px;
		font-size: 1.1em;
		border-radius: 10px;
	}
</style>
