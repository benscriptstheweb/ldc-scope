<script lang="ts">
	import Assignments from '../../../components/Assignments.svelte';
	import HomeEditDrawer from '../../../components/HomeEditDrawer.svelte';
	import ContactsList from '../../../components/ContactsList.svelte';
	import Map from '../../../components/Map.svelte';
	import ContactsEditDrawer from '../../../components/ContactsEditDrawer.svelte';
	import Edit from '../../../icons/Edit.svelte';

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
</script>

{#if data.user.isAdmin}
	<HomeEditDrawer id="edit-home-drawer" {home} />
	<ContactsEditDrawer id="edit-contacts-drawer" {home} />
{/if}

<div class="top-container">
	<div class="address-container">
		{#if home}
			<div>
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
	</div>

	<div class="divider">History</div>
	<div class="block volunteers">
		{#if sortedVolunteers.length !== 0}
			<Assignments {sortedVolunteers}></Assignments>
		{:else}
			<p class="message text-center">This home has no assigned volunteers 🪹</p>
		{/if}
	</div>

	<div class="divider">Details</div>
	<h2>Amenities</h2>
	<div class="block amenities">
		{#if !home.amenities}
			<p class="amenities-none-text">No amenities listed for this home 🤔</p>
		{:else}
			{#each home.amenities as amenity}
				<div class="badge badge-soft badge-info">{amenity}</div>
			{/each}
		{/if}
	</div>

	<div class="flex justify-between">
		<h2>Contacts</h2>
		{#if data.user.isAdmin}
			<label for="edit-contacts-drawer" class="btn btn-soft btn-primary mr-5 mb-4">
				<Edit size="size-5" strokeWidth="2" />
			</label>
		{/if}
	</div>
	<div class="block contacts">
		<ul class="list bg-base-100 rounded-box shadow-md">
			{#each home.contacts as contact}
				<ContactsList {contact} />
			{/each}
		</ul>
	</div>

	<h2>Host Congregation</h2>
	<div class="congregation">
		{home.congregation}
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
	.congregation {
		padding: 0 30px;
		margin-bottom: 30px;
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
