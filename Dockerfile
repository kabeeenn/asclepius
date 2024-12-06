FROM node:18
WORKDIR /app
ENV HOST 0.0.0.0
COPY . .
RUN npm install --only=prod
EXPOSE 8080
CMD ["npm", "run", "start"]