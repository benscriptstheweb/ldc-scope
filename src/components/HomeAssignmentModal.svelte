<script lang="ts">
	import { goto } from '$app/navigation';
	import Plus from '../icons/Plus.svelte';
	import Info from '../icons/Info.svelte';

	let { assignableHomes, idFromVolunteerData, id } = $props();

	function visitHome(homeId: string) {
		goto(`/homes/${homeId}`);
	}

	async function createAssignment(volunteerId: string, homeId: string) {
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
</script>

<!-- START MODAL -->
<dialog {id} class="modal">
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
							<button
								onclick={() => visitHome(home.id)}
								class="mr-4 btn btn-outline btn-xs btn-circle btn-info"><Info /></button
							>
							<button
								onclick={() => createAssignment(idFromVolunteerData, home.id)}
								class="btn btn-xs btn-circle btn-success"><Plus /></button
							>
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

<style>
	.list-row {
		display: flex;
		justify-content: space-between;
	}
</style>
