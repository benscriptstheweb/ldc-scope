<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/supabaseClient';
	import { isOverlapping } from '$lib/helpers/overlappingVolunteers';

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
			{#if assignableHomes.length === 0}
				No homes available for {volunteerToAssign.name}'s project term 🚗
			{:else}
				<ul class="list bg-base-100 rounded-box shadow-md">
					{#each assignableHomes as home}
						{#await isOverlapping(volunteerToAssign.id, home.id) then hasOverlap}
							<li class="list-row">
								{home.address1}
								<div>
									<button onclick={() => visitHome(home.id)} class="mr-2 btn btn-xs btn-soft"
										>View</button
									>
									<button
										onclick={() => confirmAssignment(home.id)}
										class="btn btn-xs btn-success btn-soft">Assign</button
									>
								</div>
							</li>

							{#if editingId === home.id && isConfirming}
								<div class="edit-pane p-5">
									<div class="volunteer-info mt-2 mb-8">
										Assign {volunteerToAssign.name} to this home?
										<div>
											<strong>
												{home.address1}, {home.city}, {home.state}
												{home.zip}
											</strong>
										</div>
									</div>

									<div class="flex flex-col mb-10">
										<label>
											<input
												type="checkbox"
												class="checkbox checkbox-accent checkbox-xs"
												checked={home.max_days_stay >= volunteerToAssign.daysAssigned}
												onclick={(e) => e.preventDefault()}
											/>
											Stay duration
										</label>
										<label>
											<input
												type="checkbox"
												class="checkbox checkbox-accent checkbox-xs"
												checked={home.occupant_type === volunteerToAssign.type ||
													home.occupant_type === 'A'}
												onclick={(e) => e.preventDefault()}
											/>
											Recommended occupant
										</label>
										<label>
											<input
												type="checkbox"
												class="checkbox checkbox-accent checkbox-xs"
												checked={!hasOverlap}
												onclick={(e) => e.preventDefault()}
											/>
											Not currently hosting
										</label>
									</div>

									<div>
										<button
											onclick={() => createAssignment(home.id, volunteerToAssign.id)}
											class="btn btn-success"
											disabled={!(
												!hasOverlap &&
												home.max_days_stay >= volunteerToAssign.daysAssigned &&
												(home.occupant_type === volunteerToAssign.type ||
													home.occupant_type === 'A')
											)}>Accept</button
										>
										<button onclick={() => (isConfirming = false)} class="btn btn-ghost"
											>Cancel</button
										>
									</div>
								</div>
							{/if}
						{/await}
					{/each}
				</ul>
			{/if}
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
	.list-row {
		display: flex;
		justify-content: space-between;
	}
</style>
