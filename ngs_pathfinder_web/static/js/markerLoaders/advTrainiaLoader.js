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