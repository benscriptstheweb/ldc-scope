<script lang="ts">
	import HomeCard from '../components/HomeCard.svelte';

	export let data;
</script>

<p class="heading">Inventory</p>

{#each data.homes as home}
	<HomeCard {home} />
{/each}
