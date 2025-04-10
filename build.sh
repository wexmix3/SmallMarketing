#!/bin/bash

# Copy the Vercel-specific package.json
cp package.json.vercel package.json

# Install Next.js and React explicitly
npm install next@13.4.19 react@18.2.0 react-dom@18.2.0

# Run the Next.js build
npx next build
