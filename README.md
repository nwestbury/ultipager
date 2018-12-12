# Quickstart

## Overview
Web server using React, Socket.io, Twilio, python3.7 and Flask

## Depedencies
```
$ sudo pip3 install virtualenv
$ virtualenv --python=python3.7 venv
$ source venv/bin/activate
$ pip3 install -r requirements.txt
```

## Database setup
```
$ flask shell
>>> import main
>>> import main.models
>>> main.db.create_all()
>>> main.db.session.commit()
```

## Secret Setup
```
$ cp secrets.sh.template secrets.sh
$ # create secrets.sh based off of secrets.sh.template
$ vim secrets.sh
$ . ./secrets.sh  # (in flask context)
```

## Compile Static Assets
```
$ cd react-app
$ npm run build
```

## Run Dev Server
```
$ flask run
```

## Seed Data
To create errors run:
```
# To Add an Error
curl -X POST http://localhost:5000/test/add_error -d '{"user_agent":"Chrome", "message": "Division by 0", "type": "MathError"}' -H "Content-Type: application/json"

# To Add/Change a Number
curl -X POST http://localhost:5000/test/add_number -d '{"name": "John Smith", "number":"12345678"}' -H "Content-Type: application/json"

# To Search Errors
curl -X POST http://localhost:5000/test/errors -d '{"sort_by": "time", "limit": 50, "sort_order": "desc", "start_date": "2017-12-11T08:52:34.817Z", "message": "test"}' -H "Content-Type: application/json"
```

## Visit
Go to `http://localhost:5000/test`