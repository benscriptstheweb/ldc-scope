<script lang="ts">
	import Mail from '../icons/Mail.svelte';
	import Phone from '../icons/Phone.svelte';

	let { contact } = $props();
</script>

<li class="list-row items-center">
	<div>{contact.name}</div>
	<div class="contact-btns justify-center content-center items-center">
		<a href="tel:{contact.phone}" aria-label="telephone">
			<Phone />
		</a>

		<a href="mailto:{contact.email}" aria-label="email">
			<Mail />
		</a>
	</div>
</li>

<style>
	.contact-btns {
		display: flex;
		justify-content: flex-end;
	}
	.contact-btns > a {
		margin-left: 30px;
	}
</style>
