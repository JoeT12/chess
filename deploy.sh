#bin/bash

docker build -f c-auth/Dockerfile -t c-auth:latest .
docker build -f c-engine/Dockerfile -t c-engine:latest .
docker build -f c-game/Dockerfile -t c-game:latest .
docker build -f c-ui/Dockerfile -t c-ui:latest .
docker build -f db/c-db-migrate/Dockerfile -t migration:latest .

helm dependency update ./helm-charts
helm install chess-platform ./helm-charts
