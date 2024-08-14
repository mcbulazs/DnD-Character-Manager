# Stage 1: Build the Go binary
FROM golang:1.22.6 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the go.mod and go.sum files to the container
COPY go.mod ./
COPY go.sum* ./

# Download dependencies
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o app

# Stage 2: Create a minimal image with the Go binary
FROM alpine:latest

# Set the working directory inside the container
WORKDIR /root/

# Copy the Go binary from the builder stage
COPY --from=builder /app/app .

EXPOSE 80
# Set the binary as the entrypoint
CMD ["./app"]
