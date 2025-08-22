<script lang="ts">
	export let form;
</script>

<h1>Enter Survey Password</h1>

<form method="POST" action="?/unlock">
	<input type="password" name="password" placeholder="Password" required />
	<button type="submit">Unlock</button>
</form>

{#if form?.error}
	<p style="color:red">{form.error}</p>
{/if}
