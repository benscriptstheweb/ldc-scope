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
{:else if type === 'unassigned'}
	<div class="custom-badge badge badge-soft badge-secondary">U</div>
{/if}

<style>
	.custom-badge {
		border-radius: 25px;
		width: 20px;
	}
</style>
