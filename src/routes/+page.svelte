<script lang="ts">
	import { auth } from '$lib/firebase/client';
	import { user } from '$lib/stores/auth';
	import { signOut } from 'firebase/auth';

	// this is important to grab the user object from the load function in layout.server
	export let data;

	async function logout() {
		await signOut(auth);
		await fetch('/api/sessionLogout', { method: 'POST' });
	}
</script>

<!-- Navbar -->

<!-- for a split second anything not under this condition will show -->
{#if $user}
	<p>welcome {data.user?.uid}</p>
	<p>{$user?.email}</p>
	<button class="btn" on:click={logout}>Log out</button>
{/if}
