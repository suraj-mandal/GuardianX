from client import BedrockRuntimeClient, OpensearchClient, S3Client
from io import StringIO

import json
import re

import pandas as pd

bedrock = BedrockRuntimeClient().client
opensearch = OpensearchClient().client
s3_client = S3Client().client

INSTITUTIONS = {
    'EMS': 'Hospital',
    'Traffic': 'Traffic Police',
    'Fire': 'Fire Station'
}


def clean_dataframe(df):
    df = df.fillna(0)
    df['Traffic Police'] = df['Traffic Police'].astype(int)
    df['Fire'] = df['Fire'].astype(int)
    df['EMS'] = df['EMS'].astype(int)

    return df


def text_embedding(text):
    body = json.dumps({'inputText': text})
    response = bedrock.invoke_model(body=body, modelId='amazon.titan-embed-text-v1', accept='application/json',
                                    contentType='application/json')
    response_body = json.loads(response.get('body').read())
    embedding = response_body.get('embedding')
    return embedding


def create_opensearch_index(index_name: str, dimension=1536, engine='nmslib',
                            space_type='cosinesimil', name='hnsw',
                            ef_construction=512, m=16, number_of_shards=2, ef_search=512):
    index_body = {
        "mappings": {
            "properties": {
                "nominee_text": {"type": "text"},
                "nominee_vector": {
                    "type": "knn_vector",
                    "dimension": dimension,
                    "method": {
                        "engine": engine,
                        "space_type": space_type,
                        "name": name,
                        "parameters": {"ef_construction": ef_construction, "m": m},
                    },
                },
            }
        },
        "settings": {
            "index": {
                "number_of_shards": number_of_shards,
                "knn.algo_param": {"ef_search": ef_search},
                "knn": True,
            }
        },
    }

    try:
        opensearch.indices.create(index=index_name, body=index_body)
    except Exception as ex:
        print(ex)


def add_document(vector: list, text: str, index_name: str):
    document = {
        'nominee_vector': vector,
        'nominee_text': text
    }

    print('Adding document')
    opensearch.index(index=index_name, body=document)


def clean_string(current_string: str):
    pattern = r'^\d+.'
    return re.sub(pattern, '', current_string).strip()


def process_bedrock_response_for_situations(bedrock_response: str):
    lines = [line for line in bedrock_response.splitlines() if line]
    assert len(lines) > 1
    important_lines = lines[1:]
    return [clean_string(text) for text in important_lines]


def generate_config(max_token_count=4000, stop_sequences=[], temperature=0.1, topP=0.9):
    return {
        'maxTokenCount': max_token_count,
        'stopSequences': stop_sequences,
        'temperature': temperature,
        'topP': topP
    }


def get_related_emergency_situations(emergency_type: str):
    emergency_institution, processed_emergency_type = (token.strip() for token in emergency_type.split(':'))

    institution = INSTITUTIONS.get(emergency_institution)
    # print(institution)

    current_query = f"Please give me 20 terms similar to {processed_emergency_type} which might require attention from {institution}"
    # print(current_query)

    config = generate_config()

    current_body = json.dumps({'inputText': current_query, 'textGenerationConfig': config})

    current_response = bedrock.invoke_model(
        modelId='amazon.titan-text-express-v1',
        body=current_body
    )

    current_response_body = json.loads(current_response.get('body').read())
    results = current_response_body.get('results')[0].get('outputText')

    return process_bedrock_response_for_situations(results)


def generate_semantic_text_for_emergency_situation(current_row):
    institutions_list = []
    if current_row['EMS'] == 1:
        institutions_list.append('Hospital')
    if current_row['Traffic Police'] == 1:
        institutions_list.append('Traffic Police')
    if current_row['Fire'] == 1:
        institutions_list.append('Fire Station')

    institution_help = ", ".join(institutions_list)
    text = f'During {current_row["emergency_type"]}, you should contact {institution_help}'
    return text


def update_opensearch_index(df, index_name='emergency-index'):
    df = clean_dataframe(df)

    updated_df = df.copy(deep=True)

    for index, row in df.iterrows():
        emergency_type = row['emergency_type']
        similar_emergencies = get_related_emergency_situations(emergency_type=emergency_type)
        for similar_emergency in similar_emergencies:
            new_row = {**row, 'emergency_type': similar_emergency}
            updated_df.loc[len(updated_df)] = new_row

    for index, row in updated_df.iterrows():
        updated_df.loc[index, 'text'] = generate_semantic_text_for_emergency_situation(row)

    updated_df = updated_df.assign(embedding=(updated_df['text'].apply(lambda x: text_embedding(x))))

    updated_df.apply(lambda row: add_document(row['embedding'], row['text'], index_name), axis=1)


def generate_dataframe_from_url(bucket: str, key: str):
    s3_object = s3_client.get_object(Bucket=bucket, Key=key)
    s3_data = s3_object.get('Body').read().decode('utf-8')
    df = pd.read_csv(StringIO(s3_data))

    return df


def get_bucket_and_key_upon_trigger(event):
    filtered_events = [record for record in event.get('Records') if record.get('eventName') == 'ObjectCreated:Put']
    assert len(filtered_events) > 0
    filtered_record = filtered_events[0]
    print(f"Filtered record: {filtered_record}")
    bucket_name = filtered_record.get('s3').get('bucket').get('name')
    key = filtered_record.get('s3').get('object').get('key')

    return bucket_name, key
