<script lang="ts">
	import { goto } from '$app/navigation';
	import { getParsedDate } from '$lib/helpers/getParsedDate';
	import CustomBadge from './CustomBadge.svelte';
	import RecommendedOccupantBadge from './RecommendedOccupantBadge.svelte';

	let { home } = $props();

	function visitHome() {
		goto(`/homes/${home.id}`);
	}
</script>

<div class="cards-container">
	<button class="card shadow-md cursor-pointer w-81 mt-1 text-left" onclick={visitHome}>
		<div class="p-3 bg-base-200">
			<div class="flex justify-between">
				<div>
					<div class="indicator card-title">
						{home.address1}
					</div>
					<p class="half-address">{home.city}, {home.state} {home.zip}</p>
					{#if home.isHosting}
						<div class="badge badge-sm badge-error badge-soft mt-1">Hosting</div>
					{:else}
						<p class="half-address">Available: {getParsedDate(home.date_available)}</p>
					{/if}
				</div>

				<!-- INDICATORS -->
				<div class="flex flex-col items-end justify-center">
					<div class="flex items-center ml-3 mb-3">
						{#if home.hasPets}
							<CustomBadge type="pet" />
						{/if}
						<CustomBadge type="days" days={home.max_days_stay} />
						<RecommendedOccupantBadge occupantType={home.occupant_type} />
					</div>
					<div class="badge badge-xs">{home.distance_to_project} mi</div>
				</div>
			</div>
		</div>
	</button>
</div>

<style>
	.half-address {
		font-style: italic;
		font-size: 0.9em;
	}
	.card-title {
		font-weight: 800;
	}
</style>
