import os
import sys

import pymysql
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
rds_proxy_host = os.environ['RDS_PROXY_HOST']
db_name = os.environ['DB_NAME']
connection_timeout = int(os.environ['TIMEOUT'])


def generate_connection():
    try:
        conn = pymysql.connect(host=rds_proxy_host, user=user_name, passwd=password, db=db_name,
                               connect_timeout=connection_timeout)
        logger.info('Success: Connection to RDS for MySQL succeeded')
        return conn
    except pymysql.MySQLError as e:
        logger.error('Error: Unexpected error: Could not connect to MySQL instance')
        logger.error(e)
        sys.exit(1)
