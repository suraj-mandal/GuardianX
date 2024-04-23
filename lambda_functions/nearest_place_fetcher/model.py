from dataclasses import dataclass, asdict

import math


@dataclass
class Location:
    name: str
    address: str
    phone: str
    latitude: float
    longitude: float
    email: str
    pincode: str
    speciality: str
    distance: float

    def as_dict(self):
        return asdict(self)

    @classmethod
    def from_row(cls, row):
        return Location(name=row[1], address=row[2], phone=row[3], pincode=row[4], email=row[5], speciality=row[6], latitude=row[7], longitude=row[8], distance=row[9])

class Coordinate:
    def __init__(self, latitude, longitude):
        self.latitude = math.radians(latitude)
        self.longitude = math.radians(longitude)
