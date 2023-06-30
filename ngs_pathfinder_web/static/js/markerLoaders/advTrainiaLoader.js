function _loadAdvTrainia(jsonData) {
    for (const trainiaData of jsonData) {
        var marker = L.marker([trainiaData.lat, trainiaData.lng], {
            icon: iconCollection['advTrainia'],
            alt: trainiaData.id
        });

        // Tooltip; Shown on hover.
        var tooltipContent = `<tooltipwindow>
        <header>
            <span><menuicon/>${trainiaData.title}</span>
        </header>
        <content>Advanced Trainia\nRequired Power: ${trainiaData.minBP}\nEnemy Level: ${trainiaData.enemyLv}<id>ID: ${trainiaData.id}</id></content></tooltipwindow>
        `;
        marker.bindTooltip(tooltipContent, {
            direction: 'top'
        });

        marker.on("click", (e) => {
            const result = registerPathNode(trainiaData.id, trainiaData.lat, trainiaData.lng, "advTrainia", "aelio");

            if (result) {
                marker.setOpacity(0.5);
            } else {
                marker.setOpacity(1);
            }
        });

        if (pathNodeExists(trainiaData.id)) {
            marker.setOpacity(0.5);
        }

        marker.addTo(map);
    }
}

fetch(`${STATIC_URL}data/advTrainia.json`)
    .then(response => response.json())
    .then(data => {
        _loadAdvTrainia(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });