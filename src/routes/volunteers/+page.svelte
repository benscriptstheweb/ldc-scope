<script lang="ts">
	import Plus from '../../icons/Plus.svelte';
	import { goto } from '$app/navigation';
	import Toast from '../../components/Toast.svelte';

	let { data } = $props();
	const volunteers = data.volunteers;

	async function openVolunteerPage(volunteer: any) {
		goto(`/volunteers/${volunteer.id}`);
	}

	let isLinkCopied = $state(false);

	async function copySurveyLink() {
		isLinkCopied = true;
		setTimeout(() => {
			isLinkCopied = false;
		}, 3000);
		await navigator.clipboard.writeText('https://ldc-scope.vercel.app/survey');
	}
</script>

{#if isLinkCopied}
	<Toast
		infoText="Link copied to clipboard!"
		verticalPos="toast-bottom"
		alertType="alert-success"
	/>
{/if}

<div class="add-btn-container">
	<p class="heading">Volunteers</p>
	<button onclick={copySurveyLink} class="btn btn-success">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="3"
			stroke="currentColor"
			class="size-4"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
			/>
		</svg>

		Survey Link
	</button>
</div>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Name</th>
				<th>Project</th>
				<th>Stay</th>
			</tr>
		</thead>

		<tbody>
			{#each volunteers as volunteer}
				<tr class="volunteer-rows" onclick={() => openVolunteerPage(volunteer)}>
					<td class="name">
						<label for="volunteer-drawer" class="drawer-button">
							{volunteer.name}
						</label>
					</td>
					<td class="project-region">
						<div class="badge badge-soft badge-accent">
							{volunteer.assignedProject.friendly_name}
						</div>
					</td>
					{#if volunteer.assignedHome !== null}
						<td class="stay">{volunteer.assignedHome.address1}</td>
					{:else}
						<td class="stay">
							<button class="btn btn-outline btn-primary btn-xs btn-circle">
								<label for="volunteer-drawer" class="drawer-button">
									<Plus />
								</label>
							</button>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.add-btn-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30px;
	}
	tr:hover {
		background-color: var(--color-base-300);
		cursor: pointer;
	}
</style>
