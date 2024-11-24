docker network create shared_network
docker compose -f docker-compose-dbs.yaml up --build -d
