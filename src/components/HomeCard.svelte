<script lang="ts">
	import { goto } from '$app/navigation';

	export let home: any;

	const colArr = ['#87799F', '#FFB88C', '#5B9F82', '#FFADC7'];
	const color = colArr[Math.floor(Math.random() * colArr.length)];

	function visitHome() {
		goto(`/homes/${home.id}`);
	}
</script>

<div class="card-boundary">
	<button
		type="button"
		class="card card-side bg-base-100 shadow-sm"
		on:click={visitHome}
		style="width: 100%; text-align: left; padding: 0; border: none; background: none;"
	>
		<figure>
			<div class="color-block" style="background-color: {color};"></div>
		</figure>
		<div class="card-body">
			<h2 class="card-title">{home.address1} {home.address2}</h2>
			{#if home.hasVolunteer}
				<div class="badge badge-accent">Volunteer Assigned</div>
			{/if}
			<p class="half-address">{home.city}, {home.state} {home.zip}</p>
			<div class="card-actions justify-end">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-4.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
					/>
				</svg>
				<p style="font-weight: 600">Host: <span>{home.primaryContact}</span></p>
			</div>
		</div>
	</button>
</div>

<style>
	.card-boundary {
		padding: 10px;
	}

	button {
		cursor: pointer;
	}

	.color-block {
		width: 50px;
	}

	.half-address {
		font-style: italic;
	}
</style>
