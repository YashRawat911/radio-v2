# Use an official Node.js runtime as a parent image
FROM node:latest

# Install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your app runs
EXPOSE 8080

# Command to run your app
CMD ["node", "index.js"]
