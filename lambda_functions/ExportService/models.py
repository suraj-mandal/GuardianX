from dataclasses import dataclass

import math


@dataclass
class Location:
    name: str
    address: str
    phone: str
    latitude: float
    longitude: float
    pincode: str
    speciality: str
    email: str