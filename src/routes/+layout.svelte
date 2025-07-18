<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { user } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { getSignedInUser } from '$lib/controllers/users';

	onMount(() => {
		auth.onAuthStateChanged(async (u) => {
			if (u) {
				user.set(u);
				console.log(await getSignedInUser(u));
			} else {
				goto('/signin');
			}
		});
	});
</script>

<slot />
