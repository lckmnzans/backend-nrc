FROM node:lts

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    ghostscript \
    graphicsmagick \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

    
WORKDIR /app
COPY . /app
RUN npm install

EXPOSE 8000
CMD ["npm","run","dev"]