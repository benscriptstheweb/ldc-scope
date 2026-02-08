<script lang="ts">
	let { occupantType } = $props();

	function setColors(occupant: string) {
		return occupant === 'S'
			? 'color: var(--color-secondary); background-color: var(--color-secondary-content)'
			: occupant === 'B'
				? 'color: var(--color-info-content); background-color: var(--color-info)'
				: occupant === 'C'
					? 'color: #2d055c; background-color: #ddbfff'
					: 'color: #003632; background-color: #4afff3';
	}
</script>

{#each occupantType as occupant}
	<div class="custom-badge-type" style={setColors(occupant)}>
		{occupant}
	</div>
{/each}

<style>
	.custom-badge-type {
		border-radius: 25px;
		width: 23px;
		height: 23px;
		text-align: center;
		font-weight: bold;
		display: flex;
		justify-content: center;
		text-align: center;
		align-items: center;
	}
</style>
