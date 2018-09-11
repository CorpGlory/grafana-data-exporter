# Pull node base image
FROM node:latest

ARG build_path=/var/www
ENV BUILD_PATH=$build_path

# Expose port 80
EXPOSE 8000

VOLUME [ "/var/www/exported" ]

# Copy custom configuration file from the current directory

WORKDIR ${BUILD_PATH}
COPY . ${BUILD_PATH}

RUN npm install
RUN npm run build

# Start up node server
CMD ["npm", "start"]
