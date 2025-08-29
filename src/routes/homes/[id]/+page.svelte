<script lang="ts">
	import Assignments from '../../../components/Assignments.svelte';
	import HomeEditDrawer from '../../../components/HomeEditDrawer.svelte';
	import ContactList from '../../../components/ContactsList.svelte';
	import Map from '../../../components/Map.svelte';

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
	<HomeEditDrawer {home} />
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
				<label for="my-drawer" class="btn btn-soft btn-primary mb-8">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-5"
					>
						<path
							d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"
						/>
						<path
							d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"
						/>
					</svg>
					Edit Home
				</label>
			{/if}
		</div>
		<Map address="${home.address1} ${home.address2}, ${home.city}, ${home.state} ${home.zip}" />
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

	<h2>Contacts</h2>
	<div class="block contacts">
		<ul class="list bg-base-100 rounded-box shadow-md">
			{#each home.contacts as contact}
				<ContactList {contact} />
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
