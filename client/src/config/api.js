// In production, API calls will be served from the same domain
// In development, use localhost:8003
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:8003';

export default API_BASE_URL;