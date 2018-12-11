from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

import os

import main.views


app = Flask(__name__)
FILE_PATH = os.path.dirname(os.path.realpath(__file__))


DB_PATH = os.path.join(FILE_PATH, 'db', 'main.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DB_PATH

db = SQLAlchemy(app)
ma = Marshmallow(app)


# TODO: move these models to seperate files
class Error(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(10000))
    time = db.Column(db.DateTime())
    type = db.Column(db.String(100))
    user_agent = db.Column(db.String(500))


class PhoneNumber(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phonenumber = db.Column(db.String(15))


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--db",
                        help="Setup database models", 
                        action="store_true")
    args = parser.parse_args()

    if args.db:
        db.create_all()
    app.run()
