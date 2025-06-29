const express = require('express');
const router = express.Router();
const StockData = require('../models/StockData');

// GET /api/live-transactions - Fallback endpoint for stock data
router.get('/', async (req, res) => {
  try {
    const { market, symbol, limit = 50 } = req.query;
    
    let query = {};
    if (market) query.market = market.toUpperCase();
    if (symbol) query.symbol = symbol.toUpperCase();

    const stockData = await StockData.find(query)
      .sort({ lastUpdate: -1 })
      .limit(parseInt(limit));

    if (stockData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No stock data found',
        data: []
      });
    }

    res.json({
      success: true,
      message: 'Stock data retrieved successfully',
      data: stockData,
      count: stockData.length
    });

  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock data',
      error: error.message
    });
  }
});

// GET /api/live-transactions/markets - Get data by market type
router.get('/markets/:market', async (req, res) => {
  try {
    const { market } = req.params;
    const { limit = 20 } = req.query;

    const stockData = await StockData.find({ 
      market: market.toUpperCase() 
    })
      .sort({ lastUpdate: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      message: `${market.toUpperCase()} market data retrieved`,
      data: stockData,
      count: stockData.length
    });

  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching market data',
      error: error.message
    });
  }
});

// GET /api/live-transactions/symbol/:symbol - Get specific symbol data
router.get('/symbol/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    const stockData = await StockData.findOne({ 
      symbol: symbol.toUpperCase() 
    }).sort({ lastUpdate: -1 });

    if (!stockData) {
      return res.status(404).json({
        success: false,
        message: `No data found for symbol ${symbol.toUpperCase()}`
      });
    }

    res.json({
      success: true,
      message: `Data for ${symbol.toUpperCase()} retrieved`,
      data: stockData
    });

  } catch (error) {
    console.error('Error fetching symbol data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching symbol data',
      error: error.message
    });
  }
});

module.exports = router;