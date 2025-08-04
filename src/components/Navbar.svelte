<script lang="ts">
	import { auth } from '$lib/firebase/client';
	import { signOut } from 'firebase/auth';

	export let userData;

	async function logout() {
		await fetch('/api/sessionLogout', { method: 'POST' });
		await signOut(auth);
	}
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a href="/">
			<img width="61px" src="/Vari1.png" alt="The Purple House" class="title" />
		</a>
	</div>

	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li>
				<a href="/">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
						/>
					</svg>
					<span class="menu-text">Inventory</span>
				</a>
			</li>

			<!-- link to volunteers page -->
			<li>
				<a href="/" class="button-disabled">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
						/>
					</svg>
					<span class="menu-text">Volunteers</span>
				</a>
			</li>
			<li>
				<details>
					<summary>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
						<span class="menu-text">Account</span>
					</summary>

					<ul class="bg-base-100 rounded-t-none p-2">
						<li><button on:click={logout}>Logout</button></li>
						<li class="menu-disabled"><button>Settings</button></li>
						<div class="divider"></div>
						<div class="user-privilege">
							{#if userData.isAdmin}
								<span class="badge badge-soft badge-success">Admin</span>
							{:else}
								<span class="badge badge-soft badge-info">Agent</span>
							{/if}
						</div>
					</ul>
				</details>
			</li>
		</ul>
	</div>
</div>

<style>
	.navbar {
		display: flex;
		align-items: center;
		position: fixed;
		z-index: 98;
	}

	.menu-text {
		display: none;
	}
	@media (min-width: 768px) and (max-width: 1024px) {
		.menu-text {
			display: inline;
		}
	}
	@media (min-width: 1025px) {
		.menu-text {
			display: inline;
		}
	}

	@media (max-width: 766px) {
		ul.bg-base-100 {
			margin-left: -20px;
		}
	}
	ul.bg-base-100 {
		z-index: 100;
	}

	.button-disabled {
		color: #584955; /* Darker text color */
		cursor: not-allowed; /* Changes cursor to a "not allowed" symbol */
		opacity: 0.7; /* Reduces opacity to visually indicate disabled state */
		pointer-events: none; /* Prevents click events on the button */
	}

	.title {
		margin-left: 10px;
	}
	.user-privilege {
		margin-left: 4px;
	}
</style>
