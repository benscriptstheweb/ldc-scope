<script lang="ts">
	import { tick } from 'svelte';
	import HomeAssignmentModal from './HomeAssignmentModal.svelte';
	import Plus from '../icons/Plus.svelte';

	let { volunteerDetail, id } = $props();
	let isDrawerOpen = $state(false);

	let isAssigningHome = $state(false);
	let volunteerToAssign: any = $state(null);

	async function openAssignmentModal(volunteer: any, event: MouseEvent) {
		isAssigningHome = true;
		volunteerToAssign = volunteer;

		event.stopPropagation();

		await tick();
		const modalElement = document.getElementById('home-assigner') as HTMLDialogElement;
		modalElement?.showModal();
	}
</script>

{#if isAssigningHome}
	<HomeAssignmentModal id="home-assigner" {volunteerToAssign} />
{/if}

<div class="drawer">
	<input {id} type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />

	<div class="drawer-side">
		<label for={id} aria-label="close sidebar" class="drawer-overlay"></label>

		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<h2 class="heading text-center mt-8 mb-8">{volunteerDetail.name}</h2>

			<div class="block">
				<div class="divider">Project Details</div>
				<div class="subheading">
					Project ID: <div class="badge badge-primary ml-1">
						{volunteerDetail.assignedProject.id}
					</div>
					<p>{volunteerDetail.assignedProject.full_address}</p>
				</div>

				<div class="flex mt-8">
					<div class="badge badge-outline badge-secondary">
						{volunteerDetail.date_start}
					</div>
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
					<p class="no-stay-msg mb-2">No home assigned to this volunteer 🥲</p>
					<label for="volunteer-drawer" class="drawer-button">
						<button
							onclick={(event) => openAssignmentModal(volunteerDetail, event)}
							class="btn btn-primary"
						>
							<Plus />Assign
						</button>
					</label>
				{/if}
			</div>

			<div class="divider">Contact Information</div>
			<ul class="list bg-base-100 rounded-box shadow-md">
				<li class="list-row">
					<a href="tel:{volunteerDetail.phone}" aria-label="telephone">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"
							/>
						</svg>
						<p>{volunteerDetail.phone}</p>
					</a>
				</li>
				<li class="list-row">
					<a href="mailto:{volunteerDetail.email}" aria-label="email">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="size-5"
						>
							<path
								fill-rule="evenodd"
								d="M5.404 14.596A6.5 6.5 0 1 1 16.5 10a1.25 1.25 0 0 1-2.5 0 4 4 0 1 0-.571 2.06A2.75 2.75 0 0 0 18 10a8 8 0 1 0-2.343 5.657.75.75 0 0 0-1.06-1.06 6.5 6.5 0 0 1-9.193 0ZM10 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
								clip-rule="evenodd"
							/>
						</svg>
						<p>{volunteerDetail.email}</p>
					</a>
				</li>
			</ul>
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
