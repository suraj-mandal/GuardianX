import json
import os

from helpers import text_embedding, search_index, create_context, create_augmented_prompt, get_bedrock_response

INDEX_NAME = 'emergency-index'


def lambda_handler(event, context):
    # TODO implement

    query = event.get('query')

    # get the embeddings
    embeddings = text_embedding(query)

    # get the response from opensearch
    opensearch_response = search_index(embeddings, INDEX_NAME)

    # create the context based on the response from opensearch
    context = create_context(opensearch_response.get('hits').get('hits'))

    # create the augmented prompt
    augmented_prompt = create_augmented_prompt(context, query)

    # get the response from bedrock
    bedrock_output = get_bedrock_response(augmented_prompt)

    print(bedrock_output)

    return {
        'statusCode': 200,
        'body': json.dumps(bedrock_output)
    }
