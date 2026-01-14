<script lang="ts">
	import { getParsedDate } from '$lib/helpers/getParsedDate';

	let { sortedVolunteers } = $props();

	function isPastDate(date: Date) {
		return new Date() >= new Date(date);
	}
</script>

<ul class="timeline timeline-vertical">
	{#each sortedVolunteers as { name, date_end }, index}
		<li>
			<div class="timeline-end">
				{getParsedDate(date_end)}
			</div>

			{#if index !== 0}
				{#if isPastDate(date_end)}
					<hr class="bg-success" />
				{:else}
					<hr class="bg-success-content" />
				{/if}
			{/if}

			{#if isPastDate(date_end)}
				<div class="timeline-middle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="text-success h-5 w-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			{:else}
				<div class="timeline-middle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="text-success-content h-5 w-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			{/if}

			<div class="timeline-start timeline-box">{name}</div>
			{#if isPastDate(date_end)}
				<hr class="bg-success" />
			{:else}
				<hr class="bg-success-content" />
			{/if}
		</li>
	{/each}
</ul>
