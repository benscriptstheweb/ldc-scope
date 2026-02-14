<script lang="ts">
	import HomeAssignmentModal from '../../../components/HomeAssignmentModal.svelte';
	import RecommendedOccupantBadge from '../../../components/RecommendedOccupantBadge.svelte';
	import VolunteerEditDrawer from '../../../components/VolunteerEditDrawer.svelte';
	import Plus from '../../../icons/Plus.svelte';
	import Trash from '../../../icons/Trash.svelte';
	import { getParsedDate } from '$lib/helpers/getParsedDate';
	import CustomBadge from '../../../components/CustomBadge.svelte';
	import Email from '../../../icons/Email.svelte';
	import Telephone from '../../../icons/Telephone.svelte';
	import Edit from '../../../icons/Edit.svelte';

	export let data;

	async function deleteHomeAssignment() {
		const res = await fetch('/api/assignments', {
			method: 'DELETE',
			body: JSON.stringify(data.assignments[0].id)
		});

		if (res.ok) {
			window.location.reload();
		}
	}
</script>

{#if data.user.isAdmin}
	<VolunteerEditDrawer id="edit-volunteer-drawer" volunteerDetail={data} />
{/if}
<HomeAssignmentModal volunteerToAssign={data} id="assign-home-modal" />

<div class="top-container flex flex-col items-center">
	<div class="w-80 mt-5">
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<p class="heading header-name mr-2">{data.name}</p>
				{#if data.user.isAdmin}
					<label for="edit-volunteer-drawer" class="btn btn-soft btn-xs btn-primary">
						<Edit />Edit
					</label>
				{/if}
			</div>

			<div class="flex items-center">
				<RecommendedOccupantBadge occupantType={data.type} />
				<CustomBadge type="days" days={data.daysAssigned} />
			</div>
		</div>
	</div>

	<div class="w-80">
		<h2 class="subheading">Assignment</h2>
		<p class="project-info">Project: {data.project.friendly_name} - {data.project.id}</p>
		<p class="project-info">
			Dates: {getParsedDate(data.date_start)} to {getParsedDate(data.date_end)}
		</p>
	</div>

	<div class="mt-5 w-80">
		<h2 class="subheading">Stay</h2>
		{#if data.assignedHome !== null}
			<div class="flex flex-row items-center justify-between">
				<div class="address">
					<h2 class="card-title">{data.assignedHome.address1}, {data.assignedHome.address2}</h2>
					<p>
						{data.assignedHome.city}, {data.assignedHome.state}
						{data.assignedHome.zip}
					</p>
				</div>
				<button class="btn btn-soft btn-error" onclick={deleteHomeAssignment}>
					<Trash />
				</button>
			</div>
		{:else}
			<div class="flex w-80">
				<p class="message">This volunteer has not been assigned a home yet 🥲</p>

				<button
					onclick={() =>
						(document.getElementById('assign-home-modal') as HTMLDialogElement).showModal()}
					class="btn btn-soft btn-primary"><Plus />Assign</button
				>
			</div>
		{/if}
	</div>
	<div class="mt-5 w-80">
		<h2 class="subheading">Contact</h2>
		<div class="mt-2 flex flex-row">
			<a href="tel:{data.phone}" aria-label="telephone" class="phone btn btn-soft mr-2">
				<Telephone />
			</a>

			<a href="mailto:{data.email}" aria-label="email" class="email btn btn-soft">
				<Email />
			</a>
		</div>
	</div>
</div>

<style>
	.project-info {
		font-size: 0.9em;
	}
	.message {
		font-size: 0.9em;
	}
	.top-container {
		display: flex;
		flex-direction: column;
	}
	.subheading {
		font-size: 1.2em;
		font-weight: bold;
		margin-top: 20px;
	}
</style>
