<script lang="ts">
	import Mail from '../icons/Mail.svelte';
	import Phone from '../icons/Phone.svelte';

	let { contact } = $props();
</script>

<li class="list-row items-center">
	<div>{contact.name}</div>
	<div class="contact-btns justify-center content-center items-center">
		<a href="tel:{contact.phone}" aria-label="telephone">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-phone-call-icon lucide-phone-call"
				><path d="M13 2a9 9 0 0 1 9 9" /><path d="M13 6a5 5 0 0 1 5 5" /><path
					d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
				/></svg
			>
		</a>

		<a href="mailto:{contact.email}" aria-label="email">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-mail-plus-icon lucide-mail-plus"
				><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" /><path
					d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
				/><path d="M19 16v6" /><path d="M16 19h6" /></svg
			>
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
