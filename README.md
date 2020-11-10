TurismRomania
==============
this project was made during BestBucharest's hackathon where we got 3rd place.(this was our first hackathon)    

Tourism Romania    website: https://tourismromania.herokuapp.com

This is a site where you can check the map, visit and review a place, get points and win prizes.

Usage
-----

download the project
install node js: https://nodejs.org/en/ 
install mysql and need to create a database:
then you need to create this tables:

create table users (
id_user  INT Primary key AUTO_INCREMENT,
nume varchar(256),
prenume varchar(256),
mail varchar(256),
password varchar(256),
telefon varchar(256),
puncte int default 0
)

CREATE Table locatii(
id_locatie INT PRIMARY KEY AUTO_INCREMENT,
Oras VARCHAR(256),
titlu_obiectiv VARCHAR(256),
categorie INT,
descriere text,
price VARCHAR(256),
tip VARCHAR(256) Default "Point",
latitude VARCHAR(256),
longitude VARCHAR(256),
link VARCHAR(256),
img VARCHAR(256)
)


create table review(
id_review int Primary key AUTO_INCREMENT,
comentariu text,
rating varchar(256),
id_user int,
id_locatie int,
FOREIGN KEY (id_user) REFERENCES users(id_user),
FOREIGN KEY (id_locatie) REFERENCES locatii(id_locatie)
);


install the packages 

    npm install

    
 Run on local host with:
 
    node app.js
 


What i Learned
-----
* Using Maps and maps api (mapbox)
* How to work with my team and under stress
* Node.js/javascript/html/css/mysql
* hashing passwords, cookie-sessions, login-logout, user interactions.
