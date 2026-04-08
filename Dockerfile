# -------- Build Stage --------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# -------- Production Stage --------
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app ./

# Install curl and cron
RUN apk add --no-cache curl busybox-suid

# Setup cron job for daily bill generation
ARG BASIC_AUTH_USER
ARG BASIC_AUTH_PASSWORD

RUN mkdir -p /etc/cron && \
    echo "0 0 * * * curl -s -u ${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD} http://localhost:3000/api/v1/sync >> /var/log/cron.log 2>&1" > /etc/cron/crontab && \
    echo "" >> /etc/cron/crontab && \
    crontab /etc/cron/crontab

EXPOSE 3000

# Start cron and Next.js together
CMD crond -f -l 8 & npm start