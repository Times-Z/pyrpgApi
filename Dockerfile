# ----------------------
# STAGE 1 : NPM 
# ----------------------

    # Image intermédiaire pour les dependences
    FROM node:13.7.0-alpine as builder-node

    # Copie sources VueJs
    WORKDIR /build
    COPY ./package*.json /build

    # Téléchargement des dépendences
    RUN npm install


# ----------------------
# STAGE 2 : BUILD
# ----------------------

    # Image de départ
    FROM node:13.7.0-alpine

    # Documentation 
    LABEL maintainer="https://github.com/Crash-Zeus"
    EXPOSE 8080
    
    # Copie des Dépendences
    COPY --from=builder-node /build /app

    # Config du container
    WORKDIR /app
    CMD ["npm", "start"]