<script lang="ts">
	let { volunteerDetail } = $props();

	let isDrawerOpen = $state(false);
</script>

<div class="drawer">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />

	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<h2>{volunteerDetail.name}</h2>
			<!-- Sidebar content here -->
		</ul>
	</div>
</div>

<style>
	.drawer {
		z-index: 99;
	}
</style>
