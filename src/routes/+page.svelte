<script lang="ts">
	import { auth } from '$lib/firebase/client';
	import { user } from '$lib/stores/auth';
	import { signOut, type User } from 'firebase/auth';
	import { getSignedInUser } from '$lib/controllers/users.js';
	import { onMount } from 'svelte';

	async function logout() {
		await signOut(auth);

		// clear session cookies
		await fetch('/api/sessionLogout', { method: 'POST' });
	}

	let currentUser: any;
	let currentUserName = '';

	let isLoading = true;

	onMount(async () => {
		currentUser = await getSignedInUser($user);
		currentUserName = currentUser.name;
		isLoading = false;
	});
</script>

{#if isLoading}
	<div class="spinner">
		<span class="loading loading-spinner loading-xl"></span>
	</div>
{:else if $user && currentUser}
	<div class="container">
		<h1>Inventory</h1>
		<!-- <p>{currentUserName}</p> -->
		<div class="logout-btn">
			<button class="btn" on:click={logout}>Log out</button>
		</div>
	</div>
{/if}

<style>
	.spinner {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		width: 100vw;
	}
	.container {
		display: flex;
		justify-content: space-between;
		padding: 20px;
	}

	h1 {
		font-size: 30px;
	}
	.logout-btn {
		position: relative;
	}
</style>
