from datetime import datetime, timedelta
from flask import render_template, jsonify, request, redirect, url_for
from flask_socketio import send
import json
from marshmallow import ValidationError
from sqlalchemy.sql import exists, and_
from sqlalchemy import asc, desc

from main import app, schemas, db, socketio, sms
from main.models import Error, PhoneNumber


error_schema = schemas.ErrorSchema()
error_search_schema = schemas.ErrorSearchSchema()
phone_number_schema = schemas.PhoneNumber()
twilio_service = sms.SMS(debug=True)


@app.route('/')
def index():
    return redirect('/sample', code=302)


@app.route('/<projectname>', methods=['GET'])
@app.route('/<projectname>/errors', methods=['GET'])
@app.route('/<projectname>/settings', methods=['GET'])
@app.route('/<projectname>/<int:errorid>', methods=['GET'])
def project(projectname=None, errorid=None):
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

    r = PhoneNumber.query.filter(PhoneNumber.project_name == projectname).first()
    today = datetime.today()
    grace_time = today - timedelta(seconds=10)

    if r and (not r.last_sent or r.last_sent < grace_time):
        url = f"{request.host_url}{projectname}/{err.id}"

        # SMS messages are limited to 160 chars, so try our best to stay at it
        between = ", a new error was found: "
        sms_limit = 160 - len(url) - len(between)
        name_length = max(0, sms_limit)
        message = f"{r.name[:name_length]}{between}{url}"

        r.last_sent = today
        db.session.commit()

        twilio_service.send(r.phone_number, message)

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
    if data is None:
        return jsonify({'errors': ['No data passed']}), 400

    sort_by = data.get('sort_by', 'time')
    asc_desc = asc if data.get('sort_order') == 'asc' else desc
    limit = data.get('limit', 50)
    offset = data.get('index', 0)
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    message = data.get('message')
    type_ = data.get('type')
    error_id = data.get('error_id')
    order_by = asc_desc(getattr(Error, sort_by))

    q = Error.query.filter(Error.project_name == projectname)
    if start_date:
        q = q.filter(Error.time >= start_date)
    if end_date:
        q = q.filter(Error.time <= end_date)
    if message:
        q = q.filter(Error.message.contains(message))
    if type_:
        q = q.filter(Error.type.contains(type_))
    if error_id:
        q = q.filter(Error.id == error_id)

    result = q\
        .order_by(order_by)\
        .offset(offset)\
        .limit(limit)\
        .all()
    count = q.count()

    return jsonify({
        "errors": [e.serialize for e in result],
        "num_errors": count,
    })


@app.route('/<projectname>/number', methods=['GET'])
def get_number(projectname):
    if len(projectname) > 120 or not projectname.isalnum():
        return jsonify({
            'errors': ['project name is too long'],
        }), 400

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
