@echo off
echo Deploying AI Customer Service Assistant to Vercel...

REM Add all files to git
git add .

REM Commit changes
git commit -m "Created new Next.js application in root directory for Vercel deployment"

REM Push to GitHub
git push

echo.
echo Changes pushed to GitHub. Vercel should automatically redeploy.
echo.
echo IMPORTANT STEPS:
echo 1. Go to your Vercel dashboard
echo 2. Select the project
echo 3. Go to Settings
echo 4. Under "Build & Development Settings", make sure:
echo    - Framework Preset is set to "Next.js"
echo    - Root Directory is set to "customer-service"
echo 5. Save and trigger a new deployment
echo.

pause
