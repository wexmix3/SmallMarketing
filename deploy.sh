#!/bin/bash

# This script helps deploy the customer service AI application to Vercel

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Commit changes
git add vercel.json
git commit -m "Update Vercel configuration to point to customer-service-ai directory"

# Push to GitHub
git push

echo "Changes pushed to GitHub. Vercel should automatically redeploy."
echo "After deployment, visit your Vercel dashboard and click 'Visit' again."
echo "If you still have issues, try manually redeploying from the Vercel dashboard."
