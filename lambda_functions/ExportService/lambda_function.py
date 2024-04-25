import boto3
import pymysql
import pandas as pd
#import pyarrow.parquet as pq
from io import StringIO
#from sqlalchemy import create_engine
import logging as logger
from sqlquery import clear_table, show_tables, upload_dataframe_into_rds, drop_table, create_place_table, show_data
from connection import generate_connection

# S3 Boto client to interact with S3 operations/bucket
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    
    logger.info(f"S3 bucket is obtained from the event: {bucket}")
    logger.info(f"event details: {event}")
    
    #for obj in bucket.objects.all():
    key = event['Records'][0]['s3']['object']['key']
    
    logger.info(f"key is obtained from the event: {key}")
    
    df_file = load_data_from_s3(bucket=bucket, key=key)
    if key.startswith("hospital"):
        clear_table('HOSPITAL')
        upload_dataframe_into_rds(df=df_file, table_name='HOSPITAL')
        show_data('TRAFFIC_POLICE')
    elif key.startswith("police"):
        clear_table('TRAFFIC_POLICE')
        upload_dataframe_into_rds(df=df_file, table_name='TRAFFIC_POLICE')
        show_data('TRAFFIC_POLICE')
    elif key.startswith("fire"):
        clear_table('FIRE_STATION')
        upload_dataframe_into_rds(df=df_file, table_name='FIRE_STATION')
        show_data('TRAFFIC_POLICE')
        
    
    #create_hospital_database()
    #create_fire_station_database()
    #create_traffic_police_database()
    
    # dropping the table
    # drop_table('FIRE_STATION')
    # create_place_table('FIRE_STATION')
    
    # show_tables()
    
    logger.info("Whole process completed.")
    
    return {
        'statusCode': 200,
        'body': 'CSV data has been successfully updated into Database'
    }


# Function to load CSV files into a Pandas DataFrame
def load_data_from_s3(bucket, key):
    logger.info(f"Object key is obtained from the event: {key}")
    file_objects = s3_client.get_object(Bucket=bucket, Key=key)
    logger.info(f"Object key is obtained from the event: {file_objects}")
    
    response_body = file_objects.get('Body')
    file_content = response_body.read().decode('utf-8')
    df = pd.read_csv(StringIO(file_content))
    return df

