function showMapSettings() {
    // TODO: Popup, allow user to select what resources to show, etc
}

function showPathFinding() {
    const allNodes = JSON.stringify(getAllPathNodes());

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

// NOTE: Popup window display to show settings to toggle map marker display

function _createWindow() {
    var menuLegend = document.createElement("window");
    menuLegend.id = "menu-legend";

    var header = document.createElement("header");
    menuLegend.appendChild(header);

    var span = document.createElement("span");
    span.innerHTML = "<menuicon/> {t('ui:navbar.mapLegend')}";
    header.appendChild(span);

    var closeButton = document.createElement("closebutton");
    closeButton.onclick = function() {
        Functions.menuShowHide("menu-legend");
    };
    header.appendChild(closeButton);

    var columns = document.createElement("columns");
    menuLegend.appendChild(columns);

    var category = document.createElement("category");
    columns.appendChild(category);

    var toggleTab = ""; // Define the initial value for toggleTab

    var createButton = function(className, clickHandler, buttonText) {
        var button = document.createElement("button");
        button.className = className;
        button.onclick = clickHandler;
        button.innerHTML = buttonText;
        return button;
    };

    category.appendChild(
        createButton(
            toggleTab === "landmarks" ? "active" : "",
            function() {
                clickToggleTab("landmarks");
            },
            "{t('ui:legendMenu.categories.landmarks')}"
        )
    );
    category.appendChild(
        createButton(
            toggleTab === "minerals" ? "active" : "",
            function() {
                clickToggleTab("minerals");
            },
            "{t('ui:legendMenu.categories.minerals')}"
        )
    );
    category.appendChild(
        createButton(
            toggleTab === "food" ? "active" : "",
            function() {
                clickToggleTab("food");
            },
            "{t('ui:legendMenu.categories.food')}"
        )
    );
    category.appendChild(
        createButton(
            toggleTab === "containers" ? "active" : "",
            function() {
                clickToggleTab("containers");
            },
            "{t('ui:legendMenu.categories.containers')}"
        )
    );
    category.appendChild(
        createButton(
            toggleTab === "other" ? "active" : "",
            function() {
                clickToggleTab("other");
            },
            "{t('ui:legendMenu.categories.other')}"
        )
    );

    var itemsLandmarks = document.createElement("items");
    itemsLandmarks.className = toggleTab === "landmarks" ? "active" : "";
    columns.appendChild(itemsLandmarks);

    if (dataJSON.items) {
        dataJSON.items.landmark.map(function(x) {
            if (x.disabled === true) {
                return null;
            } else {
                itemsLandmarks.appendChild(
                    createButton("landmark", x.item, "places")
                );
            }
        });
    }

    var itemsMinerals = document.createElement("items");
    itemsMinerals.className = toggleTab === "minerals" ? "active" : "";
    columns.appendChild(itemsMinerals);

    if (dataJSON.items) {
        dataJSON.items.mineral.map(function(x) {
            if (x.disabled === true) {
                return null;
            } else {
                itemsMinerals.appendChild(
                    createButton("mineral", x.item, x.rarity)
                );
            }
        });
    }

    var itemsFood = document.createElement("items");
    itemsFood.className = toggleTab === "food" ? "active" : "";
    columns.appendChild(itemsFood);

    if (dataJSON.items) {
        dataJSON.items.food.map(function(x) {
            var accordion = document.createElement("accordion");
            itemsFood.appendChild(accordion);

            var accordionButton = document.createElement("button");
            accordionButton.onclick = function() {
                if (toggleAccordionFood === x.group_locale_id) {
                    setAccordionFood("");
                } else {
                    setAccordionFood(x.group_locale_id);
                }
            };
            accordion.appendChild(accordionButton);

            var accordionIcon = document.createElement("span");
            accordionIcon.className = "accordionIcon";
            accordionIcon.innerHTML = toggleAccordionFood === x.group_locale_id ? "-" : "+";
            accordionButton.appendChild(accordionIcon);

            accordionButton.innerHTML = "{t('sections:regions." + x.group_locale_id + "')}";

            var list = document.createElement("list");
            list.className = toggleAccordionFood === x.group_locale_id ? "active" : "";
            accordion.appendChild(list);

            x.items.map(function(z) {
                if (z.disabled === true) {
                    return null;
                } else {
                    list.appendChild(
                        createButtonFood(z.item, z.type, z.prefix, z.rarity)
                    );
                }
            });
        });
    }

    var itemsContainers = document.createElement("items");
    itemsContainers.className = toggleTab === "containers" ? "active" : "";
    columns.appendChild(itemsContainers);

    if (dataJSON.items) {
        dataJSON.items.container.map(function(x) {
            if (x.disabled === true) {
                return null;
            } else {
                itemsContainers.appendChild(
                    createButton("container", x.item, x.rarity)
                );
            }
        });
    }

    var itemsOther = document.createElement("items");
    itemsOther.className = toggleTab === "other" ? "active" : "";
    columns.appendChild(itemsOther);

    if (dataJSON.items) {
        dataJSON.items.other.map(function(x) {
            if (x.disabled === true) {
                return null;
            } else {
                itemsOther.appendChild(
                    createButton("other", x.item, x.rarity)
                );
            }
        });
    }

    var info = document.createElement("info");
    columns.appendChild(info);

    var background = document.createElement("background");
    background.className = previewRarity;
    info.appendChild(background);

    var img = document.createElement("img");
    img.alt = "";
    img.src = previewIcon;
    info.appendChild(img);

    var name = document.createElement("name");
    name.innerHTML = previewTitle;
    info.appendChild(name);

    var thesis = document.createElement("thesis");
    thesis.innerHTML = previewDescription;
    info.appendChild(thesis);

    return menuLegend;
}

const markerSettingsWindow = _createWindow();

function showMapSettings() {
    markerSettingsWindow.style.display = "none";
}