FROM nginx:alpine

# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependencies
COPY ./index.html /usr/share/nginx/html/
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Expose port
EXPOSE 5173

# Run frontend
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]