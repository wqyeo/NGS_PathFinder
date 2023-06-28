const iconCollection = {};

function _loadIcons(data) {
    for (var i = 0; i < data.length; ++i) {
        var iconPath = `${STATIC_URL}images/icons/` + data[i].category + '/' + (data[i].file != null ? data[i].file : data[i].item) + '.png';

        iconCollection[data[i].item] = L.icon({
            iconSize: [data[i].size, data[i].size],
            iconAnchor: [data[i].size / 2, data[i].size / 2],
            popupAnchor: [0, -data[i].size],
            iconUrl: iconPath
        })
    };
}

fetch(`${STATIC_URL}storages/icons.json`)
    .then(response => response.json())
    .then(data => {
        _loadIcons(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });