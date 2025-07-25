<script lang="ts">
	export let data;
	const home = data.home;
</script>

{#if home}
	<h1>{home.address1} {home.address2}</h1>
	<p>{home.city}, {home.state} {home.zip}</p>
	{#if home.hasVolunteer}
		<div class="badge badge-accent">Volunteer Assigned</div>
	{/if}
	<!-- Add more fields as needed -->
{:else}
	<p>Home not found.</p>
{/if}
