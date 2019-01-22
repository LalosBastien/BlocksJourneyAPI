FROM node:11.7

# Create app directory
WORKDIR /app

# Bundle app source
COPY ./ /app/

# Install dependencies
RUN npm install

CMD [ "npm", "start" ]