<script>
    import { onMount } from "svelte";
    import mapboxgl from "mapbox-gl";

    let { children, ...props } = $props();
    const { address } = props



    const token = "";

	let position 

    onMount( async () => {
    	position = await geocode(address)

 

        mapboxgl.accessToken = token;

        if (position) {

            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
                projection: 'globe', // display the map as a globe
                zoom: 14, // initial zoom level, 0 is the world view, higher values zoom in
                center: position // center the map on this longitude and latitude


            });

            new mapboxgl.Marker({ color: "#e11d48" })
                .setLngLat(position)
                // .setPopup(new mapboxgl.Popup().setText("Shabu King")) // optional popup
                .addTo(map);


            map.addControl(new mapboxgl.NavigationControl());
            map.scrollZoom.disable();

            map.on('style.load', () => {
                map.setFog({}); // Set the default atmosphere style
            });



        }

   });
    async function geocode(query) {
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
			query
		)}.json?access_token=${token}`;

		const res = await fetch(url);
		if (!res.ok) throw new Error("Failed to geocode");
		const data = await res.json();

		// First match
		return data.features[0]?.geometry.coordinates; // [lng, lat]
    }




</script>

<div id="map"></div>


<style>
  /* Card-like mini map container */
  #map {
    width: 100%;
    height: 400px;                  /* small display height */
    border-radius: 14px;            /* rounded like Yelp cards */
    overflow: hidden;               /* clip map edges to radius */
    box-shadow: 0 6px 18px rgba(0,0,0,0.12); /* soft shadow */
    border: 1px solid rgba(0,0,0,0.06);      /* subtle border */
    background: #f8f9fb;            /* avoids white flash before map loads */
    position: relative;
  }

  /* Keep Mapbox attribution visible, but neatly placed */
  :global(.mapboxgl-ctrl-bottom-right) {
    margin: 8px;
  }
  :global(.mapboxgl-ctrl-bottom-left) {
    margin: 8px;
  }

  /* Make controls feel compact on a small map */
  :global(.mapboxgl-ctrl.mapboxgl-ctrl-group) {
    border-radius: 10px;
  }

  /* Respect dark mode a bit */
  @media (prefers-color-scheme: dark) {
    #map {
      border-color: rgba(255,255,255,0.12);
      box-shadow: 0 8px 20px rgba(0,0,0,0.35);
      background: #0b0b0d;
    }
  }
</style>