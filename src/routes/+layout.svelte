<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/client';
	import { user } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	// unlike the redirect in the +layout.server.ts or the user check in hooks.server.ts files
	// this will move a person to signin if anywhere in the already preloaded pages (client)
	// they hit the logout button
	onMount(() => {
		auth.onAuthStateChanged(async (u) => {
			if (u) {
				user.set(u);
			} else {
				goto('/signin');
			}
		});
	});
</script>

<slot />
