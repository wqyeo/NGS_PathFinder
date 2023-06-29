function _getMagName(magData) {
    if (magData.string === "invincible") {
        return "Invincible Regional Mag";
    }
    if (magData.string === "expert") {
        return "Expert Regional Mag";
    }
    if (magData.string === "priceless") {
        return "Priceless Regional Mag";
    }

    return "Regional Mag Device";
}

function _loadMag(jsonData) {
    for (const magData of jsonData) {
        var marker = L.marker([magData.lat, magData.lng], {
            icon: iconCollection['mag'],
            alt: magData.id
        });
        var magName = _getMagName(magData);

        // Tooltip; Shown on hover.
        var tooltipContent = `<tooltipwindow>
        <header>
            <span><menuicon/>${magName}</span>
        </header>
        <content><id>ID: ${magData.id}</id></content></tooltipwindow>
        `;
        marker.bindTooltip(tooltipContent, {
            direction: 'top'
        });

        marker.addTo(map);
    }
}

fetch(`${STATIC_URL}data/mags.json`)
    .then(response => response.json())
    .then(data => {
        _loadMag(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });