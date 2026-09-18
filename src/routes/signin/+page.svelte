<script lang="ts">
	import {
		createUserWithEmailAndPassword,
		getAuth,
		signInWithEmailAndPassword
	} from 'firebase/auth';
	import { goto } from '$app/navigation';
	import Toast from '../../components/Toast.svelte';
	import Eye from '../../icons/Eye.svelte';

	let email = $state('');
	let password = $state('');
	let makePassVisible = $state(false);

	let isWrongPassword = $state(false);
	let isAccountCreated = $state(false);
	let accountExists = $state(false);
	let fieldsEmpty = $state(false);

	const auth = getAuth();

	let agentName = $state('');

	async function createAccount() {
		if (email === '' || password === '' || agentName === '') {
			fieldsEmpty = true;
			setTimeout(() => {
				fieldsEmpty = false;
			}, 3000);

			return;
		}

		// adds to the supabase public db
		const res = await fetch(`/api/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				full_name: agentName,
				email: email
			})
		});

		if (res.ok) {
			// adds to the fb list
			createUserWithEmailAndPassword(auth, email, password)
				.then(() => {
					isAccountCreated = true;
					email = '';
					agentName = '';
					password = '';
					setTimeout(() => {
						isAccountCreated = false;
					}, 5000);
				})
				.catch((e) => {
					if (e.code === 'auth/email-already-in-use') {
						accountExists = true;
						setTimeout(() => {
							accountExists = false;
						}, 3000);
					}
				});
		}
	}

	async function login() {
		if (email === '' || password === '') {
			return;
		}

		await signInWithEmailAndPassword(auth, email, password)
			.then(async (credentials) => {
				const idToken = await credentials.user.getIdToken();
				const res = await fetch('/api/sessionLogin', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ idToken })
				});

				if (res.ok) {
					goto('/');
				}
			})
			.catch(() => {
				isWrongPassword = true;
				setTimeout(() => {
					isWrongPassword = false;
				}, 3000);
			});
	}

	let isCreatingAccount = $state(false);
</script>

{#if isAccountCreated}
	<Toast
		infoText={'Account created! Please allow some time for your account to be approved'}
		alertType={'alert-success'}
	/>
{/if}
{#if accountExists}
	<Toast infoText={'Email already in use'} alertType={'alert-error'} />
{/if}

{#if isWrongPassword}
	<Toast infoText={'Wrong credentials. Please try again'} alertType={'alert-error'} />
{/if}
{#if fieldsEmpty}
	<Toast infoText={'Please fill out all fields, then click Create!'} alertType={'alert-error'} />
{/if}

<div class="center-container">
	<div class="logo">
		<img width="120px" src="/Main.png" alt="logo" />
	</div>
	<div class="login-card">
		<h1 class="welcome-sign mb-2">Welcome home</h1>
		<form onsubmit={(e) => e.preventDefault()}>
			<div class="mb-5 flex flex-col">
				{#if isCreatingAccount}
					<input
						required
						class="input mb-2"
						type="text"
						bind:value={agentName}
						placeholder="full name"
					/>
				{/if}
				<input
					required
					class="input mb-2"
					type="text"
					bind:value={email}
					placeholder="email"
					autocomplete="username"
				/>
				<div class="relative">
					<input
						required
						class="input join-item"
						type={makePassVisible ? 'text' : 'password'}
						bind:value={password}
						placeholder="password"
						autocomplete="current-password"
					/>
					<span
						class="absolute view-pass-text"
						tabindex={-1}
						role="button"
						onkeydown={(e) => e.preventDefault()}
						onclick={(e) => {
							e.preventDefault();
							makePassVisible = !makePassVisible;
						}}
					>
						<Eye style={makePassVisible ? 'closed' : 'open'} />
					</span>
				</div>

				{#if !isCreatingAccount}
					<div>
						<button
							class="btn btn-ghost mt-2"
							type="button"
							onclick={(e) => {
								e.preventDefault();
								isCreatingAccount = true;
							}}>Create Account</button
						>
						<button class="btn btn-soft btn-primary mt-2" type="submit" onclick={login}
							>Login</button
						>
					</div>
				{:else}
					<div>
						<button
							class="btn btn-ghost mt-2"
							type="button"
							onclick={(e) => {
								e.preventDefault();
								isCreatingAccount = false;
							}}>Cancel</button
						>
						<button
							class="btn btn-soft btn-primary mt-2"
							type="submit"
							onclick={(e) => {
								e.preventDefault();
								createAccount();
							}}>Create</button
						>
					</div>
				{/if}
			</div>
		</form>
	</div>
</div>

<style>
	.view-pass-text {
		right: 5%;
		top: 25%;
	}

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
