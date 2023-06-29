function _getPolygonColorByType(sectionType) {
    if (sectionType === "lobby") {
        return "blue";
    }
    if (sectionType === "gathering") {
        return "green";
    }
    if (sectionType === "combat") {
        return "red";
    }

    return "#5A5766"; // Dark grey
}

function _loadMapSections(jsonData) {
    for (const sectionData of jsonData) {
        const polygonCoordinates = sectionData.coordinates;
        const polygonColor = _getPolygonColorByType(sectionData.type);

        const sectionPolygon = L.polygon(polygonCoordinates, {
            color: "lightblue",
            fillColor: polygonColor,
            weight: 1,
            fillOpacity: 0,
            opacity: 0.25
        });

        // faintly light up on mouseover
        sectionPolygon.on('mouseover', function() {
            sectionPolygon.setStyle({
                fillOpacity: 0.2,
                opacity: 0.75
            });
        });
        sectionPolygon.on('mouseout', function() {
            sectionPolygon.setStyle({
                fillOpacity: 0.0,
                opacity: 0.25
            });
        });

        sectionPolygon.addTo(map);
    }
}

fetch(`${STATIC_URL}data/sections.json`)
    .then(response => response.json())
    .then(data => {
        _loadMapSections(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });