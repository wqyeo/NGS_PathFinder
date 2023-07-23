 # NGS PathFinding

This project was developed as part of a University project, with the aim of showcasing various pathfinding algorithms.

It focuses on implementing pathfinding functionality on top of an existing interactive map of "Phantasy Star Online: New Genesis" (PSO2: NGS), an open world MMORPG.

"Phantasy Star Online: New Genesis" provides players with an expansive game world filled with resources to collect. These resources are scattered throughout the game world, making it an ideal environment to demonstrate and compare different pathfinding algorithms.

## Running the project locally

**1.** Ensure that you have the latest version of [Python3](https://www.python.org/downloads/).

**2.** Install django
```
pip install django
```

**3.** Run the server locally

```
python manage.py runserver
```

> The `manage.py` file is in `ngs_pathfinder_web` folder; You will need to navigate to that directory first.

**4.** You will see an output similar to:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```
You can now access the project by visiting `http://127.0.0.1:8000/` from your web browser

## Usage

Click on the mineral nodes in the map. Then click on the bottom button _(Show Pathfindings)_, and the map should draw out a line of paths.

## Acknowledgements

- Static images, data and webpage styling was fetched from [NGS_WorldMap](https://github.com/kosnag/NGS_WorldMap) and [ngs-world-map](https://github.com/alairon/ngs-world-map) repositories.
