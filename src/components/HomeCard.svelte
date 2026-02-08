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
	<button
		type="button"
		class="card shadow-md cursor-pointer w-85 text-left m-3"
		onclick={visitHome}
	>
		<div class="card-body bg-base-200">
			<div class="flex justify-between">
				<div>
					<div class="indicator card-title">
						{home.address1}
					</div>
					<p class="half-address">{home.city}, {home.state} {home.zip}</p>
					{#if home.isHosting}
						<div class="badge badge-sm badge-error badge-soft mt-1">Hosting</div>
					{:else}
						Available: {getParsedDate(home.date_available)}
					{/if}
				</div>

				<!-- INDICATORS -->
				<div class="flex items-center">
					{#if home.hasPets}
						<CustomBadge type="pet" />
					{/if}
					<CustomBadge type="days" days={home.max_days_stay} />
					<RecommendedOccupantBadge occupantType={home.occupant_type} />
				</div>
			</div>
		</div>
	</button>
</div>

<style>
	.half-address {
		font-style: italic;
	}
	.card-title {
		font-weight: 800;
	}
</style>
