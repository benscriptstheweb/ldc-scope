<script lang="ts">
	import { getHomes } from '$lib/controllers/homes';
	import Loading from '../components/Loading.svelte';
	import HomeCard from '../components/HomeCard.svelte';
</script>

<div class="main-content">
	<div class="home-cards">
		{#await getHomes()}
			<Loading />
		{:then homes}
			{#each homes as home}
				<HomeCard {home} />
			{/each}
		{/await}
	</div>
</div>

<style>
	.main-content {
		z-index: 1;
		display: flex;
		justify-content: center;
	}
</style>
