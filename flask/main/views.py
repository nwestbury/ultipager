from datetime import datetime
from flask import render_template, jsonify, request
import json
from sqlalchemy.sql import exists, and_
from marshmallow import ValidationError

from main import app, schemas, db
from main.models import Error, PhoneNumber


error_schema = schemas.ErrorSchema()
phone_number_schema = schemas.PhoneNumber()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/<projectname>/error', methods=['POST'])
def post_error(projectname):
    if len(projectname) > 120 or not projectname.isalnum():
        return jsonify({
            'errors': ['project name is too long'],
        }), 400

    json_data = request.get_json()
    if not json_data:
        return jsonify({
            'errors': ['no data'],
        }), 400

    try:
        data, errors = error_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    if errors:
        return jsonify({'errors': errors}), 422

    err = Error(message=data['message'],
                time=datetime.utcnow(),
                type=data['type'],
                user_agent=data['user_agent'],
                project_name=projectname)

    db.session.add(err)
    db.session.commit()

    return jsonify({
        'success': True
    })


@app.route('/<projectname>/add_number', methods=['POST'])
def post_number(projectname):
    if len(projectname) > 120 or not projectname.isalnum():
        return jsonify({
            'errors': ['project name is too long'],
        }), 400

    json_data = request.get_json()
    if not json_data:
        return jsonify({
            'errors': ['no data'],
        }), 400

    print('data', json_data)
    try:
        data, errors = phone_number_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    if errors:
        return jsonify({'errors': errors}), 422

    already_exists = db.session.query(PhoneNumber.query.filter(
            PhoneNumber.project_name == projectname,
            PhoneNumber.phone_number == data['phone_number']
        ).exists()).scalar()

    if already_exists:
        return jsonify({'errors': ['already registered for project']}), 400

    number = PhoneNumber(name=data['name'],
                         phone_number=data['phone_number'],
                         project_name=projectname)

    db.session.add(number)
    db.session.commit()

    return jsonify({
        'success': True
    })


@app.route('/<projectname>/errors', methods=['GET'])
def get_errors(projectname):
    if len(projectname) > 120 or not projectname.isalnum():
        return jsonify({
            'errors': ['project name is too long'],
        }), 400

    # TODO add pagination here
    result = Error.query.filter(Error.project_name == projectname).all()

    return jsonify([e.serialize for e in result])
