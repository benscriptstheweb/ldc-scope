<script lang="ts">
	import HomeAssignmentModal from '../../../components/HomeAssignmentModal.svelte';
	import VolunteerDetailDrawer from '../../../components/VolunteerDetailDrawer.svelte';
	import Arrow from '../../../icons/Arrow.svelte';
	import Plus from '../../../icons/Plus.svelte';
	import Trash from '../../../icons/Trash.svelte';

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
	<VolunteerDetailDrawer id="edit-volunteer-drawer" volunteerDetail={data} />
{/if}

<div class="top-container">
	<p class="heading header-name">{data.name}</p>
	<div class="block mb-5">
		<div class="info-container">
			<a href="tel:{data.phone}" aria-label="telephone" class="phone">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="size-4 mr-2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"
					/>
				</svg>
				{data.phone}
			</a>

			<a href="mailto:{data.email}" aria-label="email" class="email">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5 mr-2"
				>
					<path
						fill-rule="evenodd"
						d="M5.404 14.596A6.5 6.5 0 1 1 16.5 10a1.25 1.25 0 0 1-2.5 0 4 4 0 1 0-.571 2.06A2.75 2.75 0 0 0 18 10a8 8 0 1 0-2.343 5.657.75.75 0 0 0-1.06-1.06 6.5 6.5 0 0 1-9.193 0ZM10 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
						clip-rule="evenodd"
					/>
				</svg>
				<p>{data.email}</p>
			</a>
		</div>

		<div class="edit-button-container">
			{#if data.user.isAdmin}
				<label for="edit-volunteer-drawer" class="btn drawer-button">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-5"
					>
						<path
							d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"
						/>
						<path
							d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"
						/>
					</svg>
				</label>
			{/if}
		</div>
	</div>

	<div class="divider"></div>
	<h2 class="subheading mb-5">Timeline</h2>

	<div class="project-container ml-8">
		Project:
		<div class="badge">
			{data.project.id} -
			{data.project.friendly_name}
		</div>
	</div>

	<div class="stay-container flex items-center ml-8 mb-9">
		Date:
		<div class="m-2 badge badge-success badge-soft">
			{data.date_start}
			<Arrow />
			{data.date_end}
		</div>
	</div>

	<div class="divider"></div>
	<HomeAssignmentModal volunteerToAssign={data} id="assign-home-modal" />

	<h2 class="subheading mb-5">Stay</h2>
	<div class="stay-container flex flex-col justify-center items-center">
		{#if data.assignedHome !== null}
			<div class="card card-border bg-base-100 mb-9">
				<div class="flex flex-row items-center card-body">
					<div class="address">
						<h2 class="card-title">{data.assignedHome.address1}, {data.assignedHome.address2}</h2>
						<p>
							{data.assignedHome.city}, {data.assignedHome.state}
							{data.assignedHome.zip}
						</p>
					</div>
					<button class="btn btn-soft btn-error ml-5" onclick={deleteHomeAssignment}>
						<Trash />
					</button>
				</div>
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
</div>

<style>
	.message {
		font-size: 0.9em;
	}
	.card {
		box-shadow: 0px 6px 35px -12px #00000033;
	}
	img {
		max-height: 130px;
		object-fit: cover;
	}
	.top-container {
		display: flex;
		flex-direction: column;
	}
	.heading {
		padding: 30px 0 0 30px;
	}
	.subheading {
		padding-left: 30px;
		font-size: 1.2em;
		font-weight: bold;
	}
	.info-container {
		padding: 30px 0 0 30px;
	}
	.edit-button-container {
		padding: 30px 0 0 30px;
	}
	.divider {
		font-style: italic;
		font-size: small;
		width: 90%;
		margin: 0 auto;
		margin-bottom: 10px;
	}

	.phone {
		display: flex;
		align-items: center;
	}
	.email {
		display: flex;
		align-items: center;
	}
</style>
