<script>
	import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';

	const login = async () => {
		const auth = getAuth();
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const idToken = await userCredential.user.getIdToken();

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

<div class="center-container">
	<div class="login-card">
		<h1 class="welcome-sign">Welcome home</h1>
		<form on:submit|preventDefault={login}>
			<div class="login-card-input">
				<input class="input" type="text" bind:value={email} />
			</div>
			<div class="login-card-input">
				<input class="input" type="password" bind:value={password} />
			</div>
			<button class="btn btn-sm btn-primary" type="submit">Login</button>
			<button class="btn btn-sm">Request Account</button>
		</form>
	</div>
</div>

<style>
	.welcome-sign {
		font-size: 30px;
	}

	.center-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}

	.login-card {
		margin: 10px;
	}
	.login-card-input {
		margin: 10px 0;
	}

	.btn {
		float: right;
	}
</style>
