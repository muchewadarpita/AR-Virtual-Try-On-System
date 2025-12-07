#!/bin/bash

echo "========================================"
echo "AR Virtual Dress Try-On"
echo "========================================"
echo ""
echo "Starting local server..."
echo ""
echo "The app will open at: http://localhost:8000"
echo ""
echo "NOTE: Camera access requires HTTPS in production"
echo "For local testing, your browser may allow HTTP"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "========================================"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Using Python server..."
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Using Python server..."
    python -m http.server 8000
# Check if Node.js is available
elif command -v node &> /dev/null; then
    echo "Using Node.js http-server..."
    npx http-server -p 8000 -c-1
else
    echo ""
    echo "ERROR: Neither Python nor Node.js found!"
    echo "Please install one of them:"
    echo "- Python: https://www.python.org/downloads/"
    echo "- Node.js: https://nodejs.org/"
    echo ""
fi



