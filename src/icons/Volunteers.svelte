<script lang="ts">
	let { active } = $props();
</script>

<svg width="23" height="23" viewBox="0 0 346 319" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		class="light"
		class:active
		d="M97.3247 106.56L16.7985 277.478C8.98609 294.06 21.0839 313.133 39.4142 313.133H205.347C223.929 313.133 236.016 293.581 227.71 276.958L142.304 106.041C132.973 87.3683 106.221 87.6774 97.3247 106.56Z"
		fill="#D9D9D9"
	/>
	<path
		class="dark"
		class:active
		d="M197.411 105.229L116.341 283.036C108.793 299.591 120.893 318.408 139.088 318.408H306.141C324.581 318.408 336.676 299.125 328.648 282.524L242.664 104.716C233.448 85.6571 206.193 85.9656 197.411 105.229Z"
		fill="#B4B4B4"
	/>
	<circle class="dark" class:active cx="122.893" cy="62.7652" r="62.7652" fill="#B4B4B4" />
	<circle class="light" class:active cx="223.107" cy="62.7652" r="62.7652" fill="#D9D9D9" />
</svg>

<style>
	.light {
		fill: #d9d9d9;
	}
	.dark {
		fill: #b4b4b4;
	}

	.light.active {
		fill: rgb(210, 96, 145) !important;
	}

	.dark.active {
		fill: rgb(160, 64, 98);
	}
</style>
