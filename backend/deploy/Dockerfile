# Base image
FROM node:18

## Create app directory
WORKDIR /app

# Copy app files
COPY backend/src ./src
COPY backend/nest-cli.json .
COPY backend/package.json .
COPY backend/yarn.lock .
COPY backend/tsconfig.json .
COPY backend/tsconfig.build.json .


# Install app dependencies
RUN yarn install


# Creates a "dist" folder with the production build
RUN yarn build


## Start the server using the production build
ENTRYPOINT [ "yarn", "start" ]
