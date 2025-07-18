<script lang="ts">
	import { auth } from '$lib/firebase';
	import { user } from '$lib/stores/auth';
	import { signOut } from 'firebase/auth';

	async function logout() {
		await signOut(auth);
	}
</script>

<!-- Navbar -->

<!-- for a split second anything not under this condition will show -->
{#if $user}
	<p>{$user?.email}</p>
	<button on:click={logout}>Log out</button>
{/if}
