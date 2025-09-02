<script lang="ts">
	let { occupantType } = $props();

	function setColors() {
		return occupantType === 'S'
			? 'color: var(--color-secondary); background-color: var(--color-secondary-content)'
			: occupantType === 'B'
				? 'color: var(--color-info-content); background-color: var(--color-info)'
				: occupantType === 'C'
					? 'color: #2d055c; background-color: #ddbfff'
					: 'color: #003632; background-color: #4afff3';
	}
</script>

<div class="custom-badge-type" style={setColors()}>
	{occupantType}
</div>

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
