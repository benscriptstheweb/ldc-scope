<script lang="ts">
	import HomeCard from '../components/HomeCard.svelte';

	export let data;
</script>

<p class="heading">Inventory</p>

<div class="cards-container">
	{#each data.homes as home}
		<HomeCard {home} />
	{/each}
</div>

<style>
	.heading {
		padding: 30px 0 0 30px;
	}
	.cards-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		padding: 20px;
	}
</style>
