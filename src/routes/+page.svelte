<script lang="ts">
	import { user } from '$lib/stores/auth';
	import Navbar from '../components/Navbar.svelte';

	export let data;
</script>

{#if $user}
	<Navbar userData={data.user} firebaseUserData={$user} />
{/if}
