function _loadRyuker(jsonData) {
    for (const ryukerData of jsonData) {
        var marker = L.marker([ryukerData.lat, ryukerData.lng], {
            icon: iconCollection['ryuker'],
            alt: ryukerData.id
        });
        // Tooltip; Shown on hover.
        var tooltipContent = `<tooltipwindow>
        <header>
            <span><menuicon/>Ryuker Device</span>
        </header>
        <content>Teleporter\n<id>ID: ${ryukerData.id}</id></content></tooltipwindow>
        `;
        marker.bindTooltip(tooltipContent, {
            direction: 'top'
        });

        marker.on("click", (e) => {
            const result = registerPathNode(ryukerData.id, ryukerData.lat, ryukerData.lng, "ryuker", "aelio");

            if (result) {
                marker.setOpacity(0.5);
            } else {
                marker.setOpacity(1);
            }
        });

        if (pathNodeExists(ryukerData.id)) {
            marker.setOpacity(0.5);
        }

        marker.addTo(map);
    }
}

fetch(`${STATIC_URL}data/ryukers.json`)
    .then(response => response.json())
    .then(data => {
        _loadRyuker(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });