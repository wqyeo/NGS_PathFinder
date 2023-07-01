class Node:
    def __init__(self, id: str, lat: float, lng: float, category: str, region: str):
        self._id = id
        self._lat = lat
        self._lng = lng
        self._category = category
        self._region = region

    def get_id(self):
        return self._id

    def get_lat(self):
        return self._lat

    def get_lng(self):
        return self._lng

    def get_category(self):
        return self._category

    def get_region(self):
        return self._region