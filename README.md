# Sports Gambling Twitter Bot

An AI-powered sports gambling prediction platform that automatically posts daily picks to Twitter.

## Features

- **Advanced Prediction Algorithm**: Uses statistical analysis and machine learning to identify value bets
- **Automated Twitter Posts**: Automatically posts 1-3 picks daily at 9am EST
- **Admin Dashboard**: Manage picks, view performance metrics, and train ML models
- **Database Integration**: PostgreSQL database for storing picks, games, and teams
- **Real-time Sports Data**: Integration with sports data APIs for up-to-date information
- **Authentication**: Secure admin access with NextAuth.js
- **Mobile Responsive**: Fully responsive design for all devices

## Tech Stack

- **Frontend**: React.js, Next.js, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: NextAuth.js
- **Machine Learning**: TensorFlow.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- PostgreSQL database
- Twitter Developer Account (for API access)
- Sports Data API key (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sports-gambling-bot.git
   cd sports-gambling-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   # Twitter API Credentials
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_ACCESS_TOKEN=your_twitter_access_token
   TWITTER_ACCESS_SECRET=your_twitter_access_secret

   # Application Settings
   NEXT_PUBLIC_API_URL=http://localhost:3000/api

   # Security
   CRON_API_KEY=your_secure_cron_api_key
   NEXTAUTH_SECRET=your_nextauth_secret_key

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sports_gambling_bot
   DB_USER=postgres
   DB_PASSWORD=postgres

   # Sports Data API
   API_SPORTS_KEY=your_sports_data_api_key
   ```

4. Initialize the database:
   ```bash
   npm run dev
   ```
   Then visit: `http://localhost:3000/admin/dashboard` and click "Init DB"

### Development

Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Deployment

### Deploying to Vercel

1. Create a Vercel account and install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel
   ```

4. Set up environment variables in the Vercel dashboard:
   - Go to your project settings
   - Add all the environment variables from `.env.production`

5. Set up a PostgreSQL database:
   - You can use Vercel Postgres, Supabase, or any other PostgreSQL provider
   - Update the database connection details in your Vercel environment variables

6. Set up the cron job:
   - Vercel will automatically set up the cron job based on the `vercel.json` configuration
   - The schedule is in UTC time. 14:00 UTC = 9:00 EST.

### Using External Cron Service

Alternatively, you can use an external service like cron-job.org:

1. Create an account at https://cron-job.org
2. Set up a new cron job to call your API endpoint:
   - URL: https://your-domain.com/api/scheduledPicks
   - Method: GET
   - Headers: Add `x-api-key` with your CRON_API_KEY value
   - Schedule: Daily at 9:00 AM EST

## Usage

### Admin Dashboard

Access the admin dashboard at `/admin/dashboard` to:
- Generate picks manually
- View pick history and performance metrics
- Train the machine learning model
- Initialize or reset the database

### Public Pages

- Home page: Information about the bot and how it works
- Recent picks: View recent picks and performance metrics

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sequelize](https://sequelize.org/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Twitter API](https://developer.twitter.com/en/docs/twitter-api)
- [API-Sports](https://api-sports.io/)
