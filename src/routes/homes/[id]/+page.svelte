<script lang="ts">
	export let data;
	const home = data.home;
</script>

{#if home}
	<h1 class="header-address">{home.address1} {home.address2}</h1>
	<p class="secondary-address">{home.city}, {home.state} {home.zip}</p>
	{#if home.hasVolunteer}
		<div class="badge badge-accent">Volunteer Assigned</div>
	{/if}
	<!-- Add more fields as needed -->
{:else}
	<h1>404</h1>
	<p class="not-found">Home not found</p>
{/if}

<style>
	h1 {
		font-size: 1.7em;
		font-weight: bold;
	}

	.secondary-address {
		font-style: italic;
	}
</style>
