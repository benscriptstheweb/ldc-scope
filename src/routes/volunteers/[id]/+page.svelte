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
	import { onMount } from 'svelte';

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

	let hostOccupantGuidelineBody = '';
	let emailTo = '';

	onMount(() => {
		if (data.assignedHome) {
			hostOccupantGuidelineBody = `Dear Friends,
		
			By way of introduction, included in this email is ${data.name} who is visiting from \
			${getParsedDate(data.date_start)} - ${getParsedDate(data.date_end)} to assist with \
			the ${data.project.friendly_name} project. ${data.name}'s contact information is: 
			
				 M: ${data.phone}.
		
			Also included in this email is ${data.assignedHome.hosts.name} who is providing \
			housing accommodations for the stay. Below is the address of the property, as well as their contact info:
		
				 Host address: ${data.assignedHome.address1}, ${data.assignedHome.city}, ${data.assignedHome.state} ${data.assignedHome.zip} 
				 Host contact: ${data.assignedHome.hosts.phone}
		
			We recommend that you contact one another to review any further details such as expected time of arrival, etc.
		
			Lastly, as a reminder, please visit the link to obtain the "Host and Occupant Guidelines" provided by the branch. \
			You are encouraged to review these guidelines to help make the best of the stay: 
				 https://drive.google.com/file/d/1bQAufKzfpXYd68phJYKOJqWgs5iSiXrT/view?usp=sharing
		
			It is always worth emphasizing that your loving support of this arrangement is very much appreciated, \
			and your volunteer efforts add to the blessing of this project. May you have Jehovah's blessing!`;

			emailTo = `${data.assignedHome.hosts.email},${data.email}`;
		}
	});
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

	<div class="w-80 mb-8">
		<div class="mt-2 flex flex-row">
			<a href="tel:{data.phone}" aria-label="telephone" class="phone btn btn-soft mr-2">
				<Telephone />
			</a>

			<a href="mailto:{data.email}" aria-label="email" class="email btn btn-soft">
				<Email />
			</a>
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
			</div>
			<button class="btn btn-soft btn-error mt-2" onclick={deleteHomeAssignment}>
				<Trash /> Remove
			</button>
			<a
				href="
				mailto:{emailTo}?subject=Host Occupant Guidelines&body={encodeURIComponent(
					hostOccupantGuidelineBody
				)}"
				class="btn btn-success btn-soft mt-2"
			>
				<Email /> Send Guidelines
			</a>
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
