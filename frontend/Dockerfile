# Stage 1: Build the React application
# We use a Node.js image to install dependencies and build the app.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock first to leverage Docker's build cache.
# If these files don't change, Docker won't re-run yarn install.
COPY package.json yarn.lock ./

# Install project dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy the rest of your application code to the container
COPY . .

# --- Handling Client-Side Environment Variables for React Build ---
# React environment variables starting with REACT_APP_ are baked into the build.
# We'll pass them as build arguments to the Docker build command.
# For example, if you have REACT_APP_API_URL in your .env, define it here as ARG and ENV.
ARG REACT_APP_API_URL_ARG
ENV REACT_APP_API_URL=$REACT_APP_API_URL_ARG

# Google Client ID for OAuth
ARG REACT_APP_GOOGLE_CLIENT_ID_ARG
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID_ARG

# You can add more ARGs and ENVs for other REACT_APP_ variables if needed.
# ARG REACT_APP_ANOTHER_VAR_ARG
# ENV REACT_APP_ANOTHER_VAR=$REACT_APP_ANOTHER_VAR_ARG

# Build the React application for production
# This command will use the REACT_APP_ variables set by ENV commands above.
RUN yarn build

# Stage 2: Serve the React application with Nginx (a lightweight web server)
# We use a very small Nginx image for the final production container.
FROM nginx:alpine

# Copy the built React app from the 'builder' stage to Nginx's serving directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80, which is the default port Nginx listens on.
# Cloud Run will use this to route traffic to your container.
EXPOSE 80

# Command to start Nginx in the foreground.
# 'daemon off;' is important for Docker containers, as they need to keep a process running.
CMD ["nginx", "-g", "daemon off;"]