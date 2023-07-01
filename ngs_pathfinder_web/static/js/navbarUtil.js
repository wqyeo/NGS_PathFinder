function showMapSettings() {
    // TODO: Popup, allow user to select what resources to show, etc
}

function showPathFinding() {
    const allNodes = getAllPathNodes();

    // Fetch and include the CSRF token from the hidden form
    var csrfForm = document.getElementById('csrfForm');
    var csrfToken = csrfForm.getElementsByTagName('input')[0].value;

    $.ajax({
        url: '/do-pathfind/',
        type: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        data: allNodes,
        success: function(response) {
            // TODO: Draw out pathfinding
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}