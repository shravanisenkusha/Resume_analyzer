# Step 1: Use Nginx to serve static files
FROM nginx:alpine

# Step 2: Copy production build to Nginx HTML folder
COPY dist /usr/share/nginx/html

# Step 3: Replace default Nginx config for React/Vite SPA routing
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Step 4: Expose port 8080 for Cloud Run
EXPOSE 8080
