<script lang="ts">
	let { id } = $props();

	let volunteerName: string = $state('');
	let volunteerPhone: number | null = $state(null);
	let volunteerEmail: string = $state('');
	let volunteerProject: any = $state();

	async function addVolunteer(newVolunteer: any) {
		const res = await fetch('/api/volunteers', {
			method: 'POST',
			body: JSON.stringify(newVolunteer)
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	async function getProjects() {
		const res = await fetch('api/projects');
		return res.json();
	}
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
			<legend class="fieldset-legend">Add new volunteer</legend>
			<input bind:value={volunteerName} type="text" class="input" placeholder="Name" />
			<input bind:value={volunteerPhone} type="number" class="input" placeholder="Phone" />
			<input bind:value={volunteerEmail} type="email" class="input" placeholder="Email" />

			<select bind:value={volunteerProject} class="select">
				<option disabled selected>Select project</option>
				{#await getProjects() then projects}
					{#each projects as project}
						<option value={project.id}>{project.friendly_name}</option>
					{/each}
				{/await}
			</select>

			<div class="join">
				<button
					onclick={() =>
						addVolunteer({ volunteerName, volunteerEmail, volunteerPhone, volunteerProject })}
					class="btn btn-primary">Add</button
				>
			</div>
		</fieldset>

		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
			</form>
		</div>
	</div>
</dialog>

<style>
	.join {
		width: 100%;
	}

	.fieldset {
		width: 95%;
		margin: 0 auto;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
