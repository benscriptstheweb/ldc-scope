<script lang="ts">
	import Toast from '../../../components/Toast.svelte';
	import Arrow from '../../../icons/Arrow.svelte';

	let { form } = $props();
	let isWrongPass = $state(false);

	if (form?.error) {
		isWrongPass = true;
		setTimeout(() => {
			isWrongPass = false;
		}, 3000);
	}
</script>

<div class="container flex flex-col items-center">
	<h2 class="header-text mb-10">Enter Survey</h2>
	<form method="POST" action="?/unlock">
		<div class="join">
			<input class="input" type="password" name="password" placeholder="Password" required />
			<button class="btn btn-primary" type="submit">
				<Arrow />
			</button>
		</div>
	</form>
</div>

{#if isWrongPass}
	<Toast infoText={'Wrong Password'} alertType={'alert-error'} />
{/if}

<style>
	.header-text {
		font-size: 20px;
		font-weight: bold;
	}
	input {
		border: none;
		border-bottom: 1px solid rgba(110, 109, 112, 0.589);
		box-shadow: none;
		outline: none;
		padding: 5px;
		margin-bottom: 15px;
		font-size: 1em;
	}
	input:focus {
		border: none;
		border-bottom: 1px solid white;
		outline: none;
	}
</style>
