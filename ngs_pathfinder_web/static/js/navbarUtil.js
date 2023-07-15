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
            console.log(response["result"]);
            console.log(response["result"].length);
        },
        error: function(xhr, status, error) {
            console.error(error);
        },
    });
}