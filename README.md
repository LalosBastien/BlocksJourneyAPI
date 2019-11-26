# BlocksJourney API

**<!> 
This was a school project and it is not maintained
<!>**

## Description
BlocksJourney is a video game that aim to educates young generations about computers: a fun approach allows to learn fundamental algorithmic concepts and a final pedagogical monitoring interface to teachers allows evaluation in a school setting.

## Getting Started
<code>npm install</code>
<code>npm start</code>

## Deploy to swarm cluster
```
# create overlay network
docker create network -d overlay --attachable gpe-net
echo "secretpassword" | docker secret create gpe_api_mysql_root -
# build image
docker build -t bastienlalos/gpe-api:latest .
# deploy to docker swarm
docker stack deploy -c docker/docker-compose.yml blocksjourney
