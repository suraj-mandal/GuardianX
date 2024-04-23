from sql import show_nearest_places
from helpers import preprocess_text

import json
import logging

from model import Coordinate

from client import ApiGatewayClient


# logger = logging.getLogger()
# logger.setlevel(logging.INFO)

institutions_map = {
    'HOSPITAL': 'hospitals',
    'TRAFFIC_POLICE': 'police stations',
    'FIRE_STATION': 'fire stations'
}

def generate_response_text(list_of_institutions, institution):
    response_text = f"We have identified the closest <b>{institution}</b> near your location. These are: <br>"
    for place in list_of_institutions:
        place_result_string = f'<b>{place.get("name")}</b>' + "<br>"
        place_result_string += f'<b>Address:</b> {place.get("address")}' + "<br>"
        place_result_string += f'<b>Phone Number:</b> <i>{place.get("phone")}</i><br/>'
        place_result_string += f"It is around <b>{round(place.get('distance'), 2)}</b> km away from your location."

        response_text += place_result_string + "<br>"

    return response_text

def lambda_handler(event, context):
    # response_body = json.loads(event.get('body'))

    # insert_dummy_data_into_table()
    chatbot_response_body = json.loads(event.get('body'))

    chatbot_response_text = chatbot_response_body.get('output')
    lat = float(chatbot_response_body.get('lat'))
    lng = float(chatbot_response_body.get('lng'))
    connection_id = chatbot_response_body.get('connection_id')

    print(chatbot_response_text)

    list_of_institutions = preprocess_text(chatbot_response_text)

    my_coordinates = Coordinate(lat, lng)
    # my_coordinates = Coordinate(22.4833, 88.3787)

    # print(list_of_institutions)

    institutions_data = {}

    response_output_list = []

    for institution in list_of_institutions:
        institutions_data[institution] = show_nearest_places(my_coordinates, institution, 3)
        response_output_list.append(generate_response_text(institutions_data[institution], institutions_map[institution]))

    response_output_list.append("<b>We have notified these institutions about your problem. They will be getting back to you shortly.<b>")

    response_text = "<br><br>".join(response_output_list)

    print(institutions_data)

    print(response_text)

    # # TODO: return the list of institutions via mail to the user


    # # TODO: trigger SQS to the mail id of the institutions

    # print(f'Connection ID: {connection_id}')


    # # TODO: use eventbridge to send the response to the backend to the given user
    return {
        'statusCode': 200,
        'body': json.dumps(response_text)
    }
