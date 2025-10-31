<script lang="ts">
	import { auth } from '$lib/firebase/client';
	import { signOut } from 'firebase/auth';
	import House from '../icons/House.svelte';
	import Volunteers from '../icons/Volunteers.svelte';
	import Logout from '../icons/Logout.svelte';
	import { page } from '$app/state';

	let { userData } = $props();

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
		<span class="badge badge-outline ml-5">
			Region {userData.assignedRegion}
		</span>
	</div>

	<div class="flex-none">
		<ul class="menu menu-horizontal">
			<li>
				<a href="/">
					<House active={page.url.pathname === '/' || page.url.pathname.startsWith('/homes')} />
					<span class="menu-text">Inventory</span>
				</a>
			</li>

			<!-- link to volunteers page -->
			<li>
				<a href="/volunteers">
					<div class="indicator">
						<Volunteers active={page.url.pathname.startsWith('/volunteers')} />
						<p class="menu-text ml-2">Volunteers</p>
						{#await getUnassignedCount() then count}
							<span class="badge badge-xs badge-secondary indicator-item">{count}</span>
						{/await}
					</div>
				</a>
			</li>
			<li>
				<button onclick={logout}>
					<Logout />
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
	.title {
		margin-left: 10px;
	}
	.user-privilege {
		margin-left: 4px;
	}
</style>
