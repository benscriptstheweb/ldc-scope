<script lang="ts">
	import Assignments from '../../../components/Assignments.svelte';

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

<div class="home-detail">
	<div class="block address-container">
		{#if home}
			<div>
				<h1 class="header-address">{home.address1} {home.address2}</h1>
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
	<div class="block amenities">
		<h2>Amenities</h2>
		{#each home.amenities as amenity}
			<li>{amenity}</li>
		{/each}
	</div>
</div>

<style>
	.home-detail {
		display: flex;
		flex-direction: column;
	}

	.block {
		margin-bottom: 50px;
	}

	h1 {
		font-size: 1.7em;
		font-weight: bold;
	}

	.secondary-address {
		font-style: italic;
	}

	h2 {
		font-size: 1em;
		font-weight: bold;
	}

	.badge-container {
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
	}

	.volunteers {
		margin: 20px 0 !important;
	}
</style>
