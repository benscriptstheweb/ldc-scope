<script lang="ts">
	let { home } = $props();

	const today = new Date();

	// JS dates start at 0=Jan
	function parseDate(dateString: string) {
		const [year, month, day] = dateString.split('-').map(Number);
		return new Date(year, month - 1, day); // month is 0-based in JS
	}

	function isPastDate(date: string) {
		return today >= parseDate(date);
	}

	function sortedVolunteers(volunteers) {
		return volunteers.sort((a, b) => {
			const dateA = parseDate(a.dateEnd);
			const dateB = parseDate(b.dateEnd);
			return dateB.getTime() - dateA.getTime();
		});
	}
</script>

<ul class="timeline timeline-vertical">
	{#each sortedVolunteers(home.volunteers) as { name, dateStart, dateEnd }, index}
		<li>
			<div class="timeline-end">
				{parseDate(dateStart).toLocaleString('default', { month: 'short' })}
				{parseDate(dateStart).getDate()}-{parseDate(dateEnd).getDate()}
			</div>

			{#if index !== 0}
				{#if isPastDate(dateEnd)}
					<hr class="bg-success" />
				{:else}
					<hr class="bg-success-content" />
				{/if}
			{/if}

			{#if isPastDate(dateEnd)}
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
			{#if isPastDate(dateEnd)}
				<hr class="bg-success" />
			{:else}
				<hr class="bg-success-content" />
			{/if}
		</li>
	{/each}
</ul>
