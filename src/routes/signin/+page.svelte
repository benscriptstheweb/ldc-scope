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
	<div class="logo">
		<img width="120px" src="/Main.png" alt="logo" />
	</div>
	<div class="login-card">
		<h1 class="welcome-sign mb-2">Welcome home</h1>
		<div class="mb-5 flex flex-col">
			<input class="input mb-2" type="text" bind:value={email} placeholder="username" />
			<input class="input" type="password" bind:value={password} placeholder="password" />
		</div>
		<button class="btn btn-soft btn-primary mr-2" type="submit" onclick={login}>Login</button>
		<button class="btn btn-ghost" onclick={showInfoRequestToast}>Request Account</button>
	</div>

	{#if isInfoRequested}
		<Toast infoText={'Please request an account through your project oveseer.'} />
	{/if}
</div>

<style>
	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30px;
	}

	.center-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 90vh;
		margin-top: -80px; /* to combat the global margin for the sticky nav*/
	}
	.welcome-sign {
		display: none;
	}
	@media (min-width: 768px) and (max-width: 1024px) {
		.logo {
			margin-bottom: 30px;
		}
	}
	@media (min-width: 1025px) {
		.center-container {
			flex-direction: row;
		}
		.welcome-sign {
			display: block;
			font-size: 20px;
		}
		.logo {
			margin-right: 50px;
		}
	}
</style>
