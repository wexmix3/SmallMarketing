# AI Customer Service Assistant - Deployment Guide

This guide provides instructions for deploying the AI Customer Service Assistant to a production environment.

## Prerequisites

Before deploying, ensure you have:

1. A Vercel account for hosting the application
2. A PostgreSQL database (can be hosted on Vercel, Supabase, or another provider)
3. An OpenAI API key for AI capabilities
4. Access to the GitHub repository containing the source code

## Deployment Steps

### 1. Database Setup

#### Option A: Vercel Postgres

1. Log in to your Vercel account
2. Navigate to the Storage tab
3. Click "Create Database"
4. Select PostgreSQL as the database type
5. Choose your preferred region
6. Click "Create"
7. Note the connection details (host, port, database name, username, password)

#### Option B: Supabase

1. Log in to your Supabase account
2. Create a new project
3. Choose your preferred region
4. Note the connection details from the Settings > Database page
5. Create the necessary tables using the provided SQL scripts:
   ```bash
   psql -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE -f src/db/schema.sql
   ```

### 2. Environment Variables

Create the following environment variables in your Vercel project:

```
# Database Configuration
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SSL=true

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Next.js
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Security
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://your-domain.com
```

### 3. Deploying to Vercel

#### Using the Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to your project directory:
   ```bash
   cd path/to/project
   ```

4. Deploy the project:
   ```bash
   vercel
   ```

5. Follow the prompts to link to your Vercel project

6. For production deployment:
   ```bash
   vercel --prod
   ```

#### Using GitHub Integration

1. Push your code to GitHub
2. Log in to your Vercel account
3. Click "Add New" > "Project"
4. Select your GitHub repository
5. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
6. Add the environment variables
7. Click "Deploy"

### 4. Database Migration

After deployment, run the database migration to set up the schema:

1. Connect to your Vercel project:
   ```bash
   vercel env pull .env.production.local
   ```

2. Run the migration script:
   ```bash
   npm run build:ts
   node scripts/setup-db.js
   ```

3. Optionally, load sample data:
   ```bash
   node scripts/setup-db.js --sample-data
   ```

### 5. Custom Domain Setup

1. In your Vercel dashboard, navigate to your project
2. Go to the "Domains" tab
3. Add your custom domain
4. Follow the instructions to configure DNS settings
5. Wait for DNS propagation (may take up to 48 hours)

## Post-Deployment Verification

After deployment, perform these checks to ensure everything is working correctly:

1. Visit your deployed application
2. Log in to the admin dashboard
3. Create a test chatbot configuration
4. Test the chat widget on the demo page
5. Verify API endpoints are responding correctly
6. Check database connections
7. Monitor error logs in the Vercel dashboard

## Monitoring and Maintenance

### Performance Monitoring

1. Set up Vercel Analytics to monitor performance
2. Configure alerts for error spikes or performance degradation
3. Monitor API usage and costs for OpenAI

### Database Maintenance

1. Set up regular database backups
2. Monitor database performance
3. Scale resources as needed based on usage

### Security Updates

1. Regularly update dependencies
2. Monitor for security advisories
3. Conduct periodic security reviews

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify connection strings in environment variables
   - Check network access rules for your database
   - Ensure SSL settings are correct

2. **API Errors**
   - Check OpenAI API key validity
   - Verify rate limits haven't been exceeded
   - Check for changes in the OpenAI API

3. **Deployment Failures**
   - Review build logs in Vercel
   - Check for dependency issues
   - Verify Node.js version compatibility

### Getting Help

If you encounter issues not covered in this guide:

1. Check the project documentation
2. Review Vercel's documentation
3. Contact support at support@example.com

## Scaling Considerations

As your usage grows, consider these scaling strategies:

1. **Database Scaling**
   - Increase database resources
   - Implement connection pooling
   - Consider read replicas for high-traffic scenarios

2. **API Optimization**
   - Implement caching for common queries
   - Optimize token usage for OpenAI
   - Consider batching requests when possible

3. **Frontend Performance**
   - Enable edge caching for static assets
   - Optimize bundle sizes
   - Implement lazy loading for components

## Rollback Procedures

If you need to roll back to a previous version:

1. In the Vercel dashboard, go to your project
2. Navigate to the "Deployments" tab
3. Find the previous working deployment
4. Click the three dots menu and select "Promote to Production"

## Conclusion

Your AI Customer Service Assistant should now be successfully deployed and ready for use. For additional assistance or to report issues, please contact our support team.
