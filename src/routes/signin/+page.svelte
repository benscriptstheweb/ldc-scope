<script>
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { user } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	const login = async () => {
		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				email = '';
				password = '';
				user.set(auth.currentUser);
			})
			.then(() => {
				goto('/');
			})
			.catch((error) => {
				console.error('Error during login:', error);
			});
	};
</script>

<h1>Login</h1>

<form on:submit|preventDefault={login}>
	<input type="text" bind:value={email} />
	<input type="password" bind:value={password} />
	<button type="submit">logon</button>
</form>
