API Endpoints
=============

The ``API`` is documented here.

Feel free to use ``cURL`` and ``python`` to look at formatted json respone. You can
also look at them in your browser, if it handles returned json.

::

    curl http://twipodcast.herokuapp.com | python -m json.tool

Base
----

.. http:get:: /

   Retrieve author and project info

   **Example response**:

   .. sourcecode:: js

      {
        "author": "Sandip Bhagat",
        "author_url": "http://sandipbgt.github.io",
        "base_url": "https://twipodcast.herokuapp.com",
        "project_name": "twipodcast",
        "project_url": "https://github.com/sandipbgt/twipodcast",
        'api': 'https://twipodcast.herokuapp.com/api'
       }

API Base
--------

.. http:get:: /api

   Retrieve list of api resources.

   **Example response**:

   .. sourcecode:: js

      {
        'soundcloud': 'https://twipodcast.herokuapp.com/api/soundcloud',
        'calls': 'https://twipodcast.herokuapp.com/api/calls',
        'feedback': 'https://twipodcast.herokuapp.com/api/feedback'
      }

Soundcloud
----------

.. http:get:: /api/soundcloud

   Retrieve soundcloud podcaster's username list

   **Example response**:

   .. sourcecode:: js

      {
          "life": [
              "theordinarylife_podcast"
          ],
          "python": [
              "talkpython"
          ],
          "startup": [
              "indiastartupchat",
              "hearstartup",
              "trevorpage-1",
              "twistartups"
          ]
      }

.. http:get:: /api/soundcloud/(string:username)

   Retrive soundcloud user's tracks list

   :param userame: soundcloud username
   :type username: string

   **Example response**:

   .. sourcecode:: js

      {
          "tracks": [
              {
                  "permalink_url": "http://soundcloud.com/talkpython/episode-33-openstack-cloud-computing-built-on-python",
                  "stream_url": "https://api.soundcloud.com/tracks/232430011/stream",
                  "title": "Episode #33: OpenStack: Cloud computing built on Python"
              },
              {
                  "permalink_url": "http://soundcloud.com/talkpython/32-pypyjs-pypy-python-in-your-browser",
                  "stream_url": "https://api.soundcloud.com/tracks/231487315/stream",
                  "title": "#32: PyPy.js - PyPy Python in Your Browser"
              },
              ...
            ]
      }

Calls
-----

.. http:get:: /api/calls/say

   Returns TwiML (Twilio Markup Language) response.

   :query string text: text to be converted to speech
   :query string media_url: url of mp3 file

   **Example response**:

   .. sourcecode:: xml

      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
          <Say voice="alice">Hello world</Say>
          <Play>http://example.com/media_file.mp3</Play>
      </Response>

.. http:post:: /api/calls

   Create a new Twilio call

   :<json string twilio_account_sid: Twilio API account sid
   :<json string twilio_auth_token: Twilio API auth token
   :<json string twilio_to_phone: verified phone number to call
   :<json string twilio_from_phone: your Twilio phone number
   :<json string text: text to be converted to speech
   :<json string media_url: url of mp3 file

   **Example response**:

   .. sourcecode:: js

      {
        "call_id": "CA231fb2e3aba93b69a96178b0848b32d7"
      }

Feedback
--------

.. http:post:: /api/feedback

   Send feedback email to admin

   :<json string full_name: sender's full name
   :<json string email: sender's email
   :<json string message: feedback message

   **Example response**:

   .. sourcecode:: js

      {}