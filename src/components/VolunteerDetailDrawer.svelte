<script lang="ts">
	let { volunteerDetail } = $props();
	let isDrawerOpen = $state(false);
</script>

<div class="drawer">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />

	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<h2 class="heading">{volunteerDetail.name}</h2>

			<div class="divider">Project</div>
			<p class="subheading">Assignment: {volunteerDetail.assignedProject}</p>
			<p class="subheading">Date start: {volunteerDetail.date_start}</p>
			<p class="subheading">Date end: {volunteerDetail.date_end}</p>
			<p class="subheading">Assigned home: {volunteerDetail.assignedHome}</p>

			<div class="divider">Contact Information</div>
			<p class="subheading">Phone: {volunteerDetail.phone}</p>
			<p class="subheading">Email: {volunteerDetail.email}</p>
		</ul>
	</div>
</div>

<style>
	.drawer {
		z-index: 99;
	}
</style>
