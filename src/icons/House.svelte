<script lang="ts">
	let { active } = $props();
</script>

<svg width="23" height="23" viewBox="0 0 362 352" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		class="light"
		class:active
		d="M3.50487e-06 165L164.158 15.3534C173.701 6.65391 188.299 6.65391 197.842 15.3534L362 165L362 327C362 340.807 350.807 352 337 352H25C11.1929 352 2.09784e-07 340.807 4.68566e-07 327L3.50487e-06 165Z"
	/>
	<path class="dark" class:active d="M52 237H138V308H77C63.1929 308 52 296.807 52 283V237Z" />
	<path class="dark" class:active d="M224 237H310V283C310 296.807 298.807 308 285 308H224V237Z" />
	<path
		class="dark"
		class:active
		d="M138 191C138 177.193 149.193 166 163 166H199C212.807 166 224 177.193 224 191V237H138V191Z"
	/>
</svg>

<style>
	.light {
		fill: #d9d9d9;
	}
	.dark {
		fill: #b4b4b4;
	}

	.light.active {
		fill: rgb(125, 180, 70) !important;
	}

	.dark.active {
		fill: rgb(81, 121, 57);
	}
</style>
