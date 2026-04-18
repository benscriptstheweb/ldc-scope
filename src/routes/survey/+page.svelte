<script lang="ts">
	import Spacer from '../../components/Spacer.svelte';
	import Toast from '../../components/Toast.svelte';
	import Arrow from '../../icons/Arrow.svelte';
	import Plus from '../../icons/Plus.svelte';
	import { getProjects } from '$lib/helpers/getProjects';
	import { type Volunteer } from '$lib/supabase/types/volunteer';
	import { OccupantType } from '$lib/supabase/types/occupantType';

	let newVolunteer: Partial<Volunteer> = $state({
		email: '',
		phone: null,
		date_start: '',
		date_end: '',
		allergies_notes: ''
	});

	let occupantType = $state('');

	// for single people, just one name
	let singleName = $state('');

	// for couples, combined name
	let spouse1 = $state('');
	let spouse2 = $state('');
	let coupleName = $derived(`${spouse1} & ${spouse2}`);

	let newVolunteerName = $derived.by(() => {
		if (occupantType === 'C') {
			return coupleName;
		} else {
			return singleName;
		}
	});

	let submitted = $state(false);

	async function addVolunteer(name: string, details: any, type: string) {
		const res = await fetch(`/api/volunteers`, {
			method: 'POST',
			body: JSON.stringify({
				name,
				type,
				email: details.email,
				phone: details.phone,
				project: details.project.id,
				date_start: details.date_start,
				date_end: details.date_end,
				allergies_notes: details.allergies_notes
			})
		});

		if (res.ok) {
			await fetch('/api/send-notification', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					type,
					email: details.email,
					phone: details.phone,
					project: details.project.friendly_name,
					date_start: details.date_start,
					date_end: details.date_end,
					allergies_notes: details.allergies_notes
				})
			});

			submitted = true;
			setTimeout(() => {
				submitted = false;
				window.location.reload();
			}, 7000);
		}
	}

	let hasSpecialNeeds = $state(false);
</script>

{#if submitted}
	<Toast infoText={'Your request has been submitted. An agent will contact you shortly.'} />
{/if}

<div class="flex flex-col items-center mb-10 mt-5">
	<h2 class="heading">LDC Region 7</h2>
	<p class="title-description mb-5">Housing Request</p>
	<div class="form flex flex-col h-full w-80">
		<div class="p-5 bg-base-200 message-block w-90 self-center">
			<p class="message">
				Thank you for volunteering to assist with this LDC project! To request housing accomodations
				during your visit, please provide the following information.
			</p>
			<p class="mt-2 message">
				💡 Please submit this form no later than <strong><u>one week</u></strong> before your visit.
			</p>
		</div>
		<Spacer spacing="mt-15" />

		<form>
			<p class="subheading">1. Basic info:</p>

			<div class="mt-5 mb-5 occupant-type flex justify-between">
				<label>
					<input type="radio" value={OccupantType.Brother} bind:group={occupantType} />
					Brother
				</label>
				<label>
					<input type="radio" value={OccupantType.Sister} bind:group={occupantType} />
					Sister
				</label>
				<label>
					<input type="radio" value={OccupantType.Couple} bind:group={occupantType} />
					Couple
				</label>
			</div>

			{#if occupantType === OccupantType.Brother || occupantType === OccupantType.Sister}
				<div class="info flex flex-col">
					<input bind:value={singleName} type="text" placeholder="Name" />
					<input bind:value={newVolunteer.phone} type="number" placeholder="Phone" />
					<input bind:value={newVolunteer.email} type="email" placeholder="Email" />
				</div>
			{:else if occupantType === OccupantType.Couple}
				<div class="info flex flex-col">
					<div class="flex">
						<input class="w-35" bind:value={spouse1} type="text" placeholder="Spouse 1" />
						<span class="w-10 text-center flex-end">&</span>
						<input class="w-35" bind:value={spouse2} type="text" placeholder="Spouse 2" />
					</div>
					<input bind:value={newVolunteer.phone} type="number" placeholder="Phone" />
					<input bind:value={newVolunteer.email} type="email" placeholder="Email" />
				</div>
			{/if}

			<Spacer spacing="mt-10" />
			<p class="subheading">2. Project you are assigned to:</p>
			<select bind:value={newVolunteer.project} class="select">
				{#await getProjects() then projects}
					{#each projects as project}
						<option value={project}>{project.friendly_name}</option>
					{/each}
				{/await}
			</select>

			<Spacer spacing="mt-10" />
			<p class="subheading">3. Start and end date:</p>
			<div class="flex justify-center items-center">
				<input class="m-1" type="date" bind:value={newVolunteer.date_start} />
				<Arrow />
				<input class="m-1" type="date" bind:value={newVolunteer.date_end} />
			</div>

			<Spacer spacing="mt-10" />
			<div>
				<input class="mr-2" type="checkbox" bind:checked={hasSpecialNeeds} />
				Any special considerations (allergies, etc.)?

				{#if hasSpecialNeeds}
					<textarea
						class="mt-2 textarea"
						bind:value={newVolunteer.allergies_notes}
						placeholder="add any information that may be useful in matching you to a home"
					></textarea>
				{/if}
			</div>

			<Spacer spacing="mt-20" />
		</form>
		<button
			onclick={() => addVolunteer(newVolunteerName, newVolunteer, occupantType)}
			type="button"
			class="btn btn-success"
			disabled={newVolunteer.date_end === '' ||
				newVolunteer.date_start === '' ||
				occupantType === '' ||
				newVolunteer.project === null ||
				newVolunteerName === '' ||
				newVolunteer.phone === null ||
				newVolunteer.email === ''}
		>
			<Plus />Submit Request</button
		>
	</div>
</div>

<style>
	.title-description {
		font-size: 1.3em;
	}
	.message {
		font-size: 0.95em;
	}
	.message-block {
		border-radius: 8%;
	}
	.subheading {
		font-weight: bold;
	}

	h2 {
		margin-top: -50px;
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
