<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/client';
	import { onMount } from 'svelte';
	import Navbar from '../components/Navbar.svelte';
	import { page } from '$app/state';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import Loading from '../components/Loading.svelte';

	let { data, children } = $props();

	// this sets a loading spinner to run when navigating between pages. that way we can
	// remove the impression that the app is hanging or frozen.
	let loading = $state(false);
	beforeNavigate(() => {
		loading = true;
	});
	afterNavigate(() => {
		loading = false;
	});

	const publicRoutes = ['/signin', '/survey', '/survey/pass'];

	onMount(() => {
		auth.onAuthStateChanged(async (u) => {
			if (!u && !publicRoutes.includes(page.url.pathname)) {
				goto('/signin');
			}
		});
	});
</script>

{#if !publicRoutes.includes(page.url.pathname)}
	<Navbar userData={data.user} />
{/if}

{#if loading}
	<Loading />
{:else}
	<div class="body">
		{@render children()}
	</div>
{/if}

<style>
	:global(.heading) {
		font-size: 1.7em;
		font-weight: bold;
	}
	.body {
		padding-top: 70px;
	}
</style>
