# MERN Hackathon Project

A full-stack MERN (MongoDB, Express.js, React, Node.js) application with TypeScript, Swagger documentation, and Render deployment configuration.

## 🚀 Features

- **Backend**: Express.js API with MongoDB integration
- **Frontend**: React with TypeScript
- **Documentation**: Swagger UI for API documentation
- **Database**: MongoDB Atlas connection
- **Deployment**: Ready for Render.com deployment
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
│   ├── .env                # Environment variables
│   └── package.json
├── render.yaml             # Render deployment config
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
- `npm run build` - Build frontend for production
- `npm run install-all` - Install dependencies for both frontend and backend

## 📚 API Documentation

Once the server is running, visit:
- **Local**: `http://localhost:8003/api-docs`
- **Production**: `https://your-api-url.onrender.com/api-docs`

## 🗄️ Database

The application connects to MongoDB Atlas with a pre-configured users collection.

### Available Endpoints

- `GET /` - Health check
- `GET /api/users` - Fetch all users
- `GET /api-docs` - Swagger documentation

## 🚀 Deployment on Render

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

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and deploy both services

3. **Environment Variables**
   
   The `render.yaml` automatically configures:
   - `NODE_ENV=production`
   - `PORT=10000` (Render's default)
   - `MONGODB_URI` (from your database)
   - `JWT_SECRET` (auto-generated)
   - `REACT_APP_API_URL` (auto-linked to backend)

4. **Access Your App**
   - Backend API: `https://hackthon-api.onrender.com`
   - Frontend: `https://hackthon-client.onrender.com`
   - API Docs: `https://hackthon-api.onrender.com/api-docs`

### Manual Deployment (Alternative)

If you prefer manual deployment:

1. **Deploy Backend**
   - Create a new Web Service on Render
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Add environment variables

2. **Deploy Frontend**
   - Create a new Static Site on Render
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`
   - Add `REACT_APP_API_URL` environment variable

## 🧪 Testing Database Connection

The frontend automatically tests the database connection by:
1. Fetching from the root API endpoint
2. Displaying users from the MongoDB collection
3. Showing connection status

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=8003
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend (Render automatically sets)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## 📝 Notes

- **Free Tier**: Render's free tier spins down after 15 minutes of inactivity
- **Cold Starts**: First request after spin-down may take 30-60 seconds
- **Database**: MongoDB Atlas has a generous free tier (512MB)
- **SSL**: Render automatically provides HTTPS certificates

## 🛠️ Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **API Testing**: Use Swagger UI for testing endpoints
3. **Database**: Check MongoDB Atlas dashboard for data
4. **Logs**: Use Render dashboard to view deployment logs
5. **Local Testing**: Test production build locally with `npm run build`

## 🚨 Troubleshooting

**Common Issues:**

1. **Build Failed**: Check dependency versions in package.json
2. **Database Connection**: Verify MongoDB URI and network access
3. **CORS Errors**: Backend includes CORS middleware for all origins
4. **Environment Variables**: Ensure all required variables are set

**Debug Commands:**
```bash
# Check if backend is running
curl http://localhost:8003

# Check users endpoint
curl http://localhost:8003/api/users

# View build output
npm run build
```

## 📄 License

MIT License - see LICENSE file for details.