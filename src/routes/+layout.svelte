<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/client';
	import { onMount } from 'svelte';
	import Navbar from '../components/Navbar.svelte';
	import { page } from '$app/state';
	export let data;

	// unlike the redirect in the +layout.server.ts or the user check in hooks.server.ts files
	// this will move a person to signin if anywhere in the already preloaded pages (client)
	// they hit the logout button
	onMount(() => {
		auth.onAuthStateChanged(async (u) => {
			if (!u) {
				goto('/signin');
			}
		});
	});
</script>

{#if page.url.pathname !== '/signin'}
	<Navbar userData={data.user} />
{/if}

<div class="main-content">
	<slot />
</div>

<style>
	.main-content {
		display: flex;
		justify-content: center;
		z-index: 1;
		padding: 1.7rem;
	}

	:global(.heading) {
		font-size: 1.7em;
		font-weight: bold;
	}
</style>
