const express = require('express');
const router = express.Router();
const cronJobService = require('../services/cronJobs');
const StockData = require('../models/StockData');

// GET /api/admin/cron-status - Get status of cron jobs
router.get('/cron-status', (req, res) => {
  try {
    const status = cronJobService.getJobsStatus();
    res.json({
      success: true,
      message: 'Cron job status retrieved',
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting cron job status',
      error: error.message
    });
  }
});

// POST /api/admin/manual-update - Manually trigger stock data update
router.post('/manual-update', async (req, res) => {
  try {
    const result = await cronJobService.triggerManualUpdate();
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error triggering manual update',
      error: error.message
    });
  }
});

// POST /api/admin/clear-data - Clear all stock data
router.post('/clear-data', async (req, res) => {
  try {
    const stockDataService = require('../services/stockDataService');
    const result = await stockDataService.clearAllOldData();
    
    res.json({
      success: true,
      message: `Successfully cleared ${result.deletedCount} stock records`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing stock data',
      error: error.message
    });
  }
});

// POST /api/admin/update-market - Update specific market data
router.post('/update-market', async (req, res) => {
  try {
    const { market } = req.body;
    
    if (!market || !['USA', 'CRYPTO'].includes(market.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid market type. Must be USA or CRYPTO'
      });
    }

    const stockDataService = require('../services/stockDataService');
    await stockDataService.updateMarketByType(market);
    
    res.json({
      success: true,
      message: `Successfully updated ${market.toUpperCase()} market data`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error updating ${req.body.market} market data`,
      error: error.message
    });
  }
});

// GET /api/admin/data-stats - Get database statistics
router.get('/data-stats', async (req, res) => {
  try {
    const totalRecords = await StockData.countDocuments();
    const usaCount = await StockData.countDocuments({ market: 'USA' });
    const cryptoCount = await StockData.countDocuments({ market: 'CRYPTO' });
    
    const lastUpdate = await StockData.findOne()
      .sort({ lastUpdate: -1 })
      .select('lastUpdate');

    res.json({
      success: true,
      message: 'Database statistics retrieved',
      data: {
        totalRecords,
        marketBreakdown: {
          USA: usaCount,
          CRYPTO: cryptoCount
        },
        lastUpdate: lastUpdate ? lastUpdate.lastUpdate : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting database statistics',
      error: error.message
    });
  }
});

module.exports = router;