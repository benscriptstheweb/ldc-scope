<script lang="ts">
	import Assignments from '../../../components/Assignments.svelte';
	import HomeEditDrawer from '../../../components/HomeEditDrawer.svelte';
	import ContactsList from '../../../components/ContactsList.svelte';
	import Map from '../../../components/Map.svelte';
	import ContactsEditDrawer from '../../../components/ContactsEditDrawer.svelte';
	import Edit from '../../../icons/Edit.svelte';
	import RecommendedOccupantBadge from '../../../components/RecommendedOccupantBadge.svelte';

	const { data } = $props();
	const home = data;

	let sortedVolunteers = $state([]);

	if (home.assignments.length) {
		sortedVolunteers = home.assignments.sort((a: any, b: any) => {
			const dateA = new Date(a.date_end);
			const dateB = new Date(b.date_end);
			return dateB.getTime() - dateA.getTime();
		});
	}

	let mapQuery = `${home.address1},+${home.city},+${home.state},+${home.zip}`;
	let mapLink = `geo:0,0?q=${encodeURIComponent(mapQuery)}`;
</script>

{#if data.user.isAdmin}
	<HomeEditDrawer id="edit-home-drawer" {home} />
	<ContactsEditDrawer id="edit-contacts-drawer" {home} />
{/if}

<div class="top-container">
	<div class="address-container">
		{#if home}
			<div class="w-80">
				<a href={mapLink}> Open Central Park </a>

				<p class="heading header-address">{home.address1} {home.address2}</p>
				<p class="secondary-address">{home.city}, {home.state} {home.zip}</p>
			</div>
		{/if}

		<div class="badge-container">
			{#if data.user.isAdmin}
				<label for="edit-home-drawer" class="btn btn-soft btn-primary mb-8">
					<Edit size="size-5" strokeWidth="2" />
					Edit Home
				</label>
			{/if}
		</div>
		<!-- <Map address="${home.address1} ${home.address2}, ${home.city}, ${home.state} ${home.zip}" /> -->
		<p class="mt-2"><strong>Distance to Project</strong>: {home.distanceToProject} miles</p>
	</div>

	<div class="history flex flex-col">
		<div class="w-90 self-center">
			<div class="divider">History</div>
		</div>
		<div class="block volunteers">
			{#if sortedVolunteers.length !== 0}
				<Assignments {sortedVolunteers}></Assignments>
			{:else}
				<p class="message text-center">This home has no assigned volunteers 🪹</p>
			{/if}
		</div>
	</div>

	<div class="self-center card bg-base-300 pt-9 w-90">
		<h2 class="mb-5">Details</h2>
		<div class="block details">
			<div class="detail">
				<strong>Host Congregation: </strong>
				{home.congregation}
			</div>
			<div class="detail">
				<strong>Project: </strong>
				{home.project.friendly_name} - {home.project.id}
			</div>
			<div class="detail">
				<strong>Stay Duration: </strong>
				{home.maxDays} days
			</div>
			<div class="flex detail mt-9">
				<p class="mr-2">Recommended Occupant</p>
				<RecommendedOccupantBadge occupantType={home.occupantType} />
			</div>
			<div class="detail mt-9">
				Homeowner is allergic to:
				<div class="allergies">
					{#if !home.allergies}
						<p class="allergies-none-text">No allergies! 🎣</p>
					{:else}
						{#each home.allergies as allergy}
							<div class="badge badge-outline badge-secondary">{allergy}</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<div class="divider"></div>

		<h2>What This Home Offers</h2>
		<div class="block amenities">
			{#if !home.amenities}
				<p class="amenities-none-text">No amenities listed for this home 🤔</p>
			{:else}
				{#each home.amenities as amenity}
					<div class="badge badge-soft badge-info">{amenity}</div>
				{/each}
			{/if}
		</div>
	</div>

	<div class="contacts flex flex-col items-center">
		<div class="flex justify-between mt-9 w-90">
			<h2>Contacts</h2>
			{#if data.user.isAdmin}
				<label for="edit-contacts-drawer" class="btn btn-soft btn-primary mr-5 mb-4">
					<Edit size="size-5" strokeWidth="2" />
				</label>
			{/if}
		</div>

		<div class="block w-90">
			<ul class="list bg-base-100 rounded-box shadow-md">
				{#each home.contacts as contact}
					<ContactsList {contact} />
				{/each}
			</ul>
		</div>
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
		padding: 0 20px 40px 20px;
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

	.allergies {
		margin-top: 10px;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		height: 150px;
		overflow: scroll;
	}
	.allergies-none-text {
		color: gray;
	}

	.detail {
		font-size: 0.9em;
		padding-left: 10px;
	}

	.badge {
		margin: 5px;
	}

	.divider {
		font-style: italic;
		font-size: small;
		width: 90%;
		margin: 0 auto;
		margin-bottom: 30px;
	}
	.message {
		font-size: 0.9em;
	}
</style>
