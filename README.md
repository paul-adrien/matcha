pour installer la BDD: curl -d '{"password":"AdminMatcha"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/install/db
seed1: curl -d '{"password":"AdminMatcha", "seed":"1000users"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/addSeed
seed2: curl -d '{"password":"AdminMatcha", "seed":"48users"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/addSeed
tag: curl -d '{"password":"AdminMatcha", "seed":"tag"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/addSeed