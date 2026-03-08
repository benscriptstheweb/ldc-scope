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
	import Sms from '../../../icons/Sms.svelte';
	import Dots from '../../../icons/Dots.svelte';

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
	let comments = $state(data.volunteer_comments);

	async function postComment(text: string) {
		const res = await fetch(`/api/volunteerComments?volunteerId=${data.id}`, {
			method: 'POST',
			body: JSON.stringify({ text, user: data.user.email })
		});

		if (res.ok) {
			const tempComment = {
				id: crypto.randomUUID(),
				volunteer_id: data.id,
				user: data.user.email,
				comment: text
			};

			comments = [tempComment, ...comments];
		}
	}

	async function deleteComment(commentId: string) {
		const res = await fetch(`/api/volunteerComments?commentId=${commentId}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			comments = comments.filter((c: any) => c.id !== commentId);
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

	<div class="w-80">
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

	<div class="flex self-center divider w-80"></div>

	{#if data.allergies_notes}
		<div class="w-80 mb-10">
			<h2 class="subheading">🚨 Special Needs</h2>
			{data.allergies_notes}
		</div>
	{/if}

	<div class="w-80 mb-10">
		<h2 class="subheading">Assignment</h2>
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

	<div class="flex items-center w-80 justify-between">
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
				hosts={assignedHome.home_id.hosts}
				bind:successfullySent={emailSent}
			/>
			<div class="stay-info mt-5 w-80">
				{#if assignedHome !== null}
					<div class="flex flex-row items-center justify-between">
						<div class="address">
							<h2>{assignedHome.home_id.address1}, {assignedHome.home_id.address2}</h2>
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
					</div>
					<div class="flex justify-between">
						<button
							class="btn btn-dash mt-2 btn-xs"
							onclick={() => deleteHomeAssignment(assignedHome.id)}
						>
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
				{/if}
			</div>
		{/each}
	{/if}

	<div class="items-center flex flex-col mt-10">
		<div class="divider w-80"></div>
		<div class="w-80 comment-container">
			<div class="flex flex-row mb-3 justify-between items-center">
				<strong class="ml-1">Comments</strong>

				{#if !newComment}
					<button class="btn btn-soft" onclick={() => (newComment = !newComment)}
						><Plus /> New comment</button
					>
				{:else}
					<div>
						<button class="btn btn-ghost" onclick={() => (newComment = !newComment)}>Cancel</button>
						<button class="ml-3 btn btn-success btn-soft" onclick={() => postComment(commentText)}
							>Post</button
						>
					</div>
				{/if}
			</div>

			{#if newComment}
				<textarea maxlength="300" class="w-80 mb-5 textarea" bind:value={commentText}></textarea>
			{/if}

			{#each comments as comment}
				<div class="chat {data.user.email === comment.user ? 'chat-end' : 'chat-start'}">
					<div class="flex chat-bubble">
						<p class="mr-4">{comment.comment}</p>

						{#if data.user.email === comment.user}
							<details class="dropdown dropdown-end">
								<summary class="btn btn-ghost btn-xs btn-circle"><Dots /></summary>
								<ul class="menu dropdown-content bg-base-300 rounded-box z-1 w-50 shadow-sm">
									<li>
										<button class="btn btn-error" onclick={() => deleteComment(comment.id)}
											><Trash />Delete</button
										>
									</li>
								</ul>
							</details>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
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
