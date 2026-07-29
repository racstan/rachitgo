#!/bin/bash

# Start checking from the default Vite port
PORT=5173

# Function to check if a port is busy using `ss` (socket statistics)
is_port_busy() {
    ss -lntu | awk '{print $5}' | grep -E ":$1$" > /dev/null
}

echo "Checking for available ports starting from $PORT..."

# Loop until we find an open port
while is_port_busy $PORT; do
    echo "Port $PORT is busy. Checking next port..."
    PORT=$((PORT + 1))
done

echo "Found available port: $PORT"
echo "Launching development server on port $PORT..."

# Pass the chosen port to vite
npm run dev -- --port $PORT
