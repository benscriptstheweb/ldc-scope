<script lang="ts">
	import { auth } from '$lib/firebase/client';
	import { signOut } from 'firebase/auth';

	async function logout() {
		await fetch('/api/sessionLogout', { method: 'POST' });
		await signOut(auth);
	}

	async function getUnassignedCount() {
		const res = await fetch('/api/volunteers');
		const volunteers = await res.json();
		return volunteers.filter((v: any) => v.isAssigned === 0).length;
	}
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex items-center flex-1">
		<img src="/Vari1.png" alt="logo" class="w-12 ml-4" />
	</div>

	<div class="flex-none">
		<ul class="menu menu-horizontal">
			<li>
				<a href="/">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-house-icon lucide-house"
						><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path
							d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
						/></svg
					>
					<span class="menu-text">Inventory</span>
				</a>
			</li>

			<!-- link to volunteers page -->
			<li>
				<a href="/volunteers">
					<div class="indicator">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="22"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-users-icon lucide-users"
							><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path
								d="M16 3.128a4 4 0 0 1 0 7.744"
							/><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg
						>
						<p class="menu-text ml-2">Volunteers</p>
						{#await getUnassignedCount() then count}
							{#if count > 0}
								<span class="badge badge-xs badge-secondary indicator-item">{count}</span>
							{/if}
						{/await}
					</div>
				</a>
			</li>
			<li>
				<button onclick={logout}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-log-out-icon lucide-log-out"
						><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path
							d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
						/></svg
					>
					<p class="menu-text">Logout</p>
				</button>
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
</style>
