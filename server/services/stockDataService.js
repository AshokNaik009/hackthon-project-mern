const axios = require('axios');
const StockData = require('../models/StockData');

class StockDataService {
  constructor() {
    this.finnhubApiKey = process.env.FINNHUB_API_KEY || 'd1fsip1r01qig3h3vm00d1fsip1r01qig3h3vm0g';
    this.finnhubBaseUrl = 'https://finnhub.io/api/v1';
    this.coinGeckoBaseUrl = 'https://api.coingecko.com/api/v3';
    
    // Popular stock symbols to track
    this.usaStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'IBM'];
    this.cryptoCurrencies = [
      { symbol: 'BITCOIN', finnhubSymbol: 'BINANCE:BTCUSDT' },
      { symbol: 'ETHEREUM', finnhubSymbol: 'BINANCE:ETHUSDT' },
      { symbol: 'BINANCECOIN', finnhubSymbol: 'BINANCE:BNBUSDT' },
      { symbol: 'CARDANO', finnhubSymbol: 'BINANCE:ADAUSDT' },
      { symbol: 'SOLANA', finnhubSymbol: 'BINANCE:SOLUSDT' },
      { symbol: 'DOGECOIN', finnhubSymbol: 'BINANCE:DOGEUSDT' }
    ];
  }

  // Fetch USA stock data from Finnhub
  async fetchUSAStockData(symbol) {
    try {
      const url = `${this.finnhubBaseUrl}/quote?symbol=${symbol}&token=${this.finnhubApiKey}`;
      const response = await axios.get(url);
      
      const quote = response.data;
      if (!quote || quote.c === null) {
        throw new Error(`No data found for symbol ${symbol}`);
      }

      const change = quote.c - quote.pc;
      const changePercent = ((change / quote.pc) * 100);

      const stockData = {
        symbol: symbol,
        market: 'USA',
        price: quote.c, // current price
        open: quote.o, // open price
        high: quote.h, // high price
        low: quote.l, // low price
        volume: 0, // Finnhub quote endpoint doesn't include volume
        change: change,
        changePercent: changePercent,
        lastUpdate: new Date(),
        source: 'Finnhub'
      };

      return stockData;
    } catch (error) {
      console.error(`Error fetching USA stock data for ${symbol}:`, error.message);
      throw error;
    }
  }


  // Fetch crypto currency data from Finnhub
  async fetchCryptoData(cryptoConfig) {
    try {
      const url = `${this.finnhubBaseUrl}/quote?symbol=${cryptoConfig.finnhubSymbol}&token=${this.finnhubApiKey}`;
      const response = await axios.get(url);
      
      const quote = response.data;
      if (!quote || quote.c === null) {
        throw new Error(`No data found for crypto ${cryptoConfig.symbol}`);
      }

      const change = quote.c - quote.pc;
      const changePercent = ((change / quote.pc) * 100);

      const stockData = {
        symbol: cryptoConfig.symbol,
        market: 'CRYPTO',
        price: quote.c, // current price
        open: quote.o, // open price
        high: quote.h, // high price
        low: quote.l, // low price
        volume: 0, // Finnhub crypto quotes don't include volume
        change: change,
        changePercent: changePercent,
        lastUpdate: new Date(),
        source: 'Finnhub Crypto'
      };

      return stockData;
    } catch (error) {
      console.error(`Error fetching crypto data for ${cryptoConfig.symbol}:`, error.message);
      throw error;
    }
  }

  // Clear old data for a specific market
  async clearOldDataByMarket(market) {
    try {
      const result = await StockData.deleteMany({ market: market });
      console.log(`Cleared ${result.deletedCount} old records for ${market} market`);
      return result;
    } catch (error) {
      console.error(`Error clearing old data for ${market}:`, error.message);
      throw error;
    }
  }

  // Clear all old data
  async clearAllOldData() {
    try {
      const result = await StockData.deleteMany({});
      console.log(`Cleared all ${result.deletedCount} old stock records`);
      return result;
    } catch (error) {
      console.error('Error clearing all old data:', error.message);
      throw error;
    }
  }

  // Save or update stock data in database
  async saveStockData(stockData) {
    try {
      const filter = { symbol: stockData.symbol, market: stockData.market };
      const update = { $set: stockData };
      const options = { upsert: true, new: true };

      const result = await StockData.findOneAndUpdate(filter, update, options);
      console.log(`Updated ${stockData.market} data for ${stockData.symbol}`);
      return result;
    } catch (error) {
      console.error(`Error saving stock data for ${stockData.symbol}:`, error.message);
      throw error;
    }
  }

  // Batch save stock data (more efficient for multiple records)
  async batchSaveStockData(stockDataArray) {
    try {
      const operations = stockDataArray.map(stockData => ({
        updateOne: {
          filter: { symbol: stockData.symbol, market: stockData.market },
          update: { $set: stockData },
          upsert: true
        }
      }));

      const result = await StockData.bulkWrite(operations);
      console.log(`Batch updated ${result.upsertedCount + result.modifiedCount} records`);
      return result;
    } catch (error) {
      console.error('Error in batch save:', error.message);
      throw error;
    }
  }

  // Fetch all USA stocks
  async updateUSAStocks() {
    const results = [];
    for (const symbol of this.usaStocks) {
      try {
        const stockData = await this.fetchUSAStockData(symbol);
        const saved = await this.saveStockData(stockData);
        results.push(saved);
        
        // Add delay to avoid API rate limits
        await new Promise(resolve => setTimeout(resolve, 12000)); // 12 seconds delay
      } catch (error) {
        console.error(`Failed to update USA stock ${symbol}:`, error.message);
      }
    }
    return results;
  }


  // Fetch all crypto currencies
  async updateCryptoCurrencies() {
    const results = [];
    for (const cryptoConfig of this.cryptoCurrencies) {
      try {
        const stockData = await this.fetchCryptoData(cryptoConfig);
        const saved = await this.saveStockData(stockData);
        results.push(saved);
        
        // Add delay to be respectful to API limits
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      } catch (error) {
        console.error(`Failed to update crypto ${cryptoConfig.symbol}:`, error.message);
      }
    }
    return results;
  }

  // Update all markets with fresh data (clears old data first)
  async updateAllMarkets() {
    console.log('Starting fresh market data update...');
    const startTime = Date.now();

    try {
      // Clear all old data first to prevent duplicates
      console.log('Clearing old stock data...');
      await this.clearAllOldData();

      // Update crypto first (fastest API)
      console.log('Fetching fresh crypto currencies data...');
      await this.updateCryptoCurrencies();

      // Update USA stocks
      console.log('Fetching fresh USA stocks data...');
      await this.updateUSAStocks();

      const endTime = Date.now();
      console.log(`Fresh market data update completed in ${(endTime - startTime) / 1000} seconds`);
    } catch (error) {
      console.error('Error updating market data:', error.message);
    }
  }

  // Update markets individually (for selective updates)
  async updateMarketByType(marketType) {
    console.log(`Starting ${marketType} market update...`);
    const startTime = Date.now();

    try {
      // Clear old data for this specific market
      await this.clearOldDataByMarket(marketType.toUpperCase());

      switch (marketType.toUpperCase()) {
        case 'USA':
          await this.updateUSAStocks();
          break;
        case 'CRYPTO':
          await this.updateCryptoCurrencies();
          break;
        default:
          throw new Error(`Unknown market type: ${marketType}`);
      }

      const endTime = Date.now();
      console.log(`${marketType} market update completed in ${(endTime - startTime) / 1000} seconds`);
    } catch (error) {
      console.error(`Error updating ${marketType} market:`, error.message);
      throw error;
    }
  }
}

module.exports = new StockDataService();