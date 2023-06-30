function _loadCocoon(jsonData) {
    for (const cocoonData of jsonData) {
        var marker = L.marker([cocoonData.lat, cocoonData.lng], {
            icon: iconCollection['cocoon'],
            alt: cocoonData.id
        });

        // Tooltip; Shown on hover.
        var tooltipContent = `<tooltipwindow>
        <header>
            <span><menuicon/>${cocoonData.title}</span>
        </header>
        <content>Cocoon\nRequired Power: ${cocoonData.minBP}\nEnemy Level: ${cocoonData.enemyLv}<id>ID: ${cocoonData.id}</id></content></tooltipwindow>
        `;
        marker.bindTooltip(tooltipContent, {
            direction: 'top'
        });

        marker.on("click", (e) => {
            const result = registerPathNode(cocoonData.id, cocoonData.lat, cocoonData.lng, "cocoon", "aelio");

            if (result) {
                marker.setOpacity(0.5);
            } else {
                marker.setOpacity(1);
            }
        });

        if (pathNodeExists(cocoonData.id)) {
            marker.setOpacity(0.5);
        }

        marker.addTo(map);
    }
}

fetch(`${STATIC_URL}data/cocoons.json`)
    .then(response => response.json())
    .then(data => {
        _loadCocoon(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });