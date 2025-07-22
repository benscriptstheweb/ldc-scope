<script>
	import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import Toast from '../../components/Toast.svelte';

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

	let isInfoRequested = false;
	const showInfoRequestToast = () => {
		isInfoRequested = true;
		setTimeout(() => {
			isInfoRequested = false;
		}, 3000);
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
			<button class="btn btn-sm" on:click|preventDefault={showInfoRequestToast}
				>Request Account</button
			>
		</form>
	</div>

	{#if isInfoRequested}
		<Toast infoText={'Please request an account through your project oveseer.'} />
	{/if}
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
