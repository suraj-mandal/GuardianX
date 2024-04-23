from connection import generate_connection
from model import Location, Coordinate

import math

conn = generate_connection()


# def create_place_table(name: str):
#     with conn.cursor() as cur:
#         create_table_string = f"""
#     create table if not exists {name}
#         (
#             id        int          NOT NULL AUTO_INCREMENT,
#             name      varchar(255) NOT NULL,
#             address   varchar(255) NOT NULL,
#             phone     varchar(255) NOT NULL,
#             pincode   varchar(255) NOT NULL,
#             email   varchar(255) NOT NULL,
#             speciality   varchar(255) NOT NULL,
#             latitude  DOUBLE PRECISION(7, 4),
#             longitude DOUBLE PRECISION(7, 4),
#             PRIMARY KEY (id)
#         )
#         """
#         cur.execute(create_table_string)
#         conn.commit()


def create_hospital_database():
    create_place_table('HOSPITAL')


def create_fire_station_database():
    create_place_table('FIRE_STATION')


def create_traffic_police_database():
    create_place_table('TRAFFIC_POLICE')


# executing the command
def show_tables():
    with conn.cursor() as cur:
        cur.execute('SHOW TABLES')
        for row in cur:
            print(row)
    conn.commit()


def show_data(table_name: str):
    sql_statement = f"""
        SELECT * FROM {table_name}
    """
    location_list = []
    with conn.cursor() as cur:
        cur.execute(sql_statement)
        for row in cur:
            location_list.append(Location.from_row(row).as_dict())
    conn.commit()


def show_nearest_places(coordinate: Coordinate, table_name: str, limit: int):
    sql_statement = f"""
        SELECT *,
        6371 * 2 * ASIN(SQRT(POWER(SIN(({coordinate.latitude} - latitude) / 2), 2)
                        + COS({coordinate.latitude}) * COS(latitude)
                        * POWER(SIN(({coordinate.longitude} - longitude) / 2), 2))) AS distance
        FROM {table_name} ORDER BY distance LIMIT {limit};
    """

    print(f"Showing nearest {table_name} near you.")

    location_list = []

    with conn.cursor() as cur:
        cur.execute(sql_statement)
        for row in cur:
            location_list.append(Location.from_row(row).as_dict())
    conn.commit()

    return location_list


def clear_table(table_name: str):
    sql_statement = f"""
    DELETE FROM {table_name}
    """

    with conn.cursor() as cur:
        cur.execute(sql_statement)

    conn.commit()
