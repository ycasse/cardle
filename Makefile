all : env run

env :
	source /env/bin/activate

run : 
	python3 ./cardle/manage.py runserver 0.0.0.0:8001

stop :
	pkill -f runserver