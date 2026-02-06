<script lang="ts">
	import Paw from '../icons/Paw.svelte';
	let { days = 0, spacer = '', type } = $props();
</script>

{#if type === 'pet'}
	<div class="custom-badge badge badge-secondary {spacer}">
		<strong><Paw /></strong>
	</div>
{:else if type === 'days'}
	<div class="custom-badge badge badge-warning {spacer}">
		<strong>{days}</strong>
	</div>
{/if}

<style>
	.custom-badge {
		border-radius: 25px;
		width: 20px;
	}
</style>
