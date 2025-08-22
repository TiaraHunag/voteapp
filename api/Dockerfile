FROM public.ecr.aws/docker/library/node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
FROM public.ecr.aws/docker/library/node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node","server.js"]
