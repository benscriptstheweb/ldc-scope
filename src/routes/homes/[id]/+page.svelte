<script lang="ts">
	export let data;
	const home = data.home;
</script>

<div class="address-container">
	{#if home}
		<h1 class="header-address">{home.address1} {home.address2}</h1>
		<div>
			<p class="secondary-address">{home.city}, {home.state} {home.zip}</p>
		</div>
		{#if home.hasVolunteer}
			<div class="badge badge-accent">Volunteer Assigned</div>
		{/if}
	{:else}
		<h1>404</h1>
		<p class="not-found">Home not found</p>
	{/if}
</div>

<style>
	h1 {
		font-size: 1.7em;
		font-weight: bold;
	}

	.secondary-address {
		font-style: italic;
	}
</style>
