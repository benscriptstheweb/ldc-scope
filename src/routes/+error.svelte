<script lang="ts">
	import { page } from '$app/state';
	import Tent from '../icons/Tent.svelte';
</script>

<div class="flex flex-col message text-center content-center mt-30">
	<h1 class="mb-5">{page.status}</h1>
	<Tent />
	<p>({page.error?.message})</p>
</div>

<style>
	h1 {
		font-size: 3em;
		font-weight: bold;
	}
</style>
