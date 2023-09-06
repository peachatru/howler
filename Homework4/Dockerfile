# DOCKER COMMANDS FROM: https://semaphoreci.com/community/tutorials/dockerizing-a-node-js-web-application

# FROM: tells Docker what base image to use as a starting point.
FROM node:latest
# Set working directory
# WORKDIR: changes the active directory.
WORKDIR /app

# install node modules
COPY ./package*.json ./

# RUN: executes commands inside the container.
RUN npm install 
RUN npm install --save-dev nodemon
# Copy all files from current directory to working dir in image
COPY . ./

ENV PORT 80

ENTRYPOINT [ "npm", "start"]

# CMD: defines the command to run when the container starts.
# CMD ["npm", "server.js"]
