import boto3

import os


class Client:
    def __init__(self, service, **kwargs):
        self.client = boto3.client(service, **kwargs)

    @property
    def client(self):
        return self.__client

    @client.setter
    def client(self, new_client):
        self.__client = new_client


class ApiGatewayClient(Client):
    def __init__(self, url):
        super().__init__('apigatewaymanagementapi', endpoint_url=url)




class S3Client(Client):
    def __init__(self):
        super().__init__('s3')
