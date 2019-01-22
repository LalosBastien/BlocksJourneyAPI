FROM node

# Create app directory
WORKDIR /app

# Bundle app source
COPY ./ /app/

# Install dependencies
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
# CMD [ "printenv"]