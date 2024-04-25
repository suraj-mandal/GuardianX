import json
import urllib3
import boto3
import logging as logger

client = boto3.client('apigatewaymanagementapi', endpoint_url="https://ziik416ih6.execute-api.us-east-1.amazonaws.com/production")

dynamodb_client = boto3.client('dynamodb')
dynamodb = boto3.resource("dynamodb")
tableName = 'User'
table = dynamodb.Table(tableName)


def lambda_handler(event, context):
    
    logger.info(f"Event Details: {event}")
    
    #Extract connectionId from incoming event
    connectionId = event["requestContext"]["connectionId"]
    
    responseMessage = "responding..."
    
    try:
        body = table.get_item(
                Key={'id': connectionId})
        print("Body: "+ body) 
        
        body = body["is_acknowledge"]
    except KeyError:
           print(KeyError) 
    
    
    response = client.post_to_connection(ConnectionId=connectionId, Data=json.dumps(responseMessage).encode('utf-8'))
    return {
        'statusCode': 200
    }
