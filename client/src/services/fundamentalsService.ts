import type { FundamentalData, CompanyProfile, NewsData } from '../types/fundamentals';

const BACKEND_API_URL = 'http://localhost:8003/api';

export class FundamentalsService {
  // Fetch company fundamental metrics
  async fetchFundamentals(symbol: string): Promise<FundamentalData | null> {
    try {
      const url = `${BACKEND_API_URL}/fundamentals/metrics/${symbol}`;
      console.log('Fetching fundamentals for:', symbol);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`No fundamental data found for ${symbol}`);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch fundamental data');
      }
    } catch (error) {
      console.error(`Error fetching fundamentals for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch company profile
  async fetchCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
    try {
      const url = `${BACKEND_API_URL}/fundamentals/company/${symbol}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`No company profile found for ${symbol}`);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch company profile');
      }
    } catch (error) {
      console.error(`Error fetching company profile for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch company news
  async fetchCompanyNews(symbol: string, days: number = 7): Promise<NewsData | null> {
    try {
      const toDate = new Date().toISOString().split('T')[0];
      const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const url = `${BACKEND_API_URL}/news/company/${symbol}?from=${fromDate}&to=${toDate}&limit=15`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`No news found for ${symbol}`);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch company news');
      }
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch market news
  async fetchMarketNews(category: string = 'general', limit: number = 10) {
    try {
      const url = `${BACKEND_API_URL}/news/market?category=${category}&limit=${limit}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch market news');
      }
    } catch (error) {
      console.error('Error fetching market news:', error);
      return null;
    }
  }

  // Format number for display
  formatNumber(value: number | string): string {
    if (value === 'N/A' || value === null || value === undefined) return 'N/A';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'N/A';
    
    return num.toFixed(2);
  }

  // Format percentage for display
  formatPercentage(value: number | string): string {
    if (value === 'N/A' || value === null || value === undefined) return 'N/A';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'N/A';
    
    return `${num.toFixed(2)}%`;
  }

  // Format market cap for display
  formatMarketCap(value: number): string {
    if (!value) return 'N/A';
    
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  }

  // Get health score color
  getHealthScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }

  // Get sentiment color
  getSentimentColor(sentiment: 'Positive' | 'Negative' | 'Neutral'): string {
    switch (sentiment) {
      case 'Positive': return 'text-green-600 bg-green-100';
      case 'Negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  // Get priority color
  getPriorityColor(priority: 'High' | 'Medium' | 'Low'): string {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
}

export const fundamentalsService = new FundamentalsService();