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
	import SendConfirm from '../../../components/SendConfirm.svelte';
	import Toast from '../../../components/Toast.svelte';

	let { data } = $props();

	// TODO: delete specific assignment by id since there will be other assignments
	async function deleteHomeAssignment() {
		const res = await fetch('/api/assignments', {
			method: 'DELETE',
			body: JSON.stringify(data.assignments[0].id)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	let emailSent = $state(false);
</script>

{#if data.user.isAdmin}
	<VolunteerEditDrawer id="edit-volunteer-drawer" volunteerDetail={data} />
{/if}
<HomeAssignmentModal volunteerToAssign={data} id="assign-home-modal" />

{#if emailSent}
	<Toast infoText="Email sent successfully!" alertType="alert-success" />
{/if}

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
				<CustomBadge type="days" days={data.daysAssigned} />
				<RecommendedOccupantBadge occupantType={data.type} />
			</div>
		</div>
	</div>

	<div class="w-80 mb-8">
		<div class="mt-2">
			<div class="flex mt-5">
				<a href="tel:{data.phone}" aria-label="telephone" class="phone mr-5">
					<Telephone />
				</a>
				<a href="mailto:{data.email}" aria-label="email" class="email">
					<Email />
				</a>
			</div>
		</div>
	</div>

	<div class="w-80 mb-8">
		<h2 class="subheading">Assignment</h2>
		<p class="project-info">Project: {data.project.friendly_name} - {data.project.id}</p>
		<p class="project-info">
			Dates: {getParsedDate(data.date_start)} to {getParsedDate(data.date_end)}
		</p>
	</div>

	<div class="flex items-center mt-8 w-80 justify-between">
		<div>
			<h2 class="subheading">Stays</h2>
		</div>
		<div>
			<button
				onclick={() =>
					(document.getElementById('assign-home-modal') as HTMLDialogElement).showModal()}
				class="btn btn-soft btn-primary"><Plus />New stay</button
			>
		</div>
	</div>
	{#if data.assignedHome}
		{#each data.assignedHome as assignedHome, idx}
			<SendConfirm
				modalId="id-send-confirm-{idx}"
				{data}
				{assignedHome}
				hosts={assignedHome.hosts}
				bind:successfullySent={emailSent}
			/>
			<div class="mt-5 w-80">
				{#if assignedHome !== null}
					<div class="flex flex-row items-center justify-between">
						<div class="address">
							<h2>{assignedHome.address1}, {assignedHome.address2}</h2>
							<p>
								{assignedHome.city}, {assignedHome.state}
								{assignedHome.zip}
							</p>
						</div>
					</div>
					<div class="flex justify-between">
						<button class="btn btn-dash mt-2 btn-xs" onclick={deleteHomeAssignment}>
							<Trash /> Remove stay
						</button>
						<button
							class="btn btn-success btn-soft mt-2 btn-xs"
							onclick={() =>
								(
									document.getElementById(`id-send-confirm-${idx}`) as HTMLDialogElement
								).showModal()}
						>
							<Email /> Send Guidelines
						</button>
					</div>
				{:else}
					<div class="flex w-80">
						<p class="message">This volunteer has not been assigned a home yet 🥲</p>
					</div>
				{/if}
			</div>
		{/each}
	{/if}
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
	.address {
		font-size: 0.8em;
	}
	.address > h2 {
		font-weight: bold;
	}
</style>
