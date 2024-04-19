import json
import boto3

import os

sns = boto3.client('sns')

HOSPITAL_TOPIC_ARN = os.environ.get('HOSPITAL_TOPIC_ARN')
POLICE_STATION_TOPIC_ARN = os.environ.get('POLICE_STATION_TOPIC_ARN')
FIRE_STATION_TOPIC_ARN = os.environ.get('FIRE_STATION_TOPIC_ARN')


class UserDetails:

    def process_phone_number(self, phone):
        return f'+91{phone}'

    def __init__(self, email, phone):
        self.email = email
        self.phone = self.process_phone_number(phone)

    @property
    def email(self):
        return self.__email

    @property
    def phone(self):
        return self.__phone

    @email.setter
    def email(self, val):
        self.__email = val

    @phone.setter
    def phone(self, val):
        self.__phone = val


def fetch_user_details(data):
    phone_number = data.get("phone_number").get("S")
    email = data.get("email").get("S")

    return UserDetails(email, phone_number)


def subscribe_via_phone(phone_number: str, topic: str):
    try:
        sns.subscribe(TopicArn=topic, Protocol="sms", Endpoint=phone_number)
    except Exception as ex:
        print(ex)
        print("Phone subscription feature is still not available")


def subscribe_via_email(email: str, topic: str):
    sns.subscribe(TopicArn=topic, Protocol="email", Endpoint=email)


def subscribe_to_hospitals(user):
    subscribe_via_email(user.email, HOSPITAL_TOPIC_ARN)
    subscribe_via_phone(user.phone, HOSPITAL_TOPIC_ARN)


def subscribe_to_fire_stations(user):
    subscribe_via_email(user.email, FIRE_STATION_TOPIC_ARN)
    subscribe_via_phone(user.phone, FIRE_STATION_TOPIC_ARN)


def subscribe_to_police_stations(user):
    subscribe_via_email(user.email, POLICE_STATION_TOPIC_ARN)
    subscribe_via_phone(user.phone, POLICE_STATION_TOPIC_ARN)


def lambda_handler(event, context):
    # now first we need to get the event type
    for record in event.get("Records"):
        event_name = record.get("eventName")
        if event_name == "INSERT":
            # fetch the user details here
            data = record.get("dynamodb").get("NewImage")
            user = fetch_user_details(data)
            # now publish to sns topic
            # subscribing to hospital first
            subscribe_to_hospitals(user)
            subscribe_to_fire_stations(user)
            subscribe_to_police_stations(user)
