import json

from helpers import text_embedding, search_index, create_context, create_augmented_prompt, get_bedrock_response

from client import ApiGatewayClient

import requests

import os


INDEX_NAME = 'emergency-index'

NEAREST_PLACE_FETCHER_URL = os.environ.get('NEAREST_PLACE_FETCHER_URL')

def lambda_handler(event, context):
    # TODO implement

    api_gateway_client = ApiGatewayClient(url=os.environ.get('WEBSOCKET_URL')).client

    # query = event.get('query')

    print(f"Event: {event}")

    request_body = json.loads(event.get("body"))

    connection_id = event.get("requestContext").get("connectionId")

    query = request_body.get("query")
    lat = float(request_body.get("lat"))
    lng = float(request_body.get("lng"))

    # get the embeddings
    embeddings = text_embedding(query)

    # get the response from opensearch
    opensearch_response = search_index(embeddings, INDEX_NAME)

    # create the context based on the response from opensearch
    context = create_context(opensearch_response.get('hits').get('hits'))

    # create the augmented prompt
    augmented_prompt = create_augmented_prompt(context, query)

    # get the response from bedrock
    bedrock_output = get_bedrock_response(augmented_prompt).replace("\n", "")

    # print(bedrock_output)

    response_output = {
        'output': bedrock_output,
        'lat': lat,
        'lng': lng,
        'connection_id': connection_id
    }


    # sending the response from the bedrock to the user
    api_gateway_client.post_to_connection(ConnectionId=connection_id, Data=json.dumps(bedrock_output).encode('utf-8'))



    # now doing a rest call to the nearest_place_fetcher_lambda
    try:
        nearest_places_response = requests.post(NEAREST_PLACE_FETCHER_URL, json = response_output).json()
        api_gateway_client.post_to_connection(ConnectionId=connection_id, Data=json.dumps(nearest_places_response).encode('utf-8'))
        # print(nearest_places_response.json())
    except Exception as e:
        print(e)


    return {
        'statusCode': 200
    }
