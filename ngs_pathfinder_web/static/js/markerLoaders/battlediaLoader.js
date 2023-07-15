function _getBattlediaIcon(battlediaData) {
    if (battlediaData.type === "yellow") {
        return iconCollection['battledia_yellow'];
    } else {
        return iconCollection['battledia_purple'];
    }
}

function _getBattlediaContentDescription(battlediaData) {
    // String describing type of battledia
    var contentType = battlediaData.type.charAt(0).toUpperCase() + battlediaData.type.slice(1) + " Battledia";

    return `${contentType}<id>ID: ${battlediaData.id}</id>`;
}

function _loadBattledia(jsonData) {
    for (const battlediaData of jsonData) {

        var marker = L.marker([battlediaData.lat, battlediaData.lng], {
            icon: _getBattlediaIcon(battlediaData),
            alt: battlediaData.id
        });

        // Tooltip; Shown on hover.
        var tooltipContent = `<tooltipwindow>
        <header>
            <span><menuicon/>${battlediaData.title}</span>
        </header>
        <content>${_getBattlediaContentDescription(battlediaData)}</content></tooltipwindow>
        `;
        marker.bindTooltip(tooltipContent, {
            direction: 'top'
        });

        marker.addTo(map);
    }
}

fetch(`${STATIC_URL}data/battledias.json`)
    .then(response => response.json())
    .then(data => {
        _loadBattledia(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });