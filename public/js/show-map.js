const key = window.MAPTILER_KEY;
const locationName = document.getElementById("data-location").textContent.trim();
const mapContainer = document.getElementById("map");

fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(locationName)}.json?key=${key}`)
  .then(res => res.json())
  .then(data => {
    if (!data.features || data.features.length === 0) {
      console.error("Location not found:", locationName);
      return;
    }

    const [lon, lat] = data.features[0].geometry.coordinates;
    console.log("Coordinates:", lon, lat);

    const map = new maplibregl.Map({
      container: "map",
      style: `https://api.maptiler.com/maps/streets-v4/style.json?key=${key}`,
      center: [lon, lat],
      zoom: 15,

      scrollZoom: false,
      dragPan: false,
      dragRotate: false,
      touchZoomRotate: false,
      doubleClickZoom: false
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const marker = new maplibregl.Marker({ color: "red" })
      .setLngLat([lon, lat])
      .addTo(map);

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 25,
      className: "custom-marker-popup"
    }).setHTML("<strong>Exact location</strong><br>provided after booking.");

    const markerEl = marker.getElement();

    markerEl.addEventListener("mouseenter", () => {
      popup.setLngLat([lon, lat]).addTo(map);
    });

    markerEl.addEventListener("mouseleave", () => {
      popup.remove();
    });

    const activateMap = () => {
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.dragRotate.enable();
      map.touchZoomRotate.enable();
      map.doubleClickZoom.enable();

      mapContainer.style.cursor = "grab";

      const overlay = mapContainer.querySelector('.map-overlay');
      if (overlay) overlay.remove();
    };

    mapContainer.addEventListener('click', activateMap, { once: true });
    mapContainer.addEventListener('touchstart', activateMap, { once: true });

  })
  .catch(err => console.error("Geocoding error:", err));