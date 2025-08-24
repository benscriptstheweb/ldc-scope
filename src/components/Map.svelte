<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';

	let { address } = $props();
	let mapContainer: HTMLElement;
	const token = import.meta.env.VITE_PUBLIC_MAPBOX_KEY;

	onMount(async () => {
		const res = await fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
				address
			)}.json?access_token=${token}`
		);

		const data = await res.json();

		mapboxgl.accessToken = token;

		// Map initialize
		const map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/standard',
			center: data.features[0]?.geometry.coordinates,
			zoom: 17
		});

		new mapboxgl.Marker({ color: '#e11d48' })
			.setLngLat(data.features[0]?.geometry.coordinates)
			.addTo(map);

		map.addControl(new mapboxgl.NavigationControl());
		map.scrollZoom.disable();
	});
</script>

<div class="card w-86 h-65" bind:this={mapContainer}></div>
