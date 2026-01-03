# Laravel Backend Setup Script

write-host "Starting Backend Setup..." -ForegroundColor Green

# 0. Detect Environment
$phpPath = Get-Command php -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (!$phpPath) {
    # Check common locations
    $commonPaths = @(
        "C:\tools\php\php.exe",
        "C:\xampp\php\php.exe", 
        "C:\Program Files\php\php.exe",
        "C:\ProgramData\chocolatey\bin\php.exe"
    )
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $phpPath = $path
            break
        }
    }
}

if (!$phpPath) {
    write-host "Error: PHP not found in PATH or common locations." -ForegroundColor Red
    write-host "Please install PHP or verify your installation."
    exit 1
}
else {
    write-host "Using PHP at: $phpPath" -ForegroundColor Gray
}

$composerPath = Get-Command composer -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (!$composerPath) {
    # Check common locations
    $commonComposer = @(
        "C:\ProgramData\ComposerSetup\bin\composer.bat",
        "C:\ProgramData\chocolatey\bin\composer.bat",
        "C:\ProgramData\chocolatey\bin\composer.exe"
    )
    foreach ($path in $commonComposer) {
        if (Test-Path $path) {
            $composerPath = $path
            break
        }
    }
}

if (!$composerPath) {
    # Fallback to downloading composer.phar if not found
    write-host "Composer not found. Downloading composer.phar..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri https://getcomposer.org/installer -OutFile composer-setup.php
    & $phpPath composer-setup.php
    Remove-Item composer-setup.php
    $composerPath = "$PWD\composer.phar"
}
else {
    write-host "Using Composer at: $composerPath" -ForegroundColor Gray
}

# 1. Check/Install Composer Dependencies
if (!(Test-Path "backend")) {
    write-host "Creating new Laravel project..." -ForegroundColor Cyan
    # Run composer using the detected PHP (if it's a bat file, it handles php itself, if .phar we need php)
    if ($composerPath -like "*.phar") {
        & $phpPath $composerPath create-project laravel/laravel backend
    }
    else {
        & $composerPath create-project laravel/laravel backend
    }
    
    if (!(Test-Path "backend")) {
        write-host "Failed to create backend project." -ForegroundColor Red
        exit 1
    }
}
else {
    write-host "Backend directory exists. Skipping create-project." -ForegroundColor Yellow
}

# 2. Merge Custom Logic
if (Test-Path "backend_temp") {
    write-host "Merging custom Auth & RBAC logic..." -ForegroundColor Cyan
    Copy-Item -Path "backend_temp\*" -Destination "backend" -Recurse -Force
    write-host "Files merged." -ForegroundColor Green
}

# 3. Install Packages
write-host "Installing Sanctum and Spatie Permissions..." -ForegroundColor Cyan
Set-Location backend

if ($composerPath -like "*.phar") {
    & $phpPath $composerPath require laravel/sanctum spatie/laravel-permission
}
else {
    & $composerPath require laravel/sanctum spatie/laravel-permission
}

# 4. Setup Database
if (!(Test-Path "database/database.sqlite")) {
    New-Item -ItemType File -Path "database/database.sqlite" -Force
    # Update .env
    (Get-Content .env) -replace 'DB_CONNECTION=.*', 'DB_CONNECTION=sqlite' | Set-Content .env
    (Get-Content .env) -replace 'DB_DATABASE=.*', '# DB_DATABASE=laravel' | Set-Content .env
}

# 5. Migrate & Seed
write-host "Running Migrations..." -ForegroundColor Cyan
& $phpPath artisan migrate --seed

write-host "Backend Setup Complete!" -ForegroundColor Green
write-host "Running Server on Port 8000..." -ForegroundColor Yellow
& $phpPath artisan serve
