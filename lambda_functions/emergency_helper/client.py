from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth
import boto3

import os

OPENSEARCH_HOST = os.environ.get('OPENSEARCH_HOST')
REGION = os.environ.get('REGION')
OPENSEARCH_SERVERLESS_SERVICE = os.environ.get('OPENSEARCH_SERVERLESS_SERVICE')


class Client:
    def __init__(self, service):
        self.client = boto3.client(service)

    @property
    def client(self):
        return self.__client

    @client.setter
    def client(self, new_client):
        self.__client = new_client


class BedrockRuntimeClient(Client):
    def __init__(self):
        super().__init__('bedrock-runtime')


class OpensearchClient:
    def __init__(self):
        self.credentials = boto3.Session().get_credentials()
        self.auth = AWSV4SignerAuth(self.credentials, REGION, OPENSEARCH_SERVERLESS_SERVICE)
        self.client = OpenSearch(hosts=[{'host': OPENSEARCH_HOST, 'port': 443}],
                                 http_auth=self.auth,
                                 use_ssl=True,
                                 verify_certs=True,
                                 connection_class=RequestsHttpConnection, pool_maxsize=20)

    @property
    def client(self):
        return self.__client

    @client.setter
    def client(self, new_client):
        self.__client = new_client


class S3Client(Client):
    def __init__(self):
        super().__init__('s3')
