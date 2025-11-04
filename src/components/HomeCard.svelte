<script lang="ts">
	import { goto } from '$app/navigation';
	import Paw from '../icons/Paw.svelte';
	import RecommendedOccupantBadge from './RecommendedOccupantBadge.svelte';

	let { home } = $props();

	function visitHome() {
		goto(`/homes/${home.id}`);
	}
</script>

<div class="cards-container">
	<button
		type="button"
		class="card card-side shadow-md cursor-pointer w-70 text-left m-3"
		onclick={visitHome}
	>
		<figure>
			<!-- img goes here -->
			<!-- <div class="color-block" style="background-color: {color};"></div> -->
		</figure>
		<div class="card-body bg-base-200">
			<h2 class="card-title flex justify-between">
				{home.address1}
				{home.address2}
				{#if home.hasAssignmentNow}
					<div class="badge badge-error badge-soft">Hosting</div>
				{/if}
			</h2>
			<p class="half-address">{home.city}, {home.state} {home.zip}</p>
			<p>{home.distanceToProject} miles away</p>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 24 24"
						stroke="currentColor"
						class="size-4 mr-2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
						/>
					</svg>

					{home.primaryContacts}
				</div>

				<div class="flex">
					<div class="custom-badge badge badge-warning mr-0.5">
						<strong>{home.maxDaysStay}</strong>
					</div>
					<RecommendedOccupantBadge occupantType={home.occupantType} />
					{#if home.hasPets}
						<div class="custom-badge badge badge-secondary ml-0.5">
							<strong><Paw /></strong>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</button>
</div>

<style>
	.custom-badge {
		border-radius: 25px;
		width: 20px;
	}
	.half-address {
		font-style: italic;
	}
	.card-title {
		font-weight: 800;
	}
	.badge {
		font-weight: normal !important;
		align-items: center;
	}
</style>
