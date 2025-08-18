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
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
			<legend class="fieldset-legend">Add new volunteer</legend>
			<input bind:value={volunteerName} type="text" class="input" placeholder="Name" />
			<input bind:value={volunteerPhone} type="tel" class="input" placeholder="Phone" />
			<input bind:value={volunteerEmail} type="email" class="input" placeholder="Email" />

			<!-- DB projects -->
			<select bind:value={volunteerProject} class="select">
				<option disabled selected>Select project</option>
				<option>Crimson</option>
				<option>Amber</option>
				<option>Velvet</option>
			</select>

			<div class="join">
				<button
					onclick={() => addVolunteer({ volunteerName, volunteerEmail, volunteerPhone })}
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
</style>
