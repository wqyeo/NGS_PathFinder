const bounds = {
    North: 0,
    East: 2048,
    West: 0,
    South: -2048
};

const map = new L.Map('map', {
    zoom: 0,
    minZoom: 0,
    maxZoom: 3,
    crs: L.CRS.Simple,
    maxBounds: [
        [bounds.South - 100, bounds.West - 250],
        [bounds.North + 250, bounds.East + 250]
    ],
    center: [bounds.South / 2, bounds.East / 2],
    zoomControl: false,
    attributionControl: false,
    keyboard: false,
    maxBoundsViscosity: 0.5,
    doubleClickZoom: false,
});

// `/${STATIC_URL}images/tiles/{z}/{y}-{x}.png`
//'{% static "images/tiles/{z}/{y}-{x}.png" %}'

const tileLayer = new L.TileLayer(`${STATIC_URL}images/tiles/{z}/{y}-{x}.png`, {
    bounds: [
        [bounds.South, bounds.West],
        [bounds.North, bounds.East]
    ],
    tileSize: 1024,
    noWrap: true,
});
tileLayer.addTo(map);

map.setView([bounds.South / 2, bounds.East / 2]);

window.mapInstance = map;