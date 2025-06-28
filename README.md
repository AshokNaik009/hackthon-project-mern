# MERN Hackathon Project

A full-stack MERN (MongoDB, Express.js, React, Node.js) application with TypeScript, Swagger documentation, and Render web service deployment.

## 🚀 Features

- **Backend**: Express.js API with MongoDB integration
- **Frontend**: React with TypeScript served from backend
- **Documentation**: Swagger UI for API documentation
- **Database**: MongoDB Atlas connection
- **Deployment**: Single web service deployment on Render
- **Development**: Hot reload for both frontend and backend

## 📁 Project Structure

```
hackthon-project-mern/
├── client/                 # React frontend
│   ├── src/
│   │   ├── config/         # API configuration
│   │   └── ...
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Database & Swagger config
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── public/             # React build files (auto-generated)
│   ├── .env                # Environment variables
│   └── package.json
└── package.json            # Root package.json
```

## 🛠️ Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hackthon-project-mern
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   
   Update `server/.env`:
   ```env
   PORT=8003
   MONGODB_URI=mongodb+srv://ashok:UsKGxmsHmIqgI8Uw@cluster0.0z6tpsy.mongodb.net/hackthon_project?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This runs:
   - Backend on `http://localhost:8003`
   - Frontend on `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend
- `npm run build-production` - Build frontend and copy to server/public
- `npm run install-all` - Install dependencies for both frontend and backend

## 📚 API Documentation

Once the server is running, visit:
- **Local**: `http://localhost:8003/api-docs`
- **Production**: `https://your-app.onrender.com/api-docs`

## 🗄️ Database

The application connects to MongoDB Atlas with a pre-configured users collection.

### Available Endpoints

- `GET /` - Health check (returns API message)
- `GET /api/users` - Fetch all users
- `GET /api-docs` - Swagger documentation
- `/*` - Serves React app for all other routes

## 🚀 Deployment on Render (Web Service)

### Prerequisites
- GitHub account
- Render.com account
- MongoDB Atlas database

### Deploy Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:

3. **Service Configuration**
   ```
   Name: hackthon-mern-app
   Environment: Node
   Region: Choose closest to you
   Branch: main
   Root Directory: server
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Environment Variables**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://ashok:UsKGxmsHmIqgI8Uw@cluster0.0z6tpsy.mongodb.net/hackthon_project?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_generated_secret_here
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your app

6. **Access Your App**
   - **Full App**: `https://your-service-name.onrender.com`
   - **API Endpoints**: `https://your-service-name.onrender.com/api/users`
   - **API Docs**: `https://your-service-name.onrender.com/api-docs`

### How It Works

This deployment strategy serves both frontend and backend from a single web service:
- **Build Process**: React app builds into `server/public/` folder
- **Static Serving**: Express serves React files from `/public`
- **API Routes**: Available at `/api/*` endpoints
- **React Router**: All non-API routes serve React's `index.html`
- **Single Service**: Everything runs on one Render web service

## 🧪 Testing Database Connection

The frontend automatically tests the database connection by:
1. Fetching from the root API endpoint (`/`)
2. Displaying users from the MongoDB collection (`/api/users`)
3. Showing connection status on the main page

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=8003
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend
No additional environment variables needed - API calls use the same domain in production.

## 📝 Notes

- **Single Service**: Both frontend and backend run on one Render instance
- **Free Tier**: Render's free tier spins down after 15 minutes of inactivity
- **Cold Starts**: First request after spin-down may take 30-60 seconds
- **Database**: MongoDB Atlas has a generous free tier (512MB)
- **SSL**: Render automatically provides HTTPS certificates
- **No CORS Issues**: Frontend and backend share the same domain

## 🛠️ Development Tips

1. **Build Frontend**: Run `npm run build-production` to test the production setup locally
2. **Local Testing**: After building, start only the server to test the full stack
3. **API Testing**: Use Swagger UI for testing endpoints
4. **Database**: Check MongoDB Atlas dashboard for data
5. **Logs**: Use Render dashboard to view deployment logs

## 🚨 Troubleshooting

**Common Issues:**

1. **Build Failed**: Check that `client/build` folder is copied to `server/public`
2. **Static Files Not Loading**: Ensure Express static middleware is before catch-all route
3. **API Routes 404**: Make sure API routes are defined before the catch-all `app.get('*')`
4. **Database Connection**: Verify MongoDB URI and network access

**Debug Commands:**
```bash
# Build and test locally
npm run build-production
cd server && npm start

# Check if backend is running
curl http://localhost:8003

# Check users endpoint
curl http://localhost:8003/api/users

# Check if React app loads
curl http://localhost:8003
```

**File Structure After Build:**
```
server/
├── public/              # React build files
│   ├── index.html       # React entry point
│   ├── static/          # JS, CSS, assets
│   └── ...
├── routes/
├── models/
└── index.js             # Express server
```

## 📄 License

MIT License - see LICENSE file for details.