from datetime import datetime
from flask import render_template, jsonify, request, redirect, url_for
import json
from sqlalchemy.sql import exists, and_
from sqlalchemy import asc, desc
from marshmallow import ValidationError
from flask_socketio import send

from main import app, schemas, db, socketio
from main.models import Error, PhoneNumber


error_schema = schemas.ErrorSchema()
error_search_schema = schemas.ErrorSearchSchema()
phone_number_schema = schemas.PhoneNumber()


@app.route('/')
def index():
    return redirect('/sample', code=302)


@app.route('/<projectname>', methods=['GET'])
@app.route('/<projectname>/settings', methods=['GET'])
def project(projectname):
    return render_template('index.html')

@app.route('/<projectname>/add_error', methods=['POST'])
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

    cur_time = datetime.utcnow()
    err = Error(message=data['message'],
                time=cur_time,
                type=data['type'],
                user_agent=data['user_agent'],
                project_name=projectname)

    db.session.add(err)
    db.session.commit()

    socketio.send(err.serialize, namespace='/' + projectname)

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

    try:
        data, errors = phone_number_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    if errors:
        return jsonify({'errors': errors}), 422

    number = PhoneNumber(name=data['name'],
                         phone_number=data['number'],
                         project_name=projectname)

    db.session.query(PhoneNumber).filter(PhoneNumber.project_name == projectname).delete()
    db.session.add(number)
    db.session.commit()

    return jsonify({
        'success': True
    })


@app.route('/<projectname>/errors', methods=['POST'])
def get_errors(projectname):
    if len(projectname) > 120 or not projectname.isalnum():
        return jsonify({
            'errors': ['project name is too long'],
        }), 400

    json_data = request.get_json()
    try:
        data, errors = error_search_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    if errors:
        return jsonify({'errors': errors}), 422

    sort_by = data.get('sort_by', 'time')
    asc_desc = asc if data.get('sort_order') == 'asc' else desc
    limit = data.get('limit', 50)
    offset = data.get('index', 0)
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    message = data.get('message')
    type_ = data.get('type')
    order_by = asc_desc(getattr(Error, sort_by))

    q = Error.query.filter(Error.project_name == projectname)
    if start_date:
        q = q.filter(Error.time >= datetime.fromisoformat(start_date))
    if end_date:
        q = q.filter(Error.time <= datetime.fromisoformat(end_date))
    if message:
        q = q.filter(Error.message.contains(message))
    if type_:
        q = q.filter(Error.message.contains(type_))

    # TODO add pagination here
    result = q\
        .order_by(order_by)\
        .offset(offset)\
        .limit(limit)\
        .all()

    return jsonify([e.serialize for e in result])


@app.route('/<projectname>/number', methods=['GET'])
def get_number(projectname):
    if len(projectname) > 120 or not projectname.isalnum():
        return jsonify({
            'errors': ['project name is too long'],
        }), 400

    # TODO add pagination here
    r = PhoneNumber.query.filter(PhoneNumber.project_name == projectname).first()

    if not r:
        return jsonify({
            'number': '',
            'name': '',
            'success': True,
        })

    return jsonify({
        'number': r.phone_number,
        'name': r.name,
        'success': True
    })
