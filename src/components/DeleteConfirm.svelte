<script lang="ts">
	let {
		deleteFunction,
		id,
		message = 'Are you sure you want to delete this item? This action cannot be undone.'
	} = $props();
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Confirm Delete</h3>
		<p>{message}</p>

		<div class="modal-action">
			<button
				onclick={() => (document.getElementById(id) as HTMLDialogElement)?.close()}
				class="btn">Cancel</button
			>
			<button onclick={deleteFunction} class="btn btn-soft btn-error">Delete</button>
		</div>
	</div>
</dialog>
