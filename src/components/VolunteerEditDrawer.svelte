<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DeleteConfirm from './DeleteConfirm.svelte';
	import ProjectByRegionSelector from './ProjectByRegionSelector.svelte';

	let { volunteerDetail, id } = $props();
	let isDrawerOpen = $state(false);

	let newVolunteerDetails = $state({
		name: '',
		phone: 0,
		email: '',
		project: 0,
		date_start: new Date(),
		date_end: new Date(),
		agent: ''
	});

	let defaultInfo = {
		name: volunteerDetail.name,
		phone: volunteerDetail.phone,
		email: volunteerDetail.email,
		project: volunteerDetail.project.id,
		date_start: volunteerDetail.date_start,
		date_end: volunteerDetail.date_end,
		agent: volunteerDetail.agent
	};

	onMount(() => {
		newVolunteerDetails = defaultInfo;
	});

	async function updateInfo() {
		const res = await fetch(`/api/volunteers?id=${volunteerDetail.id}`, {
			method: 'PATCH',
			body: JSON.stringify(newVolunteerDetails)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	async function deleteVolunteer() {
		const res = await fetch(`/api/volunteers?id=${volunteerDetail.id}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			goto('/volunteers');
		}
	}

	async function getUsers() {
		const res = await fetch('/api/users');
		const users = await res.json();

		return { users };
	}
</script>

<DeleteConfirm id="delete-volunteer-confirm" deleteFunction={deleteVolunteer} />

<div class="drawer">
	<input {id} type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />

	<div class="drawer-side">
		<label for={id} aria-label="close sidebar" class="drawer-overlay"></label>

		<ul class="menu bg-base-200 text-base-content h-full w-80 p-4">
			<h2 class="subheading">Contact Info</h2>
			<input bind:value={newVolunteerDetails.name} type="text" placeholder="Name" />
			<input bind:value={newVolunteerDetails.phone} type="number" placeholder="Phone" />
			<input bind:value={newVolunteerDetails.email} type="email" placeholder="Email" />

			<h2 class="subheading">Project</h2>
			<ProjectByRegionSelector
				bind:selection={newVolunteerDetails.project}
				projectRegion={volunteerDetail.project.region}
			/>

			<h2 class="subheading">Dates</h2>
			<div class="dates flex mb-10">
				<strong>Start</strong><input bind:value={newVolunteerDetails.date_start} type="date" />
				<strong>End</strong><input bind:value={newVolunteerDetails.date_end} type="date" />
			</div>

			<strong class="text-center">Assigned agent</strong>
			<select bind:value={newVolunteerDetails.agent} class="select mb-7">
				{#await getUsers() then fbUsers}
					{#each fbUsers.users as user}
						<option value={user.email}>{user.displayName}</option>
					{/each}
				{/await}
			</select>

			<div class="button-group flex">
				<button
					class="btn btn-ghost"
					onclick={() => {
						newVolunteerDetails = defaultInfo;
						isDrawerOpen = false;
					}}>Cancel</button
				>
				<button class="btn btn-primary" onclick={() => updateInfo()}>Update</button>
			</div>
			<button
				class="delete-btn btn btn-dash btn-error"
				onclick={() =>
					(document.getElementById('delete-volunteer-confirm') as HTMLDialogElement).showModal()}
				>Delete Volunteer</button
			>
		</ul>
	</div>
</div>

<style>
	.drawer {
		z-index: 99;
	}

	ul {
		flex-wrap: nowrap;
		height: 100%;
	}

	.subheading {
		font-size: 1.4em;
		font-weight: bold;
		margin-top: 10px;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}

	input {
		border: none;
		border-bottom: 1px solid rgba(110, 109, 112, 0.589);
		outline: none;
		padding: 5px;
		margin-bottom: 15px;
		font-size: 1.1em;
	}
	input:focus {
		border: none;
		border-bottom: 1px solid white;
		outline: none;
	}

	.button-group {
		justify-content: flex-end;
	}

	.dates {
		display: flex;
		flex-direction: column;
	}

	.delete-btn {
		margin-top: auto;
	}
</style>
