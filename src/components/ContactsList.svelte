<script lang="ts">
	import Email from '../icons/Email.svelte';
	import Telephone from '../icons/Telephone.svelte';

	let { host } = $props();
</script>

<li class="list-row items-center">
	<div>{host.name}</div>
	<div class="contact-btns justify-center content-center items-center">
		<a href="tel:{host.phone}" aria-label="telephone">
			<Telephone />
		</a>

		<a href="mailto:{host.email}" aria-label="email">
			<Email />
		</a>
	</div>
</li>
{#if host.name_secondary}
	<li class="list-row items-center">
		<div>{host.name_secondary}</div>
		<div class="contact-btns justify-center content-center items-center">
			<a href="tel:{host.phone_secondary}" aria-label="telephone">
				<Telephone />
			</a>

			<a href="mailto:{host.email_secondary}" aria-label="email">
				<Email />
			</a>
		</div>
	</li>
{/if}

<style>
	.contact-btns {
		display: flex;
		justify-content: flex-end;
	}
	.contact-btns > a {
		margin-left: 30px;
	}
</style>
