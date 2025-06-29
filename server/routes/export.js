const express = require('express');
const router = express.Router();
const StockData = require('../models/StockData');

// GET /api/export/all-data - Get all stock data for export
router.get('/all-data', async (req, res) => {
  try {
    const { market, format } = req.query;
    
    let query = {};
    if (market && market !== 'ALL') {
      query.market = market.toUpperCase();
    }

    const stockData = await StockData.find(query)
      .sort({ market: 1, symbol: 1, lastUpdate: -1 });

    if (stockData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No stock data found for export',
        data: []
      });
    }

    // Format data for export (excluding source column)
    const exportData = stockData.map(stock => ({
      Symbol: stock.symbol,
      Market: stock.market,
      Price: stock.price,
      Open: stock.open,
      High: stock.high,
      Low: stock.low,
      Volume: stock.volume,
      Change: stock.change,
      'Change %': stock.changePercent,
      'Last Update': stock.lastUpdate
    }));

    res.json({
      success: true,
      message: `Stock data retrieved for ${format || 'export'}`,
      data: exportData,
      count: exportData.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching export data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching export data',
      error: error.message
    });
  }
});

// GET /api/export/summary - Get summary statistics for export
router.get('/summary', async (req, res) => {
  try {
    const totalRecords = await StockData.countDocuments();
    const usaCount = await StockData.countDocuments({ market: 'USA' });
    const cryptoCount = await StockData.countDocuments({ market: 'CRYPTO' });
    
    const lastUpdate = await StockData.findOne()
      .sort({ lastUpdate: -1 })
      .select('lastUpdate');

    // Get market performance summary
    const usaStocks = await StockData.find({ market: 'USA' });
    const cryptoStocks = await StockData.find({ market: 'CRYPTO' });

    const usaPerformance = {
      totalStocks: usaStocks.length,
      gainers: usaStocks.filter(s => s.changePercent > 0).length,
      losers: usaStocks.filter(s => s.changePercent < 0).length,
      avgChange: usaStocks.length > 0 ? 
        (usaStocks.reduce((sum, s) => sum + s.changePercent, 0) / usaStocks.length).toFixed(2) : 0
    };

    const cryptoPerformance = {
      totalCoins: cryptoStocks.length,
      gainers: cryptoStocks.filter(s => s.changePercent > 0).length,
      losers: cryptoStocks.filter(s => s.changePercent < 0).length,
      avgChange: cryptoStocks.length > 0 ? 
        (cryptoStocks.reduce((sum, s) => sum + s.changePercent, 0) / cryptoStocks.length).toFixed(2) : 0
    };

    res.json({
      success: true,
      message: 'Export summary retrieved',
      data: {
        overview: {
          totalRecords,
          marketBreakdown: {
            USA: usaCount,
            CRYPTO: cryptoCount
          },
          lastUpdate: lastUpdate ? lastUpdate.lastUpdate : null
        },
        performance: {
          usa: usaPerformance,
          crypto: cryptoPerformance
        },
        exportTimestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching export summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching export summary',
      error: error.message
    });
  }
});

module.exports = router;