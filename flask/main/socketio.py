from flask import render_template, jsonify, request
from flask_socketio import send, emit
from main import socketio


@socketio.on('message')
def handle_json(msg):
    print('Received message: ' + str(msg))
