FROM node:11.7

# Create app directory
WORKDIR /app
 
# ENV=LOCAL
# DATABASE_HOST=apidb
# DATABASE_PORT=3306
# DATABASE_TYPE=mysql
# DATABASE_USER=admin
# DATABASE_PASSWORD=v4bU_WqHs(RzfuQ+
# DATABASE_SCHEMA=GPE

# Bundle app source
COPY ./ /app/

# Install dependencies
RUN npm install

CMD [ "npm", "start" ]
