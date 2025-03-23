# Stage 1: Build the Go binary
FROM golang:latest AS gobuild

WORKDIR /app

COPY go.mod .
COPY go.sum* .

RUN go mod download

COPY . .
COPY docker/env.go env/env.go

RUN CGO_ENABLED=0 GOOS=linux go build -o app

# Stage 2: strip the binary
FROM alpine:latest

WORKDIR /root/

COPY --from=gobuild /app/app .
COPY --from=gobuild /app/files .

COPY files files

EXPOSE 8080

CMD ["./app"]
