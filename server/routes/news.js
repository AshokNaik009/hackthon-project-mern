const express = require('express');
const axios = require('axios');
const router = express.Router();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'd1fsip1r01qig3h3vm00d1fsip1r01qig3h3vm0g';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Simple sentiment analysis based on keywords
function analyzeSentiment(headline, summary) {
  const text = (headline + ' ' + summary).toLowerCase();
  
  const positiveWords = [
    'growth', 'profit', 'gain', 'increase', 'rise', 'up', 'high', 'strong', 'beat', 'exceed',
    'success', 'win', 'positive', 'boost', 'surge', 'rally', 'breakthrough', 'expansion',
    'upgrade', 'bullish', 'outperform', 'record', 'milestone', 'achievement'
  ];
  
  const negativeWords = [
    'loss', 'decline', 'fall', 'drop', 'down', 'low', 'weak', 'miss', 'fail', 'concern',
    'risk', 'negative', 'cut', 'reduce', 'bearish', 'underperform', 'warning', 'crisis',
    'recession', 'bankruptcy', 'lawsuit', 'investigation', 'scandal', 'penalty'
  ];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (text.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (text.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'Positive';
  if (negativeScore > positiveScore) return 'Negative';
  return 'Neutral';
}

// Categorize news based on headline and summary
function categorizeNews(headline, summary) {
  const text = (headline + ' ' + summary).toLowerCase();
  
  if (text.includes('earnings') || text.includes('revenue') || text.includes('profit')) {
    return 'Earnings';
  }
  if (text.includes('partnership') || text.includes('deal') || text.includes('agreement')) {
    return 'Partnerships';
  }
  if (text.includes('merger') || text.includes('acquisition') || text.includes('buyout')) {
    return 'M&A';
  }
  if (text.includes('regulation') || text.includes('sec') || text.includes('fda') || text.includes('government')) {
    return 'Regulatory';
  }
  if (text.includes('dividend') || text.includes('split') || text.includes('buyback')) {
    return 'Corporate Actions';
  }
  if (text.includes('product') || text.includes('launch') || text.includes('innovation')) {
    return 'Product News';
  }
  
  return 'General';
}

// Calculate news impact score based on timing and sentiment
function calculateImpactScore(sentiment, category, datetime) {
  let score = 5; // Base score
  
  // Sentiment impact
  if (sentiment === 'Positive') score += 3;
  else if (sentiment === 'Negative') score += 4; // Negative news often has higher impact
  
  // Category impact
  const highImpactCategories = ['Earnings', 'M&A', 'Regulatory'];
  if (highImpactCategories.includes(category)) score += 3;
  
  // Recency impact (newer news has higher impact)
  const newsDate = new Date(datetime * 1000);
  const now = new Date();
  const hoursOld = (now - newsDate) / (1000 * 60 * 60);
  
  if (hoursOld < 2) score += 2;
  else if (hoursOld < 24) score += 1;
  else if (hoursOld > 168) score -= 2; // Week old news
  
  return Math.max(1, Math.min(10, score));
}

// GET /api/news/company/:symbol - Get company news
router.get('/company/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { from, to, limit = 20 } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Symbol is required'
      });
    }
    
    // Calculate date range (default to last 7 days)
    const toDate = to || new Date().toISOString().split('T')[0];
    const fromDate = from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Fetch company news from Finnhub
    const newsUrl = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${FINNHUB_API_KEY}`;
    const newsResponse = await axios.get(newsUrl);
    
    if (!newsResponse.data || !Array.isArray(newsResponse.data)) {
      return res.status(404).json({
        success: false,
        message: `No news found for ${symbol}`,
        data: []
      });
    }
    
    // Process and analyze news
    const processedNews = newsResponse.data
      .slice(0, parseInt(limit))
      .map(article => {
        const sentiment = analyzeSentiment(article.headline, article.summary);
        const category = categorizeNews(article.headline, article.summary);
        const impactScore = calculateImpactScore(sentiment, category, article.datetime);
        
        return {
          id: article.id,
          headline: article.headline,
          summary: article.summary,
          url: article.url,
          image: article.image,
          source: article.source,
          datetime: article.datetime,
          publishedAt: new Date(article.datetime * 1000).toISOString(),
          sentiment,
          category,
          impactScore,
          priority: impactScore >= 8 ? 'High' : impactScore >= 6 ? 'Medium' : 'Low'
        };
      })
      .sort((a, b) => b.impactScore - a.impactScore); // Sort by impact score
    
    // Calculate summary statistics
    const sentimentStats = {
      positive: processedNews.filter(n => n.sentiment === 'Positive').length,
      negative: processedNews.filter(n => n.sentiment === 'Negative').length,
      neutral: processedNews.filter(n => n.sentiment === 'Neutral').length
    };
    
    const categoryStats = {};
    processedNews.forEach(news => {
      categoryStats[news.category] = (categoryStats[news.category] || 0) + 1;
    });
    
    res.json({
      success: true,
      message: `News retrieved for ${symbol}`,
      data: {
        symbol: symbol.toUpperCase(),
        dateRange: { from: fromDate, to: toDate },
        totalArticles: processedNews.length,
        news: processedNews,
        statistics: {
          sentiment: sentimentStats,
          categories: categoryStats,
          averageImpactScore: processedNews.length > 0 
            ? (processedNews.reduce((sum, n) => sum + n.impactScore, 0) / processedNews.length).toFixed(1)
            : 0
        },
        lastUpdate: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching company news:', error);
    
    if (error.response && error.response.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'API rate limit exceeded. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching company news',
      error: error.message
    });
  }
});

// GET /api/news/market - Get general market news
router.get('/market', async (req, res) => {
  try {
    const { category = 'general', limit = 10 } = req.query;
    
    // Fetch general market news from Finnhub
    const newsUrl = `${FINNHUB_BASE_URL}/news?category=${category}&token=${FINNHUB_API_KEY}`;
    const newsResponse = await axios.get(newsUrl);
    
    if (!newsResponse.data || !Array.isArray(newsResponse.data)) {
      return res.status(404).json({
        success: false,
        message: 'No market news found',
        data: []
      });
    }
    
    // Process market news
    const processedNews = newsResponse.data
      .slice(0, parseInt(limit))
      .map(article => {
        const sentiment = analyzeSentiment(article.headline, article.summary);
        const newsCategory = categorizeNews(article.headline, article.summary);
        const impactScore = calculateImpactScore(sentiment, newsCategory, article.datetime);
        
        return {
          id: article.id,
          headline: article.headline,
          summary: article.summary,
          url: article.url,
          image: article.image,
          source: article.source,
          datetime: article.datetime,
          publishedAt: new Date(article.datetime * 1000).toISOString(),
          sentiment,
          category: newsCategory,
          impactScore,
          priority: impactScore >= 8 ? 'High' : impactScore >= 6 ? 'Medium' : 'Low'
        };
      })
      .sort((a, b) => b.datetime - a.datetime); // Sort by date
    
    res.json({
      success: true,
      message: 'Market news retrieved successfully',
      data: {
        category,
        totalArticles: processedNews.length,
        news: processedNews,
        lastUpdate: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching market news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching market news',
      error: error.message
    });
  }
});

module.exports = router;