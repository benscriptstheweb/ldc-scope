<script lang="ts">
	import Assignments from '../../../components/Assignments.svelte';
	import List from '../../../components/List.svelte';

	export let data;
	const home = data;

	let isCurrentlyOccupied = false;
	const today = Intl.DateTimeFormat('en-CA').format(new Date());

	home.volunteers.forEach((v) => {
		if (today >= v.dateStart && today <= v.dateEnd) {
			isCurrentlyOccupied = true;
		}
	});
</script>

<div class="top-container">
	<div class="address-container">
		{#if home}
			<div>
				<p class="heading header-address">{home.address1} {home.address2}</p>
				<p class="secondary-address">{home.city}, {home.state} {home.zip}</p>
			</div>
		{/if}

		<div class="badge-container">
			{#if isCurrentlyOccupied}
				<div class="badge badge-error">Booked</div>
			{:else}
				<div class="badge badge-success">Available</div>
			{/if}
		</div>
	</div>

	<div class="divider">History</div>
	<div class="block volunteers">
		<Assignments {home}></Assignments>
	</div>

	<div class="divider">Details</div>
	<h2>Amenities</h2>
	<div class="block amenities">
		{#each home.amenities as amenity}
			{#if amenity}
				<div class="badge badge-soft badge-info">{amenity}</div>
			{:else}
				<p class="amenities-none-text">No amenities listed for this home 🤔</p>
			{/if}
		{/each}
	</div>

	<h2>Contacts</h2>
	<div class="block contacts">
		{#each home.contacts as contact}
			<List {contact} />
		{/each}
	</div>
</div>

<style>
	.heading {
		padding-top: 30px;
	}
	.address-container {
		margin: 0 auto;
		margin-bottom: 50px;
	}
	.badge-container {
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
	}
	.top-container {
		display: flex;
		flex-direction: column;
	}
	.block {
		align-items: center;
		padding: 0 20px 50px 20px;
	}

	.secondary-address {
		font-style: italic;
	}

	h2 {
		font-size: 1.2em;
		font-weight: bold;
		padding: 0 30px;
	}
	.amenities {
		margin-top: 10px;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		height: 150px;
		overflow: scroll;
	}
	.amenities-none-text {
		color: gray;
	}

	.badge {
		margin: 5px;
	}

	/* convert to only on phone */
	.divider {
		font-style: italic;
		font-size: small;
		width: 90%;
		margin: 0 auto;
		margin-bottom: 30px;
	}
</style>
