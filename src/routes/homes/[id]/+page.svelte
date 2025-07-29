<script lang="ts">
	import Calendar from '../../../components/Calendar.svelte';

	export let data;
	const home = data;

	let selectedDateStart: string;
	let selectedDateEnd: string;

	// $: console.log(dateStart);
	function handleVolunteerSelect(event: Event) {
		console.log(home.volunteers);

		const select = event.target as HTMLSelectElement;
		const selectedVolunteer = home.volunteers.find((v) => v.name === select.value);
		if (selectedVolunteer) {
			selectedDateStart = selectedVolunteer.dateStart;
			selectedDateEnd = selectedVolunteer.dateEnd;
		}
	}
</script>

<div class="home-detail">
	<div class="block address-container">
		{#if home}
			<h1 class="header-address">{home.address1} {home.address2}</h1>
			<div>
				<p class="secondary-address">{home.city}, {home.state} {home.zip}</p>
			</div>
			<!-- {#if home.hasVolunteer}
				<div class="badge badge-accent">Volunteer Assigned</div>
			{/if} -->
		{:else}
			<h1>404</h1>
			<p class="not-found">Home not found</p>
		{/if}
	</div>

	<div class="block amenities">
		<h1>Amenities</h1>
		{#each home.amenities as amenity}
			<ul>
				- {amenity}
			</ul>
		{/each}
	</div>

	<div class="block amenities">
		<h1>Volunteers</h1>

		<select class="select select-ghost" on:change={handleVolunteerSelect}>
			<option disabled selected>Pick a volunteer</option>
			{#each home.volunteers as { name }}
				<option>
					{name}
				</option>
			{/each}
		</select>
		<Calendar dateStart={selectedDateStart} dateEnd={selectedDateEnd}></Calendar>
	</div>
</div>

<style>
	.home-detail {
		display: flex;
		flex-direction: column;
	}

	h1 {
		font-size: 1.7em;
		font-weight: bold;
	}

	.secondary-address {
		font-style: italic;
	}

	.block {
		margin-bottom: 50px;
	}
</style>
