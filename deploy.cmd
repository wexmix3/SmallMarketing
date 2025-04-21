@echo off
echo Deploying customer service AI application to Vercel...

REM Make sure we're in the right directory
cd %~dp0

REM Commit changes
git add vercel.json
git commit -m "Update Vercel configuration to point to customer-service-ai directory"

REM Push to GitHub
git push

echo.
echo Changes pushed to GitHub. Vercel should automatically redeploy.
echo After deployment, visit your Vercel dashboard and click 'Visit' again.
echo If you still have issues, try manually redeploying from the Vercel dashboard.
echo.

pause
