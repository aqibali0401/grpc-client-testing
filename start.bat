@echo off
REM Start gRPC Client HTTP Test Server
REM This server provides HTTP endpoints to test the gRPC microservice

cd /d "%~dp0"
echo Starting gRPC Client HTTP Server...
echo.

node -e "require('ts-node').register(); require('./src/index.ts')"

pause
