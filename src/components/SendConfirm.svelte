<script lang="ts">
	import { getParsedDate } from '$lib/helpers/getParsedDate';

	let { modalId, data, assignedHome, hosts, successfullySent = $bindable() } = $props();

	async function sendEmail() {
		if (data.assignedHome) {
			const res = await fetch('/api/send-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: data.name,
					date_start: getParsedDate(data.date_start),
					date_end: getParsedDate(data.date_end),
					projectName: data.project.friendly_name,
					phone: data.phone,
					hostName: hosts.name,
					hostAddress: `${assignedHome.address1}, ${assignedHome.city}, ${assignedHome.state} ${assignedHome.zip}`,
					hostPhone: hosts.phone,
					emails: [hosts.email, data.email]
				})
			});

			const result = await res.json();
			if (result.message === 'Email success') {
				(document.getElementById(modalId) as HTMLDialogElement)?.close();
				successfullySent = true;
				setTimeout(() => {
					successfullySent = false;
				}, 3000);
			}
		} else {
			return;
		}
	}
</script>

<dialog id={modalId} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Confirm Send</h3>
		<p>
			Are you sure you want to send the <i>Host & Occupant Guidelines</i> email to the host,
			<strong>{hosts.name}</strong>, and to the volunteer, <strong>{data.name}</strong>?
		</p>

		<div class="modal-action">
			<button
				onclick={() => (document.getElementById(modalId) as HTMLDialogElement)?.close()}
				class="btn btn-ghost">Cancel</button
			>
			<button onclick={sendEmail} class="btn btn-soft btn-success">Send</button>
		</div>
	</div>
</dialog>
