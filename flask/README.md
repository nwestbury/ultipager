# Quickstart

## Overview
Web server using python3.7 and Flask

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
$ # create secrets.sh based off of secrets.sh.template
$ bash secrets.sh
```

## Run Dev Server
```
$ python -m flask
```
