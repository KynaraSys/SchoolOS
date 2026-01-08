#!/bin/bash
set -e

# Check and fix APP_KEY if necessary
if [ -z "$APP_KEY" ] || [[ "$APP_KEY" != base64:* ]]; then
    echo "APP_KEY is missing or invalid. Generating a new one..."

    # Source the new key from .env if it was written there, or just rely on artisan to have set it? 
    # key:generate writes to .env file. We might be in a read-only FS or .env might be ephemeral.
    # But key:generate usually updates the .env file. 
    # Wait, in Docker/Render, .env might not exist or be writable in the way we expect if config is via env vars.
    # But usually 'key:generate' writes to .env. 
    # Let's try to capture it or just let it write.
    # If the env var is set in the container (from Render), key:generate updates the .env FILE, but the env VAR takes precedence in Laravel?
    # NO. Env vars take precedence over .env file.
    # So if Render passes a bad APP_KEY env var, Laravel reads THAT, not the .env file we just patched.
    # We must UNSET the bad env var or OVERRIDE it.
    # We can export the new key.
    
    # Generate key and extract it
    NEW_KEY=$(php artisan key:generate --show --no-ansi)
    export APP_KEY="$NEW_KEY"
    echo "Generated new APP_KEY: $APP_KEY"
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Start Apache
echo "Starting Apache..."
exec apache2-foreground
