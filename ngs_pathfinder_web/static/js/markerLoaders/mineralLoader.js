function _getIcon(mineralData) {
    const iconKey = mineralData.id.replace(/\d+$/, '');
    return iconCollection[iconKey]
}

async function _loadMineralColors() {
    try {
        const response = await fetch(`${STATIC_URL}storages/settings.json`);
        if (response.ok) {
            const data = await response.json();
            return data.items.mineral;
        } else {
            throw new Error('Network response was not OK');
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function _findCircleSettingByMineral(colorSettings, mineralData) {
    const mineralItem = mineralData.id.replace(/\d+$/, '');

    for (const i in colorSettings) {
        var setting = colorSettings[i];
        if (setting["item"] === mineralItem) {
            return setting;
        }
    }
}

async function _loadMinerals(jsonData) {
    const colorSettings = await _loadMineralColors();

    for (const mineralData of jsonData) {
        // Create marker first
        const marker = L.marker([mineralData.lat, mineralData.lng], {
            icon: _getIcon(mineralData),
            alt: mineralData.id
        });

        var tooltipContent = `<tooltipwindow>
        <header>
            <span><menuicon/>${mineralData.type}</span>
        </header>
        <content>Mineral in ${mineralData.region}\n<id>ID: ${mineralData.id}</id></content></tooltipwindow>
        `;
        marker.bindTooltip(tooltipContent, {
            direction: 'top'
        });

        // Create Circle
        const circleSettings = _findCircleSettingByMineral(colorSettings, mineralData);
        const circle = L.circle([mineralData.lat, mineralData.lng], {
            radius: circleSettings["area_radius"],
            fillColor: circleSettings["area_fillColor"],
            color: circleSettings["area_color"],
            fillOpacity: 0.25
        });

        marker.on("click", (e) => {
            // Register to pathfinding if selected
            const result = registerPathNode(mineralData.id);

            if (result) {
                marker.setOpacity(0.35);
                circle.setOpacity(0.1);
                circle.setStyle({
                    fillOpacity: 0.1
                });
            } else {
                marker.setOpacity(1);
                circle.setOpacity(0.1);
                circle.setStyle({
                    fillOpacity: 0.25
                });
            }
        });

        // Make circle + marker into group and add to map
        const mineralGroup = L.layerGroup([circle, marker]);
        mineralGroup.addTo(map);

        // Set opacity if this node was selected before
        if (pathNodeExists(mineralData.id)) {
            marker.setOpacity(0.35);
            circle.setStyle({
                fillOpacity: 0.1
            });
        }
    }
}

const _mineralsJsonFilePaths = [
    `data/minerals/photonchunk.json`,
    `data/minerals/photonquartz.json`,
    `data/minerals/dualomite.json`,
    `data/minerals/pentalite.json`,
    `data/minerals/trinite.json`
];

for (const filePath of _mineralsJsonFilePaths) {
    fetch(`${STATIC_URL}` + filePath, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            }
        })
        .then(response => response.json())
        .then(responseJson => {
            _loadMinerals(responseJson);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}