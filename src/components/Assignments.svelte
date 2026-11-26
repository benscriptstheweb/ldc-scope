<script lang="ts">
	import { getParsedDate } from '$lib/helpers/getParsedDate';

	let { sortedVolunteers } = $props();

	function isPastDate(date: Date) {
		return new Date() >= new Date(date);
	}
</script>

<div class="flex flex-col">
	<div class="collapse collapse-arrow">
		<input type="checkbox" name="accordion-unassignable" checked={false} />
		<div class="flex items-center mb-3 collapse-title">
			<h3 class="font-semibold italic">History</h3>
			<span class="ml-2 badge badge-info badge-sm">
				{sortedVolunteers.length} assignments
			</span>
		</div>

		<div class="collapse-content space-y-2">
			{#each sortedVolunteers as volunteer}
				<div class="card bg-base-200 border border-base-300">
					<div class="card-body p-3">
						<div class="flex items-center justify-between gap-2">
							<strong class="text-sm">
								{volunteer.volunteer_id.name}
							</strong>

							<span class="text-xs opacity-60 whitespace-nowrap">
								{getParsedDate(volunteer.date_range[1])}
							</span>
						</div>

						<div class="flex items-center gap-2 mt-1">
							{#if isPastDate(volunteer.date_range[1])}
								<span class="badge badge-success badge-sm badge-outline"> Completed </span>
							{:else}
								<span class="badge badge-info badge-sm badge-outline"> Upcoming </span>
							{/if}

							<!-- Occupant type badge goes here -->
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
