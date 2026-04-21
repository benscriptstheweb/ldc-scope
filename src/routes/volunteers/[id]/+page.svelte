<script lang="ts">
	import HomeAssignmentModal from '../../../components/HomeAssignmentModal.svelte';
	import RecommendedOccupantBadge from '../../../components/RecommendedOccupantBadge.svelte';
	import VolunteerEditDrawer from '../../../components/VolunteerEditDrawer.svelte';
	import Trash from '../../../icons/Trash.svelte';
	import { getParsedDate } from '$lib/helpers/getParsedDate';
	import CustomBadge from '../../../components/CustomBadge.svelte';
	import Email from '../../../icons/Email.svelte';
	import Telephone from '../../../icons/Telephone.svelte';
	import Edit from '../../../icons/Edit.svelte';
	import SendConfirm from '../../../components/SendConfirm.svelte';
	import Toast from '../../../components/Toast.svelte';
	import Sms from '../../../icons/Sms.svelte';
	import Dots from '../../../icons/Dots.svelte';
	import Route from '../../../icons/Route.svelte';
	import Comment from '../../../icons/Comment.svelte';
	import Comments from '../../../components/Comments.svelte';

	let { data } = $props();

	async function deleteHomeAssignment(id: string) {
		const res = await fetch('/api/assignments', {
			method: 'DELETE',
			body: JSON.stringify(id)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	let emailSent = $state(false);

	let newComment = $state(false);
	let commentText = $state('');

	async function postComment(text: string) {
		const res = await fetch(`/api/volunteerComments?volunteerId=${data.id}`, {
			method: 'POST',
			body: JSON.stringify({ text, user: data.user.email })
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	async function deleteComment(commentId: string) {
		const res = await fetch(`/api/volunteerComments?commentId=${commentId}`, {
			method: 'DELETE'
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

{#if emailSent}
	<Toast infoText="Email sent successfully!" alertType="alert-success" />
{/if}

<div class="top-container flex flex-col items-center">
	<div class="w-80 mt-5">
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<p class="heading header-name mr-2">{data.name}</p>
			</div>
		</div>
		<p class="badge badge-dash badge-info"><strong>{data.ba_number}</strong></p>
	</div>

	<!-- CONTACT BUTTONS -->
	<div class="w-80 mb-8">
		<div class="mt-2">
			<div class="flex mt-5">
				<a href="sms:{data.phone}" aria-label="telephone" class="phone mr-5">
					<Sms />
				</a>
				<a href="tel:{data.phone}" aria-label="telephone" class="phone mr-5">
					<Telephone />
				</a>
				<a href="mailto:{data.email}" aria-label="email" class="email">
					<Email />
				</a>
			</div>
		</div>
	</div>

	{#if data.user.isAdmin}
		<label for="edit-volunteer-drawer" class="btn btn-soft btn-primary mb-8">
			<Edit />Edit Volunteer
		</label>
	{/if}

	{#if data.allergies_notes}
		<div class="w-80 mb-10">
			<h2 class="subheading">🚨 Special Needs</h2>
			{data.allergies_notes}
		</div>
	{/if}

	<div class="self-center card bg-base-300 pt-9 w-90">
		<div class="ml-8 mr-8 mb-10">
			<div class="flex justify-between items-cente">
				<h2 class="subheading">Assignment</h2>
				<div class="flex">
					<CustomBadge type="days" days={data.daysAssigned} />
					<RecommendedOccupantBadge occupantType={data.type} />
				</div>
			</div>
			<div class="divider"></div>
			<p class="project-info">Project: {data.project.friendly_name} - {data.project.id}</p>
			<p class="project-info">
				Dates: {getParsedDate(data.date_start)} to {getParsedDate(data.date_end)}
			</p>

			<p class="project-info">
				Assigned agent:
				{#if data.agent}
					<span class="badge badge-soft badge-info">
						<strong>{data.assignedUserAgent.displayName}</strong></span
					>
				{:else}
					<span class="badge badge-soft badge-error"><strong>No assigned agent</strong></span>
				{/if}
			</p>
		</div>

		<div class="mt-4 ml-8 mr-8 mb-9 flex flex-col">
			<div class="flex flex-row justify-between mb-2">
				<h2 class="subheading">Stays</h2>
				<button
					onclick={() =>
						(document.getElementById('assign-home-modal') as HTMLDialogElement).showModal()}
					class="btn btn-soft"><Route />New stay</button
				>
			</div>
			{#if data.assignedHome}
				{#each data.assignedHome as assignedHome, idx}
					<SendConfirm
						modalId="id-send-confirm-{idx}"
						{data}
						{assignedHome}
						hosts={assignedHome.home_id.hosts}
						bind:successfullySent={emailSent}
					/>
					{#if assignedHome !== null}
						<div class="stay-info mt-5 flex justify-between items-center">
							<div class="address">
								<h2>{assignedHome.home_id.address1}</h2>
								<p>
									{assignedHome.home_id.city}, {assignedHome.home_id.state}
									{assignedHome.home_id.zip}
								</p>
								<p>
									{getParsedDate(assignedHome.date_range[0])} to {getParsedDate(
										assignedHome.date_range[1]
									)}
								</p>
							</div>
							<details class="dropdown dropdown-end">
								<summary class="btn btn-ghost btn-xs btn-circle m-1"><Dots /></summary>
								<ul class="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm">
									<li><a href="/homes/{assignedHome.home_id.id}">View home</a></li>
									<li>
										<button
											onclick={() =>
												(
													document.getElementById(`id-send-confirm-${idx}`) as HTMLDialogElement
												).showModal()}
										>
											Send Guidelines
										</button>
									</li>
									<li>
										<button onclick={() => deleteHomeAssignment(assignedHome.id)}>
											Remove stay
										</button>
									</li>
								</ul>
							</details>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</div>

	<Comments
		postCommentCallback={postComment}
		deleteCommentCallback={deleteComment}
		commentsData={data.volunteer_comments}
		currentUserEmail={data.user.email}
	/>
</div>

<style>
	.project-info {
		font-size: 0.9em;
	}
	.top-container {
		display: flex;
		flex-direction: column;
	}
	.subheading {
		font-size: 1.2em;
		font-weight: bold;
	}
	.address {
		font-size: 0.8em;
	}
	.address > h2 {
		font-weight: bold;
	}
</style>
