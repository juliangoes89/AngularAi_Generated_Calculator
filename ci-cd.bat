@echo off
REM CI/CD Script for Angular Calculator App (Windows)
REM This script handles building, testing, and deploying the application

setlocal enabledelayedexpansion

REM Default values
set ENVIRONMENT=production
set REGISTRY=
set TAG=latest
set PUSH_TO_REGISTRY=false

REM Parse command line arguments
:parse_args
if "%1"=="--env" (
    set ENVIRONMENT=%2
    shift
    shift
    goto parse_args
)
if "%1"=="--registry" (
    set REGISTRY=%2
    set PUSH_TO_REGISTRY=true
    shift
    shift
    goto parse_args
)
if "%1"=="--tag" (
    set TAG=%2
    shift
    shift
    goto parse_args
)
if "%1"=="--help" (
    echo Usage: %0 [OPTIONS]
    echo Options:
    echo   --env ENVIRONMENT     Set environment (development^|production^) [default: production]
    echo   --registry REGISTRY   Docker registry URL for pushing images
    echo   --tag TAG            Docker image tag [default: latest]
    echo   --help               Show this help message
    exit /b 0
)
if "%1"=="" goto main
shift
goto parse_args

:main
echo [INFO] Starting CI/CD pipeline for Angular Calculator App
echo [INFO] Environment: %ENVIRONMENT%
echo [INFO] Tag: %TAG%

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [INFO] Node.js version: %NODE_VERSION%

REM Step 1: Install dependencies (if not exist)
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm ci
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        exit /b 1
    )
)

REM Step 2: Run linting
echo [INFO] Running linter...
call npm run lint
if errorlevel 1 (
    echo [WARNING] Linting issues found
)

REM Step 3: Run unit tests
echo [INFO] Running unit tests...
call npm run test:unit
if errorlevel 1 (
    echo [ERROR] Unit tests failed
    exit /b 1
)

REM Step 4: Build application
if "%ENVIRONMENT%"=="production" (
    echo [INFO] Building production Docker image...
    docker build -t angular-calculator:%TAG% .
    if errorlevel 1 (
        echo [ERROR] Failed to build Docker image
        exit /b 1
    )
    
    if "%PUSH_TO_REGISTRY%"=="true" (
        echo [INFO] Tagging image for registry...
        docker tag angular-calculator:%TAG% %REGISTRY%/angular-calculator:%TAG%
        if errorlevel 1 (
            echo [ERROR] Failed to tag image
            exit /b 1
        )
        
        echo [INFO] Pushing image to registry...
        docker push %REGISTRY%/angular-calculator:%TAG%
        if errorlevel 1 (
            echo [ERROR] Failed to push image to registry
            exit /b 1
        )
    )
) else (
    echo [INFO] Building development image...
    docker build -f Dockerfile.dev -t angular-calculator:dev .
    if errorlevel 1 (
        echo [ERROR] Failed to build development Docker image
        exit /b 1
    )
)

echo [INFO] Pipeline completed successfully!
exit /b 0