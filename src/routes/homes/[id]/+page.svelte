<script lang="ts">
	import Assignments from '../../../components/Assignments.svelte';
	import HomeEditDrawer from '../../../components/HomeEditDrawer.svelte';
	import ContactsList from '../../../components/ContactsList.svelte';
	import ContactsEditDrawer from '../../../components/ContactsEditDrawer.svelte';
	import Edit from '../../../icons/Edit.svelte';
	import RecommendedOccupantBadge from '../../../components/RecommendedOccupantBadge.svelte';
	import ParkingStructure from '../../../icons/ParkingStructure.svelte';
	import ParkingStreet from '../../../icons/ParkingStreet.svelte';
	import { onMount } from 'svelte';
	import { getParsedDate } from '$lib/helpers/getParsedDate';
	import CustomBadge from '../../../components/CustomBadge.svelte';
	import Van from '../../../icons/Van.svelte';
	import Trash from '../../../icons/Trash.svelte';
	import Dots from '../../../icons/Dots.svelte';
	import Comment from '../../../icons/Comment.svelte';
	import Comments from '../../../components/Comments.svelte';

	const { data } = $props();
	const home = data;

	const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

	let mapQuery = encodeURIComponent(`${home.address1},+${home.city},+${home.state}+${home.zip}`);
	let mapLink = isIOS
		? `maps://?q=${mapQuery}`
		: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

	let photoUrls = $state({ urls: [] });

	onMount(async () => {
		const res = await fetch(`/api/homes/${home.id}/photos`);
		photoUrls = await res.json();
	});

	// TODO: do this in the backend like comments
	let sortedVolunteers = $state([]);
	if (home.assignments.length) {
		sortedVolunteers = home.assignments.sort((a: any, b: any) => {
			const dateA = new Date(a.date_range[1]);
			const dateB = new Date(b.date_range[1]);
			return dateB.getTime() - dateA.getTime();
		});
	}

	let newComment = $state(false);
	let commentText = $state('');

	async function postComment(text: string) {
		const res = await fetch(`/api/comments?homeId=${home.id}`, {
			method: 'POST',
			body: JSON.stringify({ text, user: data.user.email })
		});

		if (res.ok) {
			window.location.reload();
		}
	}

	async function deleteComment(commentId: string) {
		const res = await fetch(`/api/comments?commentId=${commentId}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			window.location.reload();
		}
	}
</script>

{#if data.user.isAdmin}
	<HomeEditDrawer id="edit-home-drawer" {home} {photoUrls} />
	<ContactsEditDrawer id="edit-contacts-drawer" {home} />
{/if}

<div class="top-container">
	<div class="flex flex-col items-center address-container">
		<div class="flex carousel carousel-center">
			{#each photoUrls.urls as url}
				<div class="flex carousel-item">
					<img src={url} alt="home" class="h-60" />
				</div>
			{/each}
		</div>

		<div class="w-80 flex items-center justify-between">
			<div class="mb-8">
				<p class="heading header-address">{home.address1} {home.address2}</p>
				<p>{home.city}, {home.state} {home.zip}</p>
			</div>
			<a href={mapLink}>
				<img class="map-pin" src="/pin.png" width="70px" alt="open-in-map" />
			</a>
		</div>

		{#if data.user.isAdmin}
			<label for="edit-home-drawer" class="btn btn-soft btn-primary">
				<Edit />
				Edit Home
			</label>
		{/if}

		{#if home.blackout_dates}
			<div class="badge badge-error badge-xl">
				<strong>
					Blackout: {getParsedDate(home.blackout_dates[0])} - {getParsedDate(
						home.blackout_dates[1]
					)}
				</strong>
			</div>
		{/if}
	</div>

	<div class="history flex flex-col">
		<div class="w-90 self-center">
			<div class="divider">History</div>
		</div>
		<div class="block volunteers">
			{#if home.assignments.length !== 0}
				<Assignments {sortedVolunteers}></Assignments>
			{:else}
				<p class="message text-center">This home has no assigned volunteers 🪹</p>
			{/if}
		</div>
	</div>

	<div class="self-center card bg-base-300 pt-9 w-90">
		<div class="flex items-center justify-between mr-8 mb-8">
			<h2>Details</h2>

			<div class="detail flex items-center justify-center">
				{#if home.hasPets}
					<CustomBadge type="pet" />
				{/if}
				<CustomBadge type="days" days={home.max_days_stay} />
				<RecommendedOccupantBadge occupantType={home.occupant_type} />
			</div>
		</div>

		<div class="block details">
			<div class="detail">
				<p>
					<strong>Date available</strong>: {getParsedDate(home.date_available)}
				</p>
			</div>
			<div class="detail">
				<p><strong>Distance to Project</strong>: {home.distanceToProject} miles</p>
			</div>
			<div class="detail">
				<strong>Project: </strong>
				{home.project.friendly_name} - {home.project.id}
			</div>

			<div class="detail">
				<strong>Comfort rating: </strong>
				<div
					class="badge {home.comfort_rating === 'excellent'
						? 'badge-success'
						: home.comfort_rating === 'good'
							? 'badge-primary'
							: home.comfort_rating === 'unacceptable'
								? 'badge-error'
								: ''}"
				>
					<strong>{home.comfort_rating}</strong>
				</div>
			</div>
		</div>

		<h2>Amenities</h2>
		<div class="block amenities">
			{#if home.amenities && home.amenities.length !== 0}
				{#each home.amenities as amenity}
					<div class="badge badge-soft badge-info">{amenity}</div>
				{/each}
			{:else}
				<p class="detail amenities-none-text">No amenities listed for this home 🤷‍♂️</p>
			{/if}
		</div>

		<!-- CAR -->
		<h2>Parking & RV</h2>
		<div class="block mt-2">
			<div class="flex detail">
				Type: {home.parkingType}
			</div>

			<div class="detail flex flex-row">
				RV:
				{#if home.rv_notes}
					{home.rv_notes}
				{:else}
					no rv hookup
				{/if}
			</div>
		</div>

		{#if home.allergies && home.allergies.length !== 0}
			<div class="block details">
				<p class="detail">Host allergies:</p>
				<div class="allergies">
					{#each home.allergies as allergy}
						<div class="badge badge-outline badge-secondary">{allergy}</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- HOST -->
		<h2 class="text-center mb-4">Host</h2>
		<div class="block details">
			<div class="detail">
				<strong>Congregation:</strong>
				{home.congregation}
			</div>

			<div class="flex justify-between mt-5">
				{#if data.user.isAdmin}
					<label for="edit-contacts-drawer" class="btn btn-soft btn-primary btn-xs mr-5 mb-4">
						<Edit />Edit contacts
					</label>
				{/if}
			</div>

			<ul class="list bg-base-100 rounded-box shadow-md">
				<ContactsList host={home.hosts} />
			</ul>
		</div>
	</div>

	<Comments
		postCommentCallback={postComment}
		deleteCommentCallback={deleteComment}
		commentsData={home.comments}
		currentUserEmail={data.user.email}
	/>
</div>

<style>
	.map-pin {
		border-radius: 50%;
	}
	.heading {
		padding-top: 30px;
	}
	.address-container {
		margin: 0 auto;
		margin-bottom: 50px;
	}
	.top-container {
		display: flex;
		flex-direction: column;
	}
	.block {
		align-items: center;
		padding: 0 20px 40px 20px;
	}
	h2 {
		font-size: 1.2em;
		font-weight: bold;
		padding: 0 30px;
	}
	.amenities-none-text {
		color: gray;
	}

	.detail {
		font-size: 0.9em;
		padding-left: 10px;
	}

	.badge {
		margin: 5px;
	}
	.divider {
		font-style: italic;
		font-size: small;
		width: 90%;
		margin: 0 auto;
		margin-bottom: 30px;
	}
	.message {
		font-size: 0.9em;
	}
</style>
