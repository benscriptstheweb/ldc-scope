<script lang="ts">
	import Spacer from '../../components/Spacer.svelte';
	import Toast from '../../components/Toast.svelte';
	import Arrow from '../../icons/Arrow.svelte';
	import Plus from '../../icons/Plus.svelte';
	import Trash from '../../icons/Trash.svelte';
	import { getProjects } from '$lib/helpers/getProjects';

	let householdType = $state('brother');

	let newVolunteer = $state({
		email: '',
		phone: null,
		project: null,
		date_start: new Date(),
		date_end: new Date()
	});

	const mapping: Record<string, string> = {
		brother: 'B',
		sister: 'S',
		family: 'F',
		couple: 'C'
	};

	let occupantType = $derived(mapping[householdType]);
	let singleName = $state('');

	let spouse1 = $state();
	let spouse2 = $state();
	let coupleName = $derived(`${spouse1} & ${spouse2}`);

	let familyMembers: string[] = $state([]);
	let familyNames = $derived(familyMembers.join(', '));

	let newVolunteerName = $derived.by(() => {
		if (occupantType === 'F') {
			return familyNames;
		} else if (occupantType === 'C') {
			return coupleName;
		} else {
			return singleName;
		}
	});

	let submitted = $state(false);
	async function addVolunteer(name: string, details: any, type: string) {
		const res = await fetch('/api/volunteers', {
			method: 'POST',
			body: JSON.stringify({
				name: name,
				email: details.email,
				phone: details.phone,
				project: details.project,
				date_start: details.date_start,
				date_end: details.date_end,
				type: type
			})
		});

		if (res.ok) {
			submitted = true;
			setTimeout(() => {
				submitted = false;
				window.location.reload();
			}, 7000);
		}
	}
</script>

{#if submitted}
	<Toast infoText={'Your request has been submitted. An agent will contact you shortly.'} />
{/if}

<div class="flex flex-col items-center mb-10">
	<h2 class="heading mb-3">Housing Request Form</h2>
	<div class="form flex flex-col h-full w-80">
		<div class="p-5 bg-base-200 message-block w-65 self-center">
			<p class="message">
				Thank you for volunteering to assist with this LDC project! To request housing accomodations
				during your visit, please provide the following information.
			</p>
			<p class="message">
				<i><strong>Note</strong></i>💡: To fulfill a housing request in the best possible way,
				please submit this form no later than one week before your visit.
			</p>
		</div>
		<Spacer spacing="mt-15" />
		<p class="subheading">1. 👷‍♀️ Basic info:</p>

		<div class="mt-5 mb-5 occupant-type flex justify-between">
			<label>
				<input type="radio" value="brother" bind:group={householdType} />
				Brother
			</label>
			<label>
				<input type="radio" value="sister" bind:group={householdType} />
				Sister
			</label>
			<label>
				<input type="radio" value="couple" bind:group={householdType} />
				Couple
			</label>
			<label>
				<input type="radio" value="family" bind:group={householdType} />
				Family
			</label>
		</div>

		{#if householdType === 'brother' || householdType === 'sister'}
			<div class="info flex flex-col">
				<input bind:value={singleName} type="text" placeholder="Name" />
				<input bind:value={newVolunteer.phone} type="number" placeholder="Phone" />
				<input bind:value={newVolunteer.email} type="email" placeholder="Email" />
			</div>
		{:else if householdType === 'couple'}
			<div class="info flex flex-col">
				<div class="flex">
					<input class="w-35" bind:value={spouse1} type="text" placeholder="Spouse 1" />
					<span class="w-10 text-center flex-end">&</span>
					<input class="w-35" bind:value={spouse2} type="text" placeholder="Spouse 2" />
				</div>
				<input bind:value={newVolunteer.phone} type="number" placeholder="Phone" />
				<input bind:value={newVolunteer.email} type="email" placeholder="Email" />
			</div>
		{:else if householdType === 'family'}
			<div class="info flex flex-col">
				{#each familyMembers as family, idx}
					<div class="flex justify-between items-center">
						<button
							onclick={() => familyMembers.splice(idx, 1)}
							class="btn btn-error btn-soft btn-xs"
						>
							<Trash />
						</button>
						<input
							class="w-70"
							id={`${idx}`}
							type="text"
							bind:value={familyMembers[idx]}
							placeholder={`Member #${idx + 1}`}
						/>
					</div>
				{/each}
				<button class="btn btn-soft btn-success" onclick={() => familyMembers.push('')}
					><Plus /></button
				>
				<input bind:value={newVolunteer.phone} type="number" placeholder="Phone" />
				<input bind:value={newVolunteer.email} type="email" placeholder="Email" />
			</div>
		{/if}

		<Spacer spacing="mt-10" />
		<p class="subheading">2. 📍 Project you are attending:</p>
		<select bind:value={newVolunteer.project} class="select">
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
			<input class="m-1" type="date" bind:value={newVolunteer.date_start} />
			<Arrow />
			<input class="m-1" type="date" bind:value={newVolunteer.date_end} />
		</div>

		<Spacer spacing="mt-10" />
		<button
			onclick={() => addVolunteer(newVolunteerName, newVolunteer, occupantType)}
			class="btn btn-success">Submit Request</button
		>
	</div>
</div>

<style>
	.message {
		font-size: 0.8em;
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
