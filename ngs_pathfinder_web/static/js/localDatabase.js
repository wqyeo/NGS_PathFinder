// Function to locally store all the nodes to pathfind
function registerPathNode(nodeId) {
    if (pathNodeExists(nodeId)) {
        localStorage.removeItem(nodeId);
        return false;
    }

    const entry = {
        "isNodeFlag": true
    };

    localStorage.setItem(nodeId, JSON.stringify(entry));
    return true;
}

function pathNodeExists(nodeId) {
    return localStorage.getItem(nodeId) != null;
}

function _isValidPathNode(pathNodeData) {
    if (!("isNodeFlag" in pathNodeData)) {
        return false;
    }

    return true;
}

function getAllPathNodes() {
    var result = [];

    for (var i = 0; i < localStorage.length; ++i) {
        var key = localStorage.key(i)
        var data = JSON.parse(localStorage.getItem(key));

        if (_isValidPathNode(data)) {
            result.push(key);
        }
    }

    return result;
};