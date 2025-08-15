<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/client';
	import { onMount } from 'svelte';
	import Navbar from '../components/Navbar.svelte';
	import { page } from '$app/state';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import Loading from '../components/Loading.svelte';

	// this sets a loading spinner to run when navigating between pages. that way we can
	// remove the impression that the app is hanging or frozen.
	export let data;
	let loading = false;
	beforeNavigate(() => {
		loading = true;
	});
	afterNavigate(() => {
		loading = false;
	});

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

{#if loading}
	<Loading />
{:else}
	<div class="body">
		<slot />
	</div>
{/if}

<style>
	:global(.heading) {
		font-size: 1.7em;
		font-weight: bold;
	}
	.body {
		padding-top: 80px;
	}
</style>
