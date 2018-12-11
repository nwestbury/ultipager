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
$ cp secrets.sh.template secrets.sh
$ # create secrets.sh based off of secrets.sh.template
$ vim secrets.sh
$ bash secrets.sh
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

