# Use official Node.js image as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install next --legacy-peer-deps --force

# Copy the rest of the application code
COPY . .
RUN apk --no-cache add curl
RUN mkdir /etc/cron
ARG BASIC_AUTH_USER
ARG BASIC_AUTH_PASSWORD
ARG PORT
RUN echo "0 0 * * *  curl -s -u $BASIC_AUTH_USER:$BASIC_AUTH_PASSWORD http://localhost:3000/api/v1/sync >> /var/log/script.log" > /etc/cron/crontab
RUN echo "# empty line" >> /etc/cron/crontab

# Init cron
RUN crontab /etc/cron/crontab

# Expose port 4000
EXPOSE  $PORT

# Start the Node.js backend
CMD crond -f | npm run start