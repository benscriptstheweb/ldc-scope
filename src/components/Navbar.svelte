<script lang="ts">
	import { auth } from '$lib/firebase/client';
	import { signOut } from 'firebase/auth';
	import Stats from '../icons/Stats.svelte';
	import House from '../icons/House.svelte';
	import Persons from '../icons/Persons.svelte';
	import Logout from '../icons/Logout.svelte';

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
			<!-- link to inventory aka home -->
			<li>
				<a href="/">
					<House /><span class="menu-text">Inventory</span>
				</a>
			</li>

			<!-- link to reports -->
			<li>
				<a href="/reports">
					<Stats /><span class="menu-text">Reports</span>
				</a>
			</li>

			<!-- link to volunteers page -->
			<li>
				<a href="/volunteers">
					<div class="indicator">
						<Persons />
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
</style>
