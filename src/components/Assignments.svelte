<script lang="ts">
	let { volunteers } = $props();

	// JS dates start at 0=Jan
	function formatDate(date: string) {
		const test = new Date(date);

		const year = test.getFullYear();
		const month = test.getMonth() + 1;
		const day = test.getDate() + 1;

		return `${month}-${day}-${year}`;
	}

	function isPastDate(date: Date) {
		return new Date() >= new Date(date);
	}

	function sortedVolunteers(vol) {
		return vol.sort((a, b) => {
			const dateA = new Date(a.dateEnd);
			const dateB = new Date(b.dateEnd);
			return dateB.getTime() - dateA.getTime();
		});
	}
</script>

<ul class="timeline timeline-vertical">
	{#each sortedVolunteers(volunteers) as { volunteerName, dateStart, dateEnd }, index}
		<li>
			<div class="timeline-end">
				{formatDate(dateEnd)}
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

			<div class="timeline-start timeline-box">{volunteerName}</div>
			{#if isPastDate(dateEnd)}
				<hr class="bg-success" />
			{:else}
				<hr class="bg-success-content" />
			{/if}
		</li>
	{/each}
</ul>
