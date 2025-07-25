<script lang="ts">
	import { user } from '$lib/stores/auth';
	import Navbar from '../components/Navbar.svelte';
	import { getHomes } from '$lib/controllers/homes';
	import Loading from '../components/Loading.svelte';
	import HomeCard from '../components/HomeCard.svelte';

	export let data;
</script>

{#if $user}
	<Navbar userData={data.user} />

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
{/if}

<style>
	.main-content {
		z-index: 1;
		display: flex;
		justify-content: center;
	}
</style>
