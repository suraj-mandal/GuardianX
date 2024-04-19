import json

from helpers import generate_dataframe_from_url, create_opensearch_index, update_opensearch_index, \
    get_bucket_and_key_upon_trigger


def lambda_handler(event, context):
    # need to get the trigger here
    bucket, key = get_bucket_and_key_upon_trigger(event)
    # bucket = event.get('bucket')
    # key = event.get('key')

    # # get the dataframe from s3
    print("Getting the dataframe from the s3 bucket")
    df = generate_dataframe_from_url(bucket, key)

    # create index in opensearch
    print("Creating opensearch index")
    create_opensearch_index('emergency-index')

    # save the data in the dataframe to the open search db
    print("Saving the data from the opensearch db")
    update_opensearch_index(df)

    return {
        'statusCode': 200,
        'body': json.dumps('COMPLETED')
    }
