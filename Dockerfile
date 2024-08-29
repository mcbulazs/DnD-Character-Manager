# Stage 1: Build the Go binary
FROM golang:1.22.6 AS gobuild

WORKDIR /app

COPY backend/go.mod ./
COPY backend/go.sum* ./

RUN go mod download

COPY backend .
COPY dockerbuildfiles/env.go /app/env

RUN CGO_ENABLED=0 GOOS=linux go build -o app

# Stage 2: Build the React app using a Node.js image
FROM node:20.16 AS reactbuild

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npm run build


FROM alpine:latest

# Set the working directory inside the container
WORKDIR /root/

# Copy the Go binary from the builder stage
COPY --from=GoBuild /app/app .

COPY --from=ReactBuild /app/dist files

RUN sed -i 's|/assets|/files/assets|g' files/index.html

EXPOSE 80
# Set the binary as the entrypoint
CMD ["./app"]
