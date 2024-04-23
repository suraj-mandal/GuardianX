from client import BedrockRuntimeClient, OpensearchClient

import json

bedrock = BedrockRuntimeClient().client
opensearch = OpensearchClient().client


def text_embedding(text):
    body = json.dumps({'inputText': text})
    response = bedrock.invoke_model(body=body, modelId='amazon.titan-embed-text-v1', accept='application/json',
                                    contentType='application/json')
    response_body = json.loads(response.get('body').read())
    embedding = response_body.get('embedding')
    return embedding


def search_index(vector: list, index_name: str, size=15, k=10):
    document = {
        'size': size,
        '_source': {
            'excludes': ['nominee_vector']
        },
        'query': {
            'knn': {
                'nominee_vector': {
                    'vector': vector,
                    'k': k
                }
            }
        }
    }

    return opensearch.search(body=document, index=index_name)


def create_context(response):
    return '\n'.join(item.get('_source').get('nominee_text') for item in response)


def generate_config(max_token_count=4000, stop_sequences=[], temperature=0.1, topP=0.9):
    return {
        'maxTokenCount': max_token_count,
        'stopSequences': stop_sequences,
        'temperature': temperature,
        'topP': topP
    }


def get_bedrock_response(input_text):
    config = generate_config()
    body = json.dumps({'inputText': input_text, 'textGenerationConfig': config})
    response = bedrock.invoke_model(modelId='amazon.titan-text-express-v1', body=body)
    response_body = json.loads(response.get('body').read())
    results = response_body.get('results')

    return results[0].get('outputText')


def create_augmented_prompt(context: str, query: str):
    return f'Context - {context}.\n\nBased on this context can you answer the following query - {query}'