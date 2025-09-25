<script lang="ts">
	import AddHomeForm from '../components/AddHomeForm.svelte';
	import HomeCard from '../components/HomeCard.svelte';
	import Plus from '../icons/Plus.svelte';

	let { data } = $props();
</script>

<AddHomeForm id="add-home-form" />

<div class="header ml-8 mt-8 flex justify-between mr-8">
	<p class="heading">Inventory</p>
	<button
		class="btn btn-soft btn-success"
		onclick={() => (document.getElementById('add-home-form') as HTMLDialogElement).showModal()}
		><Plus />Add Home</button
	>
</div>

<div class="cards-container">
	{#each data.homes as home}
		<HomeCard {home} />
	{/each}
</div>

<style>
	.cards-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		padding: 20px;
	}
</style>
