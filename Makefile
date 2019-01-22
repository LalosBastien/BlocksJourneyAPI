install: ;\
  npm install

quality: ;\
  npm test

run: ;\
  npm start

leave: ;\
	docker swarm leave --force

init: ;\
	docker swarm init

build: ;\
  docker build -t api .

deploy: ;\
  docker stack deploy -c docker/stack/docker-compose.local.yml gpe