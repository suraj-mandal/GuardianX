def preprocess_text(response_text: str):
    response_text = response_text.lower()
    places_list = []
    if 'hospital' in response_text:
        places_list.append('HOSPITAL')

    if 'traffic' in response_text:
        places_list.append('TRAFFIC_POLICE')

    if 'fire' in response_text:
        places_list.append('FIRE_STATION')

    return places_list
