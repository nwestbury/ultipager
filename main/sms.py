
import os
from twilio.rest import Client


class SMS():
    def __init__(self, debug=True):
        account_sid = os.environ['TWILIO_ACCOUNT_SID']
        auth_token = os.environ['TWILIO_API_KEY']
        self.phone_number = os.environ['TWILIO_PHONE_NUMBER']
        self.client = Client(account_sid, auth_token)
        self.debug = debug

    def send(self, phone_number, text):
        if self.debug:
            print('Twilio send', phone_number, text)
        else:
            self.client.messages.create(
                to="+1" + phone_number,
                from_=self.phone_number,
                body=text)
