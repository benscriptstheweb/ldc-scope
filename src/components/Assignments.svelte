<script lang="ts">
	let { home } = $props();

	const today = new Date();
</script>

<ul class="timeline timeline-vertical">
	{#each home.volunteers as { name, dateStart, dateEnd }, index}
		<li>
			<div class="timeline-end">
				{new Date(dateStart).toLocaleString('default', { month: 'short' })}
				{new Date(dateStart).getDate()}-{new Date(dateEnd).getDate()}
			</div>

			{#if index !== 0}
				{#if today > new Date(dateEnd)}
					<hr class="bg-success-content" />
				{:else}
					<hr class="bg-success" />
				{/if}
			{/if}

			{#if today > new Date(dateEnd)}
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
			{:else}
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
			{/if}

			<div class="timeline-start timeline-box">{name}</div>
			{#if today > new Date(dateEnd)}
				<hr class="bg-success-content" />
			{:else}
				<hr class="bg-success" />
			{/if}
		</li>
	{/each}
</ul>
