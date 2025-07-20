<script>
	import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';

	const login = async () => {
		const auth = getAuth();
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const idToken = await userCredential.user.getIdToken();

		// Send to server to create session cookie
		const res = await fetch('/api/sessionLogin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ idToken })
		});

		if (res.ok) {
			goto('/');
		} else {
			alert('Login failed');
		}
	};
</script>

<h1>Login</h1>

<form on:submit|preventDefault={login}>
	<input type="text" bind:value={email} />
	<input type="password" bind:value={password} />
	<button type="submit">logon</button>
</form>
