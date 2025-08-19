<script lang="ts">
	import { onMount } from 'svelte';

	let { volunteerDetail, id } = $props();
	let isDrawerOpen = $state(false);

	let newVolunteerDetails = $state({
		name: '',
		phone: 0,
		email: '',
		project: 0,
		date_start: new Date(),
		date_end: new Date()
	});

	let defaultInfo = {
		name: volunteerDetail.name,
		phone: volunteerDetail.phone,
		email: volunteerDetail.email,
		project: volunteerDetail.project.id,
		date_start: volunteerDetail.date_start,
		date_end: volunteerDetail.date_end
	};

	onMount(() => {
		newVolunteerDetails = defaultInfo;
	});

	async function getProjects() {
		const res = await fetch('/api/projects');
		return res.json();
	}

	async function updateInfo() {
		const res = await fetch(`/api/volunteers/${volunteerDetail.id}`, {
			method: 'PATCH',
			body: JSON.stringify(newVolunteerDetails)
		});

		if (res.ok) {
			window.location.reload();
		}
	}
</script>

<div class="drawer">
	<input {id} type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />

	<div class="drawer-side">
		<label for={id} aria-label="close sidebar" class="drawer-overlay"></label>

		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<h2 class="subheading">Contact Info</h2>
			<input bind:value={newVolunteerDetails.name} type="text" placeholder="Name" />
			<input bind:value={newVolunteerDetails.phone} type="number" placeholder="Phone" />
			<input bind:value={newVolunteerDetails.email} type="email" placeholder="Email" />

			<h2 class="subheading">Project</h2>
			<select bind:value={newVolunteerDetails.project} class="select mb-7">
				<option disabled selected>Select project</option>
				{#await getProjects() then projects}
					{#each projects as project}
						<option value={project.id} selected={project.id === newVolunteerDetails.project}
							>{project.friendly_name}</option
						>
					{/each}
				{/await}
			</select>

			<h2 class="subheading">Dates</h2>
			<div class="dates flex mb-10">
				<strong>Start</strong><input bind:value={newVolunteerDetails.date_start} type="date" />
				<strong>End</strong><input bind:value={newVolunteerDetails.date_end} type="date" />
			</div>

			<div class="button-group flex">
				<button
					class="btn btn-ghost"
					onclick={() => {
						newVolunteerDetails = defaultInfo;
						isDrawerOpen = false;
					}}>Cancel</button
				>
				<button class="btn btn-primary" onclick={() => updateInfo()}>Save</button>
			</div>
		</ul>
	</div>
</div>

<style>
	.drawer {
		z-index: 99;
	}

	.subheading {
		font-size: 1.5em;
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
		font-size: 1.2em;
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
</style>
