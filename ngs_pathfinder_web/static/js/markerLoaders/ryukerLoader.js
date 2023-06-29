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