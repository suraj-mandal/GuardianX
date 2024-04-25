from connection import generate_connection

import math

from models import Location

conn = generate_connection()

def drop_table(name: str):
    sql_statement = f"DROP TABLE {name}"
    with conn.cursor() as cur:
        cur.execute(sql_statement)
    conn.commit()

def create_place_table(name: str):
    with conn.cursor() as cur:
        create_table_string = f"""
        create table if not exists {name}
        (
            id        int          NOT NULL AUTO_INCREMENT,
            name      varchar(255) NOT NULL,
            address   varchar(255) NOT NULL,
            phone     varchar(255) NOT NULL,
            pincode   varchar(255) NOT NULL,
            email   varchar(255) NOT NULL,
            speciality   varchar(255) NOT NULL,
            latitude  DOUBLE PRECISION(7, 4),
            longitude DOUBLE PRECISION(7, 4),
            PRIMARY KEY (id)
        )
        """
        cur.execute(create_table_string)
        conn.commit()


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


# def insert_data(data: Location, table_name: str):
#     insert_into_table_string = f
#         INSERT INTO {table_name} (name, address, phone, latitude, longitude) values 
#         ('{data.name}', '{data.address}', '{data.phone}', {math.radians(data.latitude)}, {math.radians(data.longitude)})
    

#     with conn.cursor() as cur:
#         cur.execute(insert_into_table_string)
#         conn.commit()


def show_data(table_name: str):
    sql_statement = f"""
        SELECT * FROM {table_name}
    """
    with conn.cursor() as cur:
        cur.execute(sql_statement)
        for row in cur:
            print(row)
    conn.commit()
    
def clear_table(table_name: str):
    sql_statement = f"""
    DELETE FROM {table_name}
    """

    with conn.cursor() as cur:
        cur.execute(sql_statement)

    conn.commit()

def insert_data(data: Location, table_name: str):
    insert_into_table_string = f"""
        INSERT INTO {table_name} (name, address, phone, pincode, speciality, email, latitude, longitude) values 
        ('{data.name}', '{data.address}', '{data.phone}', '{data.pincode}', '{data.speciality}', '{data.email}', {math.radians(data.latitude)}, {math.radians(data.longitude)})
    """

    with conn.cursor() as cur:
        cur.execute(insert_into_table_string)
        "Successfully inserted data"
        conn.commit()


def upload_dataframe_into_rds(df, table_name):
    print(df.head())
    for index, row in df.iterrows():
        new_location = Location(name=row['Name'], address=row['Address'], phone=row['Phone'], latitude=row['Latitude'], longitude=row['Longitude'], speciality=row['speciality'], email=row['Email'], pincode=row['Pincode'])
        insert_data(new_location, table_name)
    # for row in df:
    #     print(row)
    # # df.to_sql(table_name, con=conn, if_exists='append', index=False)
    #     #logger.info(f'Dataframe uploaded into {GlobalVariables.database_name}.{table_name} successfully')
    # conn.commit()

    