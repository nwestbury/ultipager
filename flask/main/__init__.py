from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

import os

app = Flask(__name__)
FILE_PATH = os.path.dirname(os.path.realpath(__file__))


DB_PATH = os.path.join(FILE_PATH, 'db', 'main.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DB_PATH

db = SQLAlchemy(app)
ma = Marshmallow(app)

# Must be imported after application is created!
import main.views  # nopep8
import main.models  # nopep8
import main.schemas  # nopep8
