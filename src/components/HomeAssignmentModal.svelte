<script lang="ts">
	import { goto } from '$app/navigation';
	import Plus from '../icons/Plus.svelte';
	import Info from '../icons/Info.svelte';
	import { supabase } from '$lib/supabase/supabaseClient';

	let { volunteerToAssign, id } = $props();

	function visitHome(homeId: string) {
		goto(`/homes/${homeId}`);
	}

	let isConfirming = $state(false);
	let editingId: string | null = $state(null);

	async function createAssignment(homeId: string, volunteerId: string) {
		const res = await fetch('/api/assignments', {
			method: 'POST',
			body: JSON.stringify({
				volunteerId: volunteerId,
				homeId: homeId
			})
		});
		if (res.ok) {
			window.location.reload();
		}
	}

	function confirmAssignment(homeId: string) {
		editingId = homeId;
		isConfirming = true;
	}

	async function getAssignableHomes() {
		const volunteerAssignmentLength =
			(new Date(volunteerToAssign.date_end).getTime() -
				new Date(volunteerToAssign.date_start).getTime()) /
			(1000 * 60 * 60 * 24);

		const { data, error } = await supabase
			.from('homes')
			.select('id, address1, address2, city, state, zip')
			.gte('max_days_stay', volunteerAssignmentLength);

		if (error) {
			console.error('Error fetching assignable homes:', error);
			return [];
		}
		return data;
	}

	function closeModal() {
		(document.getElementById(id) as HTMLDialogElement).close();
		isConfirming = false;
	}
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		{#await getAssignableHomes()}
			<div class="flex w-52 flex-col gap-4">
				<div class="skeleton h-8 w-28"></div>
				<div class="skeleton h-4 w-full"></div>
				<div class="skeleton h-4 w-full"></div>
			</div>
		{:then assignableHomes}
			<p class="heading">Available Homes</p>
			<ul class="list bg-base-100 rounded-box shadow-md">
				{#if assignableHomes.length === 0}
					No homes available for {volunteerToAssign.name}'s project term.
				{:else}
					{#each assignableHomes as home}
						<li class="list-row">
							{home.address1}
							<div>
								<button
									onclick={() => visitHome(home.id)}
									class="mr-4 btn btn-outline btn-xs btn-circle btn-info"><Info /></button
								>
								<button
									onclick={(e) => confirmAssignment(home.id)}
									class="btn btn-xs btn-circle btn-success"><Plus /></button
								>
							</div>
						</li>

						{#if editingId === home.id && isConfirming}
							<div class="volunteer-info mt-8 mb-2">
								<div class="volunteer-name">
									Assign
									<div class="badge badge-outline badge-primary">
										{volunteerToAssign.name}
									</div>
									to
									<div class="badge badge-outline badge-primary">
										{home.address1}
									</div>
									on
								</div>
								<div class="flex mb-8">
									<div class="badge badge-outline badge-success">
										{volunteerToAssign.date_start}
									</div>
									-
									<div class="badge badge-outline badge-success">
										{volunteerToAssign.date_end}
									</div>
									?
								</div>
							</div>
							<div class="join mb-10">
								<button
									onclick={() => createAssignment(home.id, volunteerToAssign.id)}
									class="btn btn-success">Accept</button
								>
								<button onclick={() => (isConfirming = false)} class="btn btn-ghost">Cancel</button>
							</div>
						{/if}
					{/each}
				{/if}
			</ul>
		{/await}

		<div class="modal-action">
			<form method="dialog">
				<button onclick={() => closeModal()} class="btn">Close</button>
			</form>
		</div>
	</div>
</dialog>

<style>
	.volunteer-info {
		justify-content: space-between;
		align-items: center;
	}
	.volunteer-name {
		font-size: 1em;
	}
	.list-row {
		display: flex;
		justify-content: space-between;
	}
</style>
