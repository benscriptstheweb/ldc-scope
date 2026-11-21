<script lang="ts">
	import Dots from '../icons/Dots.svelte';

	let { host } = $props();
</script>

<li class="list-row items-center">
	<div>{host.name}</div>
	<div class="contact-btns justify-center content-center items-center">
		<details class="dropdown dropdown-end">
			<summary class="btn btn-ghost btn-xs btn-circle m-1"><Dots /></summary>
			<ul class="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm">
				<li><a href="tel:{host.phone}">Call</a></li>
				<li><a href="sms:{host.phone}">Text</a></li>
				<li><a href="mailto:{host.email}">Email</a></li>
			</ul>
		</details>
	</div>
</li>
{#if host.name_secondary}
	<li class="list-row items-center">
		<div>{host.name_secondary}</div>
		<div class="contact-btns justify-center content-center items-center">
			<details class="dropdown dropdown-end">
				<summary class="btn btn-ghost btn-xs btn-circle m-1"><Dots /></summary>
				<ul class="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm">
					<li><a href="tel:{host.phone_secondary}">Call</a></li>
					<li><a href="sms:{host.phone_secondary}">Text</a></li>
					<li><a href="mailto:{host.email_secondary}">Email</a></li>
				</ul>
			</details>
		</div>
	</li>
{/if}

<style>
	.contact-btns {
		display: flex;
		justify-content: flex-end;
	}
	.contact-btns > a {
		margin-left: 20px;
	}
</style>
