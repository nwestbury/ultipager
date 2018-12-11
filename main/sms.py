
import os
from twilio.rest import Client


class SMS():
    def __init__(self):
        account_sid = os.environ['TWILIO_ACCOUNT_SID']
        auth_token = os.environ['TWILIO_API_KEY']
        self.phone_number = os.environ['TWILIO_PHONE_NUMBER']
        self.client = Client(account_sid, auth_token)

    def send(self, phone_number, text):
        message = self.client.messages.create(
            to="+1" + phone_number,
            from_=self.phone_number,
            body=text)
        print('Sending', message.sid)
