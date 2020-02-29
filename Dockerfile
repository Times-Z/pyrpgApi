# ----------------------
# STAGE 1 : NPM 
# ----------------------

    # Image intermédiaire pour les dependences (need python)
    FROM node:13.7.0-slim as builder-node

    # Copie sources VueJs
    WORKDIR /build
    COPY ./package*.json /build/

    # Téléchargement des dépendences
    RUN npm install


# ----------------------
# STAGE 2 : BUILD
# ----------------------

    # Image de départ
    FROM node:13.7.0-alpine

    # Add sqlite package to show sqlite file from docker container
    RUN apk update && apk add sqlite

    # Documentation 
    LABEL maintainer="https://github.com/Crash-Zeus"
    EXPOSE 8080
    
    # Copie des Dépendences
    COPY --from=builder-node /build /app

    # Copying app
    COPY ./server.js /app/server.js
    COPY ./logs /app/logs
    COPY ./db /app/db
    COPY ./functions /app/functions

    # Config du container
    WORKDIR /app
    CMD ["npm", "start"]