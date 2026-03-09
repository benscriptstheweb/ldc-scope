<script lang="ts">
	let { data } = $props();
</script>

<div class="mt-8 w-80 container flex flex-col">
	<p class="ml-8 heading mb-8">Reports</p>

	<div class="ml-5 collapse collapse-arrow bg-base-200 border border-base-300">
		<input type="checkbox" name="my-accordion-2" />
		<div class="collapse-title font-semibold">Number of homes by city</div>
		<div class="collapse-content text-sm">
			{#each data.cities as home}
				<p>{home.city}: {home.count}</p>
			{/each}
		</div>
	</div>
</div>
