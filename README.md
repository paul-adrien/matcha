MATCHA:

//mysql
sudo mysql;
CREATE DATABASE IF NOT EXISTS matcha  DEFAULT CHARACTER SET utf8mb4;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
mettre "password: 'password'" dans db.js en dessous de root


//front
cd /matchaFront;
sudo apt install -y nodejs;
npm install;
sudo npm install -g @angular/cli@9.0.0;
ng serve --port 8081

pour enlever l'erreur WDS : ng serve --live-reload=false --port 8081


//back
cd /node_server;
npm install
sudo n stable
/usr/local/bin/node server.js

Après avoir lancer le back:
pour installer la BDD: curl -d '{"password":"AdminMatcha"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/install/db

seed1(1000): curl -d '{"password":"AdminMatcha", "seed":"1000users"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/addSeed

seed2(48): curl -d '{"password":"AdminMatcha", "seed":"48users"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/addSeed

tag: curl -d '{"password":"AdminMatcha", "seed":"tag"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/addSeed