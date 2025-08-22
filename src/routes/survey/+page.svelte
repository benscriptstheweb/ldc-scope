<script lang="ts">
	import Spacer from '../../components/Spacer.svelte';
	import Toast from '../../components/Toast.svelte';
	import Arrow from '../../icons/Arrow.svelte';

	let volunteerName: string = $state('');
	let volunteerPhone: number | null = $state(null);
	let volunteerEmail: string = $state('');
	let volunteerProject: any = $state();
	let volunteerStartDate: Date | null = $state(null);
	let volunteerEndDate: Date | null = $state(null);

	let submitted = $state(false);

	async function addVolunteer(newVolunteer: any) {
		const res = await fetch('/api/volunteers', {
			method: 'POST',
			body: JSON.stringify(newVolunteer)
		});

		if (res.ok) {
			submitted = true;
			setTimeout(() => {
				submitted = false;
			}, 3000);

			window.location.reload();
		}
	}

	async function getProjects() {
		const res = await fetch('api/projects');
		return res.json();
	}
</script>

{#if submitted}
	<Toast infoText={'Thank you! An agent will contact you shortly.'} />
{/if}

<h2 class="heading">Housing Request Form</h2>

<div class="flex flex-col items-center">
	<div class="form flex flex-col h-full w-80">
		<div class="message-block w-65 self-center">
			<p class="message">
				Thank you for volunteering to assist with this LDC project! To request housing accomodations
				during your visit, please provide the following information.
			</p>
			<p class="message">
				<i><strong>Note</strong></i>💡: To fulfill a housing request in the best possible way,
				please submit this form no later than one week before your visit.
			</p>
		</div>
		<div class="divider"></div>
		<Spacer spacing="mt-2" />
		<p class="subheading">1. 👷‍♀️ Basic info:</p>
		<div class="info flex flex-col">
			<input bind:value={volunteerName} type="text" placeholder="Name" />
			<input bind:value={volunteerPhone} type="number" placeholder="Phone" />
			<input bind:value={volunteerEmail} type="email" placeholder="Email" />
		</div>

		<Spacer spacing="mt-10" />
		<p class="subheading">2. 📍 Project you are attending:</p>
		<select bind:value={volunteerProject} class="select">
			<option disabled selected>Select project</option>
			{#await getProjects() then projects}
				{#each projects as project}
					<option value={project.id}>{project.friendly_name}</option>
				{/each}
			{/await}
		</select>

		<Spacer spacing="mt-10" />
		<p class="subheading">3. 📅 Start and end date:</p>
		<div class="flex justify-center items-center">
			<input class="m-1" type="date" bind:value={volunteerStartDate} />
			<Arrow />
			<input class="m-1" type="date" bind:value={volunteerEndDate} />
		</div>

		<Spacer spacing="mt-10" />
		<button
			onclick={() =>
				addVolunteer({
					volunteerName,
					volunteerEmail,
					volunteerPhone,
					volunteerProject,
					volunteerStartDate,
					volunteerEndDate
				})}
			class="btn btn-success">Submit Request</button
		>
	</div>
</div>

<style>
	.message {
		font-size: 0.8em;
		color: var(--color-neutral-content);
	}
	.subheading {
		font-weight: bold;
	}

	h2 {
		margin-top: -50px;
		margin-left: 30px;
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
		box-shadow: none;
		outline: none;
		padding: 5px;
		margin-bottom: 15px;
		font-size: 1em;
	}
	input:focus {
		border: none;
		border-bottom: 1px solid white;
		outline: none;
	}
</style>
