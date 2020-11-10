mapboxgl.accessToken = 'pk.eyJ1IjoibmVncnVnZW9yZ2U4IiwiYSI6ImNraDdvM2J2YTBtanoyeG81Y3d0aWg0NzYifQ.b_3-hL80A0ifUoBOEJ00xg';
let map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
center: [loc.longitude,loc.latitude], // starting position [lng, lat]
zoom: 8 // starting zoom
});

new mapboxgl.Marker()
.setLngLat([loc.longitude,loc.latitude])
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${loc.titlu_obiectiv}</h3><p>${loc.Oras}</p>`
    )
)
.addTo(map);




console.log(loc)