<script lang="ts">
	import { fade } from 'svelte/transition';

	export let infoText = '';
	export let alertType = 'info';
	export let verticalPos = 'toast-top';
	export let horizontalPos = 'toast-center';
</script>

<div transition:fade class="toast {verticalPos} {horizontalPos}">
	<div class="alert alert-{alertType}">
		<span>{infoText}</span>
	</div>
</div>
