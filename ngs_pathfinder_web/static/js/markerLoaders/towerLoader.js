function _loadTower(jsonData) {
    for (const towerData of jsonData) {
        var marker = L.marker([towerData.lat, towerData.lng], {
            icon: iconCollection['tower'],
            alt: towerData.id
        });

        // Tooltip; Shown on hover.
        var tooltipContent = `<tooltipwindow>
        <header>
            <span><menuicon/>${towerData.title}</span>
        </header>
        <content>Tower\nRequired Power: ${towerData.minBP}\nEnemy Level: ${towerData.enemyLv}<id>ID: ${towerData.id}</id></content></tooltipwindow>
        `;
        marker.bindTooltip(tooltipContent, {
            direction: 'top'
        });

        if (pathNodeExists(towerData.id)) {
            const result = marker.setOpacity(0.5);

            if (result) {
                marker.setOpacity(0.5);
            } else {
                marker.setOpacity(1);
            }
        }

        marker.addTo(map);
    }
}

fetch(`${STATIC_URL}data/towers.json`)
    .then(response => response.json())
    .then(data => {
        _loadTower(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });