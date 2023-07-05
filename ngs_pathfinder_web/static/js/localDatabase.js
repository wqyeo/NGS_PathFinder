// Function to locally store all the nodes to pathfind
function registerPathNode(nodeId, lat, lng, category, region) {
    if (pathNodeExists(nodeId)) {
        localStorage.removeItem(nodeId);
        console.log("Removed " + nodeId)
        return false;
    }

    const entry = {
        "lat": lat,
        "lng": lng,
        "category": category,
        "region": region
    };

    localStorage.setItem(nodeId, JSON.stringify(entry));
    console.log("Added " + nodeId)
    return true;
}

function pathNodeExists(nodeId) {
    return localStorage.getItem(nodeId) != null;
}

function _isValidPathNode(pathNodeData) {
    const requiredKeys = [
        "lat", "lng", "category", "region"
    ];

    for (const requiredKey in requiredKeys) {
        if (!(requiredKey in pathNodeData)) {
            return false;
        }
    }

    return true;
}

function getAllPathNodes() {
    var result = {};

    for (var i = 0; i < localStorage.length; ++i) {
        var key = localStorage.key(i)
        var data = JSON.parse(localStorage.getItem(key));
        result[key] = data;
    }

    return result;
};