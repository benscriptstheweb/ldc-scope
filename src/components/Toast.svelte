<script lang="ts">
	import { fade } from 'svelte/transition';

	export let infoText = '';
</script>

<div transition:fade class="toast toast-top toast-center">
	<div class="alert alert-info">
		<span>{infoText}</span>
	</div>
</div>
