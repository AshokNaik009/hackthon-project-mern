const express = require('express');
const axios = require('axios');
const router = express.Router();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'd1fsip1r01qig3h3vm00d1fsip1r01qig3h3vm0g';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Calculate financial health score based on key metrics
function calculateHealthScore(metrics) {
  let score = 50;

  try {
    // P/E Ratio scoring
    if (metrics.peNormalRatio !== null) {
      if (metrics.peNormalRatio > 0 && metrics.peNormalRatio < 15) score += 15;
      else if (metrics.peNormalRatio >= 15 && metrics.peNormalRatio < 25) score += 10;
      else if (metrics.peNormalRatio >= 25 && metrics.peNormalRatio < 35) score += 5;
      else if (metrics.peNormalRatio >= 35) score -= 10;
    } else {
      console.warn('peNormalRatio is null, skipping.'); // Log missing metric
    }

    // ROE scoring
    if (metrics.roe !== null) {
      if (metrics.roe > 20) score += 15;
      else if (metrics.roe > 15) score += 10;
      else if (metrics.roe > 10) score += 5;
      else if (metrics.roe < 5) score -= 10;
    } else {
        console.warn('roe is null, skipping.'); // Log missing metric
    }

    // ROA scoring
    if (metrics.roa !== null) {
      if (metrics.roa > 10) score += 10;
      else if (metrics.roa > 5) score += 5;
      else if (metrics.roa < 2) score -= 5;
    }  else {
        console.warn('roa is null, skipping.'); // Log missing metric
    }

    // Current Ratio scoring
    if (metrics.currentRatio !== null) {
      if (metrics.currentRatio >= 1.5 && metrics.currentRatio <= 3) score += 10;
      else if (metrics.currentRatio >= 1 && metrics.currentRatio < 1.5) score += 5;
      else if (metrics.currentRatio < 1) score -= 15;
      else if (metrics.currentRatio > 5) score -= 5; // Too high might indicate inefficient cash use
    } else {
        console.warn('currentRatio is null, skipping.'); // Log missing metric
    }

    // Debt to Equity scoring
    if (metrics.totalDebt2EquityRatio !== null) {
      if (metrics.totalDebt2EquityRatio < 0.3) score += 10;
      else if (metrics.totalDebt2EquityRatio < 0.6) score += 5;
      else if (metrics.totalDebt2EquityRatio > 1.5) score -= 15;
      else if (metrics.totalDebt2EquityRatio > 1) score -= 10;
    } else {
        console.warn('totalDebt2EquityRatio is null, skipping.'); // Log missing metric
    }

  } catch (error) {
    console.error('Error calculating health score:', error);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

// Get health rating based on score
function getHealthRating(score) {
  if (score >= 80) return { rating: 'Excellent', color: 'green', description: 'Strong financial position' };
  if (score >= 65) return { rating: 'Good', color: 'blue', description: 'Solid fundamentals' };
  if (score >= 50) return { rating: 'Fair', color: 'yellow', description: 'Average performance' };
  return { rating: 'Poor', color: 'red', description: 'Concerning metrics' };
}

// GET /api/fundamentals/metrics/:symbol - Get company financial metrics
// GET /api/fundamentals/metrics/:symbol - Get company financial metrics
router.get('/metrics/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Symbol is required'
      });
    }

    const metricsUrl = `${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;
    const metricsResponse = await axios.get(metricsUrl);

    if (!metricsResponse.data || !metricsResponse.data.metric) {
      return res.status(404).json({
        success: false,
        message: `No fundamental data found for ${symbol}`
      });
    }

    const metrics = metricsResponse.data.metric;

    // Calculate health score with corrected keys
    function calculateHealthScore(metrics) {
      let score = 50;

      try {
        // P/E Ratio
        if (metrics.peTTM !== null) {
          if (metrics.peTTM > 0 && metrics.peTTM < 15) score += 15;
          else if (metrics.peTTM >= 15 && metrics.peTTM < 25) score += 10;
          else if (metrics.peTTM >= 25 && metrics.peTTM < 35) score += 5;
          else if (metrics.peTTM >= 35) score -= 10;
        }

        // ROE
        if (metrics.roeTTM !== null) {
          if (metrics.roeTTM > 20) score += 15;
          else if (metrics.roeTTM > 15) score += 10;
          else if (metrics.roeTTM > 10) score += 5;
          else if (metrics.roeTTM < 5) score -= 10;
        }

        // ROA
        if (metrics.roaTTM !== null) {
          if (metrics.roaTTM > 10) score += 10;
          else if (metrics.roaTTM > 5) score += 5;
          else if (metrics.roaTTM < 2) score -= 5;
        }

        // Current Ratio
        if (metrics.currentRatioAnnual !== null) {
          if (metrics.currentRatioAnnual >= 1.5 && metrics.currentRatioAnnual <= 3) score += 10;
          else if (metrics.currentRatioAnnual >= 1 && metrics.currentRatioAnnual < 1.5) score += 5;
          else if (metrics.currentRatioAnnual < 1) score -= 15;
          else if (metrics.currentRatioAnnual > 5) score -= 5;
        }

        // Debt to Equity
        const debtEquity = metrics['totalDebt/totalEquityAnnual'];
        if (debtEquity !== null) {
          if (debtEquity < 0.3) score += 10;
          else if (debtEquity < 0.6) score += 5;
          else if (debtEquity > 1.5) score -= 15;
          else if (debtEquity > 1) score -= 10;
        }
      } catch (error) {
        console.error('Error calculating health score:', error);
      }

      return Math.max(0, Math.min(100, Math.round(score)));
    }

    // Determine rating
    function getHealthRating(score) {
      if (score >= 80) return { rating: 'Excellent', color: 'green', description: 'Strong financial position' };
      if (score >= 65) return { rating: 'Good', color: 'blue', description: 'Solid fundamentals' };
      if (score >= 50) return { rating: 'Fair', color: 'yellow', description: 'Average performance' };
      return { rating: 'Poor', color: 'red', description: 'Concerning metrics' };
    }

    const healthScore = calculateHealthScore(metrics);
    const healthRating = getHealthRating(healthScore);

    // Format final response
    const formattedData = {
      symbol: symbol.toUpperCase(),
      healthScore,
      healthRating,
      keyRatios: {
        pe: metrics.peTTM || 'N/A',
        pb: metrics.pb || 'N/A',
        roe: metrics.roeTTM || 'N/A',
        roa: metrics.roaTTM || 'N/A',
        debtToEquity: metrics['totalDebt/totalEquityAnnual'] || 'N/A',
        currentRatio: metrics.currentRatioAnnual || 'N/A'
      },
      margins: {
        gross: metrics.grossMarginTTM || 'N/A',
        operating: metrics.operatingMarginTTM || 'N/A',
        net: metrics.netProfitMarginTTM || 'N/A'
      },
      growth: {
        revenue: metrics.revenueGrowthTTMYoy || 'N/A',
        earnings: metrics.epsGrowthTTMYoy || 'N/A'
      },
      lastUpdate: new Date().toISOString()
    };

    res.json({
      success: true,
      message: `Fundamental data retrieved for ${symbol}`,
      data: formattedData
    });

  } catch (error) {
    console.error('Error fetching fundamental data:', error);

    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'API rate limit exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching fundamental data',
      error: error.message
    });
  }
});


// GET /api/fundamentals/company/:symbol - Get company profile
router.get('/company/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Symbol is required'
      });
    }
    
    // Fetch company profile from Finnhub
    const profileUrl = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const profileResponse = await axios.get(profileUrl);
    
    if (!profileResponse.data || !profileResponse.data.name) {
      return res.status(404).json({
        success: false,
        message: `No company profile found for ${symbol}`
      });
    }
    
    const profile = profileResponse.data;
    
    res.json({
      success: true,
      message: `Company profile retrieved for ${symbol}`,
      data: {
        symbol: symbol.toUpperCase(),
        name: profile.name,
        industry: profile.finnhubIndustry,
        sector: profile.ggroup,
        country: profile.country,
        marketCap: profile.marketCapitalization,
        website: profile.weburl,
        logo: profile.logo,
        phone: profile.phone,
        description: profile.description || 'No description available',
        lastUpdate: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company profile',
      error: error.message
    });
  }
});

module.exports = router;