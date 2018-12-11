from marshmallow import Schema, fields, validate, ValidationError

from main import ma
from main import models


def isnumeric(string):
    if not string.isdigit():
        raise ValidationError('Must be only numbers')


class ErrorSchema(Schema):
    message = fields.String(required=True,
                            validate=[validate.Length(min=1, max=10000)])
    time = fields.DateTime()
    type = fields.String(required=True,
                         validate=[validate.Length(min=0, max=100)])
    user_agent = fields.String(required=True,
                               validate=[validate.Length(min=0, max=500)])


class PhoneNumber(Schema):
    phone_number = fields.String(required=True,
                                 validate=[validate.Length(min=7, max=15),
                                           isnumeric])
    name = fields.String(required=True,
                         validate=[validate.Length(min=1, max=120)])
