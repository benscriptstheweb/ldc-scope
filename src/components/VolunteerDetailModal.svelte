<script lang="ts">
	let { volunteerDetail, id } = $props();
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		<p class="heading">Volunteer</p>

		<h2>{volunteerDetail.name}</h2>

		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
			</form>
		</div>
	</div>
</dialog>
