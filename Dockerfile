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
COPY dockerbuildfiles/env.ts /app/src/env.ts

RUN npm run build

COPY dockerbuildfiles/rename.sh /app/rename.sh
RUN /app/rename.sh

FROM alpine:latest

# Set the working directory inside the container
WORKDIR /root/

# Copy the Go binary from the builder stage
COPY --from=GoBuild /app/app .

COPY --from=ReactBuild /app/dist files



EXPOSE 80
# Set the binary as the entrypoint
CMD ["./app"]
