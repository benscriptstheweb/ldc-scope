<script lang="ts">
	import Arrow from '../icons/Arrow.svelte';

	let { volunteerDetail } = $props();
	let isDrawerOpen = $state(false);
</script>

<div class="drawer">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />

	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<h2 class="heading">{volunteerDetail.name}</h2>

			<div class="block">
				<div class="divider">Project Details</div>
				<div class="subheading">
					Project ID: <div class="badge badge-primary badge-xs ml-1">
						{volunteerDetail.assignedProject.id}
					</div>
					<p>{volunteerDetail.assignedProject.full_address}</p>
				</div>

				<div class="flex mt-8">
					<div class="badge badge-outline badge-secondary">
						{volunteerDetail.date_start}
					</div>
					<!-- <Arrow /> -->
					-
					<div class="badge badge-outline badge-secondary">
						{volunteerDetail.date_end}
					</div>
				</div>
			</div>

			<div class="block stay">
				<div class="divider">Stay</div>
				{#if volunteerDetail.assignedHome !== null}
					{volunteerDetail.assignedHome.address1},
					{#if volunteerDetail.assignedHome.address2 !== null}
						{volunteerDetail.assignedHome.address2},
					{/if}
					{volunteerDetail.assignedHome.city},
					{volunteerDetail.assignedHome.state}
					{volunteerDetail.assignedHome.zip}
				{:else}
					<p class="no-stay-msg">No home assigned to this volunteer 🥲</p>
				{/if}
			</div>

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

	.divider {
		font-style: italic;
	}
	.stay {
		text-align: center;
	}
	.no-stay-msg {
		color: gray;
		font-size: 0.9em;
	}

	.block {
		margin-bottom: 30px;
	}
</style>
