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


class ErrorSearchSchema(Schema):
    sort_by = fields.String(validate=[validate.OneOf(['time', 'message', 'type'])])
    sort_order = fields.String(validate=[validate.OneOf(['asc', 'desc'])])
    index = fields.Int(validate=[validate.Range(min=0, max=1000)])
    limit = fields.Int(validate=[validate.Range(min=0, max=1000)])
    start_date = fields.DateTime()
    end_date = fields.DateTime()
    message = fields.String(validate=[validate.Length(min=1, max=1000)])
    type = fields.String(validate=[validate.Length(min=0, max=100)])
