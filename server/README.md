# MERN Stack Backend Server

A secure Express.js backend server for the MERN stack application with comprehensive API endpoints for stock trading, user management, and real-time data processing.

## 🚀 Features

- **RESTful API** - Complete REST API with proper error handling
- **Security Hardened** - Multiple layers of security protection
- **Real-time Data** - Live stock market data updates via cron jobs
- **MongoDB Integration** - Mongoose ODM with proper data modeling
- **JWT Authentication** - Secure token-based authentication
- **API Documentation** - Swagger/OpenAPI documentation
- **Input Validation** - Comprehensive request validation and sanitization
- **Rate Limiting** - Protection against abuse and DDoS attacks

## 🛡️ Security Features

### Core Security Middleware
- **Helmet.js** - Sets various HTTP headers for security
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **XSS Protection** - Cross-site scripting attack prevention
- **NoSQL Injection Protection** - MongoDB injection attack prevention
- **Parameter Pollution Prevention** - HPP middleware protection
- **Content Security Policy** - CSP headers for XSS protection

### Authentication & Authorization
- **JWT Tokens** - Secure JSON Web Token implementation
- **Password Hashing** - bcryptjs for secure password storage
- **Role-based Access** - Admin and user role separation
- **Token Validation** - Middleware for protected routes

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackthon-project-mern/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   PORT=8003
   MONGODB_URI=mongodb://localhost:27017/hackthon_project
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
server/
├── config/
│   ├── database.js          # MongoDB connection configuration
│   └── swagger.js           # API documentation setup
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validation.js        # Input validation middleware
├── models/
│   └── StockData.js         # MongoDB data models
├── routes/
│   ├── admin.js             # Admin-only endpoints
│   ├── export.js            # Data export functionality
│   ├── fundamentals.js      # Stock fundamentals data
│   ├── liveTransactions.js  # Real-time transaction data
│   ├── news.js              # Financial news endpoints
│   └── users.js             # User management endpoints
├── services/
│   └── cronJobs.js          # Background data fetching jobs
├── public/                  # Static files (React build output)
├── index.js                 # Main server entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)

### Stock Data
- `GET /api/live-transactions` - Get live transaction data
- `GET /api/fundamentals` - Get stock fundamentals
- `GET /api/fundamentals/:symbol` - Get specific stock data

### Admin Operations
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/stocks` - Add stock data (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

### Data Export
- `GET /api/export/csv` - Export data as CSV
- `GET /api/export/json` - Export data as JSON

### News & Information
- `GET /api/news` - Get financial news
- `GET /api/news/latest` - Get latest news updates

## 📖 API Documentation

Interactive API documentation is available at:
```
http://localhost:8003/api-docs
```

The documentation includes:
- Complete endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses

## 🔒 Security Configuration

### Rate Limiting
```javascript
// 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

### CORS Configuration
```javascript
// Development: localhost origins allowed
// Production: Configure with your domain
cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
})
```

### Content Security Policy
```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
})
```

## 🔄 Background Jobs

The server runs automated cron jobs for:
- **Initial Data Fetch** - Populates database with market data
- **Stock Data Updates** - Regular updates of stock prices and metrics

Jobs are configured in `services/cronJobs.js` and start automatically with the server.

## 🛠️ Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build client and copy to server public folder

### Adding New Routes
1. Create route file in `routes/` directory
2. Add route import and mounting in `index.js`
3. Update API documentation in swagger configuration

### Database Models
Models are defined using Mongoose in the `models/` directory. Follow existing patterns for consistency.

## 🚀 Deployment

### Production Environment Variables
```env
PORT=8003
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
JWT_SECRET=your-super-secure-production-jwt-secret
NODE_ENV=production
```

### Security Checklist for Production
- [ ] Update JWT_SECRET to a strong, unique value
- [ ] Configure CORS with your production domain
- [ ] Set up MongoDB with authentication enabled
- [ ] Enable HTTPS/TLS encryption
- [ ] Configure proper firewall rules
- [ ] Set up monitoring and logging
- [ ] Regular security updates for dependencies

### Docker Deployment (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8003
CMD ["npm", "start"]
```

## 🔍 Monitoring & Logging

### Health Check Endpoint
```
GET / - Returns server status and welcome message
```

### Error Handling
- Comprehensive error responses with proper HTTP status codes
- Validation error details for debugging
- Security-focused error messages (no sensitive data exposure)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
1. Check the [API documentation](http://localhost:8003/api-docs)
2. Review this README
3. Open an issue in the repository

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added security hardening and comprehensive documentation