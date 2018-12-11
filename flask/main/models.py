import datetime
from main import db


class Error(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(10000))
    time = db.Column(db.DateTime())
    type = db.Column(db.String(100))
    user_agent = db.Column(db.String(500))
    project_name = db.Column(db.String(120))

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'message': self.message,
            'time': self.time.isoformat(),
            'type': self.type,
            'user_agent': self.user_agent,
        }


class PhoneNumber(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone_number = db.Column(db.String(15))
    name = db.Column(db.String(120))
    project_name = db.Column(db.String(120))

    __table_args__ = (db.UniqueConstraint('phone_number', 'project_name',
                                          name='number_project_uniq'),)
