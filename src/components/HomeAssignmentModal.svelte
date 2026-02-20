<script lang="ts">
	import { supabase } from '$lib/supabase/supabaseClient';
	import { isOverlapping } from '$lib/helpers/overlappingVolunteers';
	import Plus from '../icons/Plus.svelte';
	import Dots from '../icons/Dots.svelte';
	import { onMount } from 'svelte';

	let { volunteerToAssign, id } = $props();

	async function createAssignment(home: any, volunteer: any) {
		const res = await fetch('/api/assignments', {
			method: 'POST',
			body: JSON.stringify({
				volunteer: volunteer,
				home: home,
				dateRange: [volunteer.date_start, volunteer.date_end]
			})
		});
		if (res.ok) {
			window.location.reload();
		}
	}

	function closeModal() {
		(document.getElementById(id) as HTMLDialogElement).close();
	}

	async function getHomesByVolunteerProject() {
		const { data, error } = await supabase
			.from('homes')
			.select('*')
			.eq('project', volunteerToAssign.project.id);

		if (error) {
			console.error('Error fetching assignable homes:', error);
			return [];
		}

		return data;
	}

	let assignableHomes: any[] = $state([]);
	let unAssignableHomes: any[] = $state([]);

	onMount(async () => {
		const homes = await getHomesByVolunteerProject();

		homes.forEach(async (home: any) => {
			const hasOverlap = await isOverlapping(volunteerToAssign, home);
			if (
				!hasOverlap &&
				home.max_days_stay >= volunteerToAssign.daysAssigned &&
				home.occupant_type.includes(volunteerToAssign.type)
			) {
				assignableHomes.push(home);
			} else {
				unAssignableHomes.push(home);
			}
		});
	});
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		{#if assignableHomes.length > 0}
			<ul class="list mb-8">
				<h2 class="subheading">Assignable homes</h2>
				{#each assignableHomes as home}
					<li class="list-row">
						{home.address1}
						<div>
							<div class="badge badge-xs">{home.distance_to_project} mi</div>
							<button
								onclick={() => createAssignment(home, volunteerToAssign)}
								class="btn btn-success btn-xs btn-circle"><Plus /></button
							>

							<details class="dropdown dropdown-end">
								<summary class="btn btn-soft btn-xs btn-circle m-1"><Dots /></summary>
								<ul class="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm">
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
					</li>
				{/each}
			</ul>
		{/if}

		{#if unAssignableHomes.length > 0}
			<ul class="list">
				<p class="subheading">Unassignable homes</p>

				{#each unAssignableHomes as badHome}
					<li class="list-row">
						{badHome.address1}
						<div>
							<div class="badge badge-xs">{badHome.distance_to_project} mi</div>
							<details class="dropdown dropdown-end">
								<summary class="btn btn-soft btn-xs btn-circle m-1"><Dots /></summary>
								<ul class="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm">
									<li><a href="/homes/{badHome.id}">View Home</a></li>
									<li>
										<details>
											<summary>Contact Host</summary>
											<ul>
												<li><a href="sms:{badHome.hosts.phone}">Text</a></li>
												<li><a href="mailto:{badHome.hosts.email}">Email</a></li>
												<li><a href="tel:{badHome.hosts.phone}">Call</a></li>
											</ul>
										</details>
									</li>
								</ul>
							</details>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		<div class="modal-action">
			<form method="dialog">
				<button onclick={() => closeModal()} class="btn">Close</button>
			</form>
		</div>
	</div>
</dialog>

<style>
	.subheading {
		font-size: 1.3em;
		font-weight: bold;
		margin-bottom: 30px;
	}
	.list-row {
		display: flex;
		justify-content: space-between;
	}
</style>
