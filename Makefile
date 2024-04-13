all : env run

env :
	source /env/bin/activate
		
run : 
	python3 ./cardle/manage.py runserver 

stop :
	pkill -f runserver