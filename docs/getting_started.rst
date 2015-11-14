Getting Started
===============

This document will show you how to get up and running with ``twipodcast``.

Prerequisite
------------

* To run server, you must have ``python3`` and ``pip3`` installed.
* To run frontend app, you must have ``nodejs`` and ``npm`` installed.

Installation
------------

Clone the repository and install the libaries using pip::

    $ git clone https://github.com/sandipbgt/twipodcast.git
    $ cd twipodcast
    $ pip install -r requirements.txt

Configuration
-------------

* Copy and paste the below commands at the end of your ``~/.bashrc`` profile.
* Type ``source ~/.bashrc`` in your terminal to refresh your bash profile.::

    ##################################
    # twipodcast environment variables
    ##################################

    # required: app environment either development or production
    # if set to development, TWIPODCAST_NGROK_URL should also be set
    export TWIPODCAST_ENVIRONMENT="development"

    # optional: soundcloud api base url
    export TWIPODCAST_SOUNDCLOUD_API="https://api.soundcloud.com"

    # optional: soundcloud api client id
    # set this, if you want to listen podcast from soundcloud
    export TWIPODCAST_SOUNDCLOUD_CLIENT_ID="your soundcloud api client id"

    # optional: mailgun server api url
    # set this, if you want to setup feedback page
    export TWIPODCAST_MAILGUN_SERVER="your mailgun server api url"

    # optional: mailgun api key
    export TWIPODCAST_MAILGUN_API_KEY="your mailgun api key"

    # optional: email to field
    export TWIPODCAST_MAIL_TO="your name <your email>"

    # optional: email subject
    export TWIPODCAST_MAIL_SUBJECT="email subject"

    # optional: ngrok server url. visit https://ngrok.com/download for download
    # set this if your environment is set to development
    export TWIPODCAST_NGROK_URL="ngrok server url"

Running
-------

To run the server::

    $ gunicorn -b localhost:5000 app:app

The server will be available at ``http://localhost:5000``

To run the frotend app::

    $ cd frontend-app
    $ npm install
    $ gulp watch

The frontend app will open in your browser automatically
and will be available at ``http://localhost:3000``