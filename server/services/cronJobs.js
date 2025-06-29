const cron = require('node-cron');
const stockDataService = require('./stockDataService');

class CronJobService {
  constructor() {
    this.jobs = [];
  }

  // Start the cron job to update stock data every 5 minutes
  startStockDataUpdates() {
    // Run every 5 minutes: '*/5 * * * *'
    // For testing, you can use '*/1 * * * *' for every minute
    const job = cron.schedule('*/5 * * * *', async () => {
      console.log('Running scheduled stock data update...');
      try {
        await stockDataService.updateAllMarkets();
        console.log('Scheduled stock data update completed successfully');
      } catch (error) {
        console.error('Error in scheduled stock data update:', error.message);
      }
    }, {
      scheduled: false, // Don't start immediately
      name: 'stockDataUpdate'
    });

    this.jobs.push(job);
    job.start();
    console.log('Stock data update cron job started - runs every 5 minutes');
    
    return job;
  }

  // Start an initial data fetch job (runs once on startup)
  startInitialDataFetch() {
    // Run once after 30 seconds of server startup
    const job = cron.schedule('30 * * * * *', async () => {
      console.log('Running initial stock data fetch...');
      try {
        await stockDataService.updateAllMarkets();
        console.log('Initial stock data fetch completed');
        // Stop this job after first run
        job.stop();
      } catch (error) {
        console.error('Error in initial stock data fetch:', error.message);
        job.stop();
      }
    }, {
      scheduled: false,
      name: 'initialDataFetch'
    });

    this.jobs.push(job);
    job.start();
    console.log('Initial data fetch scheduled for 30 seconds after startup');
    
    return job;
  }

  // Stop all cron jobs
  stopAllJobs() {
    this.jobs.forEach(job => {
      if (job) {
        job.stop();
      }
    });
    console.log('All cron jobs stopped');
  }

  // Get status of all jobs
  getJobsStatus() {
    return this.jobs.map(job => ({
      name: job.name || 'unnamed',
      running: job.running || false
    }));
  }

  // Manually trigger stock data update
  async triggerManualUpdate() {
    console.log('Manual stock data update triggered...');
    try {
      await stockDataService.updateAllMarkets();
      console.log('Manual stock data update completed');
      return { success: true, message: 'Manual update completed successfully' };
    } catch (error) {
      console.error('Error in manual stock data update:', error.message);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new CronJobService();