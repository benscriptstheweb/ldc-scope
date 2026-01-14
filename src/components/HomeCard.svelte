<script lang="ts">
	import { goto } from '$app/navigation';
	import { getParsedDate } from '$lib/helpers/getParsedDate';
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
		class="card shadow-md cursor-pointer w-70 text-left m-3"
		onclick={visitHome}
	>
		<div class="card-body bg-base-200">
			<div class="flex justify-between">
				<div>
					<h2 class="card-title justify-between">
						{home.address1}
						{#if home.hasAssignmentNow}
							<div class="badge badge-error badge-soft">Hosting</div>
						{/if}
					</h2>
					<p class="half-address">{home.city}, {home.state} {home.zip}</p>
					{getParsedDate(home.dateAvailable)}
				</div>

				<!-- INDICATORS -->
				<div class="flex items-center justify-between">
					{#if home.hasPets}
						<div class="custom-badge badge badge-secondary mr-0.5">
							<strong><Paw /></strong>
						</div>
					{/if}
					<div class="custom-badge badge badge-warning mr-0.5">
						<strong>{home.maxDaysStay}</strong>
					</div>
					<RecommendedOccupantBadge occupantType={home.occupantType} />
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
