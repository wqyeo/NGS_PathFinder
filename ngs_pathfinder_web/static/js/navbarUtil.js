const POLYLINE_REFERENCE = []

function generateHeuGraph() {
    $.ajax({
        url: "generate-graph/",
        type: "GET",
        success: function(response) {
            console.log("Yes!");
        },
        error: function(xhr, status, error) {
            console.error(error);
        },
    });
}

function _removeAllDrawnPaths() {
    POLYLINE_REFERENCE.forEach(function(polylineRef) {
        map.removeLayer(polylineRef)
    });
    POLYLINE_REFERENCE.length = 0;
}

function _drawPath(pathArray) {
    _removeAllDrawnPaths();
    var current = pathArray[0];

    for (var i = 1; i < pathArray.length; i++) {
        var next = pathArray[i];

        const from = [current["lat"], current["lng"]];
        const to = [next["lat"], next["lng"]];

        var polylineOptions = {
            color: 'red'
        };
        // Draw dotted to indicate teleportation, if needed
        if (next["tp"]) {
            polylineOptions.dashArray = '10, 5';
        }

        const pathLine = L.polyline([from, to], polylineOptions).addTo(map);
        POLYLINE_REFERENCE.push(pathLine)

        current = next;
    }
}

function showPathFinding() {
    const allNodes = JSON.stringify(getAllPathNodes());

    // Fetch and include the CSRF token from the hidden form
    var csrfForm = document.getElementById("csrfForm");
    var csrfToken = csrfForm.getElementsByTagName("input")[0].value;

    $.ajax({
        url: "/do-pathfind/",
        type: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
        },
        data: allNodes,
        success: function(response) {
            const pathResult = response["result"];
            console.log(pathResult);
            console.log(pathResult.length);

            _drawPath(pathResult);
        },
        error: function(xhr, status, error) {
            console.error(error);
        },
    });
}