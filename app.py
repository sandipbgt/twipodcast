from urllib.parse import urlparse, urlencode
import json
import os
from flask import Flask, jsonify, url_for, request, make_response
from twilio import TwilioRestException
from twilio.rest import TwilioRestClient
import requests

app = Flask(__name__)

# Configuration
CONFIG = {
    'ENVIRONMENT': os.environ.get('TWIPODCAST_ENVIRONMENT', 'development'),
    'SOUNDCLOUD_API': os.environ.get('TWIPODCAST_SOUNDCLOUD_API', 'https://api.soundcloud.com'),
    'SOUNDCLOUD_CLIENT_ID': os.environ.get('TWIPODCAST_SOUNDCLOUD_CLIENT_ID', None),
    'MAILGUN_SERVER': os.environ.get('TWIPODCAST_MAILGUN_SERVER', None),
    'MAILGUN_API_KEY': os.environ.get('TWIPODCAST_MAILGUN_API_KEY', None),
    'MAIL_TO': os.environ.get('TWIPODCAST_MAIL_TO', None),
    'MAIL_SUBJECT': os.environ.get('TWIPODCAST_MAIL_SUBJECT', None),
    'NGROK_URL': os.environ.get('TWIPODCAST_NGROK_URL', None),
}

# 400 bad request error message
def bad_request(message):
    response = jsonify({'status': 400, 'error': 'bad request',
                        'message': message})
    response.status_code = 400
    return response

# 404 not found error message
def not_found(message):
    response = jsonify({'status': 404, 'error': '404 not found',
                        'message': message})
    response.status_code = 404
    return response

# get user's tracks from soundcloud api
def get_soundcloud_tracks(username):
    response = requests.get(CONFIG['SOUNDCLOUD_API'] + '/users/' + username + '/tracks?client_id=' + CONFIG['SOUNDCLOUD_CLIENT_ID'])
    response.raise_for_status()
    return json.loads(response.text)

# CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

# Main Index
@app.route('/', methods=['GET'])
def get_home():
    return jsonify({
            'author': 'Sandip Bhagat',
            'author_url': 'http://sandipbgt.github.io',
            'base_url': 'https://twipodcast.herokuapp.com',
            'project_name': 'twipodcast',
            'project_url': 'https://github.com/sandipbgt/twipodcast',
            'api': 'https://twipodcast.herokuapp.com/api'
        })

# API Index
@app.route('/api', methods=['GET'])
def get_api_home():
    return jsonify({
            'soundcloud': 'https://twipodcast.herokuapp.com/api/soundcloud',
            'calls': 'https://twipodcast.herokuapp.com/api/calls',
            'feedback': 'https://twipodcast.herokuapp.com/api/feedback'
        })

# get soundcloud users
@app.route('/api/soundcloud/', methods=['GET'])
def get_users():
    users = {
            'startup': [
                'indiastartupchat',
                'hearstartup',
                'trevorpage-1',
                'twistartups',
            ],
            'python': [
                'talkpython',
            ],
            'life': [
                'theordinarylife_podcast',
            ]
        }

    return jsonify(users)

# get soundcloud user's tracks
@app.route('/api/soundcloud/<string:username>', methods=['GET'])
def get_tracks(username):
    tracks = []

    try:
        user_tracks = get_soundcloud_tracks(username)
    except requests.exceptions.HTTPError:
        return not_found('User not found')

    for track in user_tracks:
        track_detail = {
            'title': track['title'],
            'permalink_url': track['permalink_url'],
            'stream_url': track['stream_url']
        }

        tracks.append(track_detail)

    return jsonify({
            'tracks': tracks
            })

# get TwiML response for Twilio Calls API
@app.route('/api/calls/say', methods=['GET', 'POST'])
def say():
    text = request.args.get('text', None)
    if text is None:
        return bad_request('Voice text is required.')

    media_url = request.args.get('media_url', None)
    if media_url is None:
        return bad_request('Media url is required.')

    body ="""<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="alice">{message}</Say>
        <Play>{media_url}</Play>
    </Response>
    """

    response = make_response(body.format(message=text, media_url=media_url))
    response.headers['Content-Type'] = 'text/xml'
    return response

# send podcast to mobile phone via Twilio Calls API
@app.route('/api/calls', methods=['POST'])
def call_phone():
    data = request.get_json(force=True)

    account_sid = data.get('twilio_account_sid', None)
    if account_sid is None:
        return bad_request('Twilio account_sid is required.')

    auth_token = data.get('twilio_auth_token', None)
    if auth_token is None:
        return bad_request('Twilio auth token is required.')

    to_phone = data.get('twilio_to_phone', None)
    if to_phone is None:
        return bad_request('To phone number is required.')

    from_phone = data.get('twilio_from_phone', None)
    if from_phone is None:
        return bad_request('Twilio from phone number is required.')

    text = data.get('text', None)
    if text is None:
        return bad_request('Voice text is required.')

    media_url = data.get('media_url', None)
    if media_url is None:
        return bad_request('Media url is required.')

    if urlparse(media_url).hostname == 'api.soundcloud.com':
        media_url = media_url + '?client_id=' + CONFIG['SOUNDCLOUD_CLIENT_ID']

    if CONFIG['ENVIRONMENT'] == 'development':
        query_params = urlencode({'text': text, 'media_url': media_url})
        url = "%s/api/calls/say?%s" % (CONFIG['NGROK_URL'], query_params)
    else:
        url = url_for('say', text=text, media_url=media_url, _external=True)
    try:
        client = TwilioRestClient(account_sid, auth_token)
        call = client.calls.create(
                url=url,
                to=to_phone,
                from_=from_phone
            )

        return jsonify({
            'call_id': call.sid
        })
    except TwilioRestException as e:
        return bad_request(e.msg)

# email feedback message
@app.route('/api/feedback', methods=['POST'])
def send_feedback():
    data = request.get_json(force=True)

    full_name = data.get('full_name', None)
    if full_name is None:
        return bad_request('Full name is required.')

    email = data.get('email', None)
    if email is None:
        return bad_request('Email is required.')

    message = data.get('message', None)
    if message is None:
        return bad_request('Feedback message is required.')

    requests.post(
        CONFIG['MAILGUN_SERVER'],
        auth=("api", CONFIG['MAILGUN_API_KEY']),
        data={"from": "%s <%s>" % (full_name, email),
              "to": CONFIG['MAIL_TO'],
              "subject": CONFIG['MAIL_SUBJECT'],
              "text": message})

    return jsonify({})

# Fire up our Flask app
if __name__ == '__main__':
    if CONFIG['ENVIRONMENT'] == 'development':
        app.run(debug=True)
    else:
        app.run()