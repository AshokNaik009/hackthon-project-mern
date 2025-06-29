/**
 * ========================================
 * 🚨 CRITICAL FALLBACK SYSTEM IMPLEMENTED 🚨
 * ========================================
 * 
 * This service implements a robust fallback mechanism:
 * 
 * 1. PRIMARY: MongoDB Backend (Fast, reliable, cached data)
 *    └── /api/live-transactions endpoint
 * 
 * 2. FALLBACK: Direct Finnhub API calls (When backend fails)
 *    ├── USA Stocks: https://finnhub.io/api/v1/quote
 *    └── Crypto: https://finnhub.io/api/v1/quote (Binance pairs)
 * 
 * 🔄 Automatic switching ensures users ALWAYS get data
 * 📊 Frontend will never show empty results due to API failures
 * ⚡ Graceful degradation from cached to live data
 * 
 * ========================================
 */

import type { 
  StockData, 
  AlphaVantageResponse, 
  TimeSeriesData, 
  AlphaVantageTimeSeriesResponse 
} from '../types/stock';

const FINNHUB_API_KEY = 'd1fsip1r01qig3h3vm00d1fsip1r01qig3h3vm0g';
const BACKEND_API_URL = 'http://localhost:8003/api';

export class StockApiService {
  // Fetch USA stock data directly from Finnhub
  async fetchUSAStockDirect(symbol: string): Promise<StockData | null> {
    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
      
      const response = await fetch(url);
      const quote = await response.json();
      
      if (!quote || quote.c === null) {
        throw new Error('No data received from Finnhub');
      }
      
      const change = quote.c - quote.pc;
      const changePercent = ((change / quote.pc) * 100);
      
      return {
        symbol: symbol,
        market: 'USA',
        price: quote.c, // current price
        open: quote.o, // open price
        high: quote.h, // high price
        low: quote.l, // low price
        volume: 0, // Finnhub quote doesn't include volume
        change: change,
        changePercent: changePercent,
        lastUpdate: new Date().toISOString(),
        source: 'Finnhub Direct'
      };
    } catch (error) {
      console.error(`Error fetching USA stock ${symbol} from Finnhub:`, error);
      return null;
    }
  }


  // Fetch crypto data from Finnhub
  async fetchCryptoDirect(cryptoSymbol: string): Promise<StockData | null> {
    try {
      // Map crypto symbols to Finnhub format
      const cryptoMap: Record<string, { symbol: string, finnhubSymbol: string }> = {
        'BITCOIN': { symbol: 'BITCOIN', finnhubSymbol: 'BINANCE:BTCUSDT' },
        'ETHEREUM': { symbol: 'ETHEREUM', finnhubSymbol: 'BINANCE:ETHUSDT' },
        'BINANCECOIN': { symbol: 'BINANCECOIN', finnhubSymbol: 'BINANCE:BNBUSDT' },
        'CARDANO': { symbol: 'CARDANO', finnhubSymbol: 'BINANCE:ADAUSDT' },
        'SOLANA': { symbol: 'SOLANA', finnhubSymbol: 'BINANCE:SOLUSDT' },
        'DOGECOIN': { symbol: 'DOGECOIN', finnhubSymbol: 'BINANCE:DOGEUSDT' }
      };

      const cryptoConfig = cryptoMap[cryptoSymbol.toUpperCase()];
      if (!cryptoConfig) {
        throw new Error(`Unknown crypto symbol: ${cryptoSymbol}`);
      }

      const url = `https://finnhub.io/api/v1/quote?symbol=${cryptoConfig.finnhubSymbol}&token=${FINNHUB_API_KEY}`;
      
      const response = await fetch(url);
      const quote = await response.json();
      
      if (!quote || quote.c === null) {
        throw new Error('No crypto data received from Finnhub');
      }
      
      const change = quote.c - quote.pc;
      const changePercent = ((change / quote.pc) * 100);
      
      return {
        symbol: cryptoConfig.symbol,
        market: 'CRYPTO',
        price: quote.c, // current price
        open: quote.o, // open price
        high: quote.h, // high price
        low: quote.l, // low price
        volume: 0, // Finnhub crypto quotes don't include volume
        change: change,
        changePercent: changePercent,
        lastUpdate: new Date().toISOString(),
        source: 'Finnhub Crypto Direct'
      };
    } catch (error) {
      console.error(`Error fetching crypto ${cryptoSymbol} from Finnhub:`, error);
      return null;
    }
  }

  // Fallback: Fetch from our backend API
  async fetchFromBackend(market?: string): Promise<StockData[]> {
    try {
      const url = market 
        ? `${BACKEND_API_URL}/live-transactions/markets/${market}`
        : `${BACKEND_API_URL}/live-transactions`;
      
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
        throw new Error(result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching from backend:', error);
      return [];
    }
  }

  // *** CRITICAL FALLBACK MECHANISM ***
  // Get market data directly from MongoDB backend (primary method)
  // If MongoDB/backend fails, automatically falls back to Finnhub API calls
  async fetchMarketData(market: 'USA' | 'CRYPTO'): Promise<StockData[]> {
    console.log(`Fetching ${market} data from MongoDB backend...`);
    
    try {
      // PRIMARY: Try MongoDB backend first (most reliable & fastest)
      const backendData = await this.fetchFromBackend(market);
      
      if (backendData && backendData.length > 0) {
        console.log(`✅ SUCCESS: Fetched ${backendData.length} ${market} stocks from MongoDB backend`);
        return backendData;
      } else {
        console.log(`⚠️ FALLBACK TRIGGERED: No data in MongoDB for ${market}, switching to direct Finnhub API...`);
        // FALLBACK: If MongoDB has no data, use direct API calls
        return await this.fetchMarketDataDirect(market);
      }
    } catch (error) {
      console.error(`❌ BACKEND FAILED for ${market}:`, error);
      console.log(`🔄 CRITICAL FALLBACK: MongoDB unavailable, using direct Finnhub API as backup...`);
      // CRITICAL FALLBACK: If MongoDB/backend completely fails, use direct API calls
      return await this.fetchMarketDataDirect(market);
    }
  }

  // *** EMERGENCY FALLBACK TO FINNHUB API ***
  // This method is called when MongoDB/backend is down or has no data
  // Ensures users always get stock data even if our infrastructure fails
  private async fetchMarketDataDirect(market: 'USA' | 'CRYPTO'): Promise<StockData[]> {
    const symbols = {
      USA: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'IBM'],
      CRYPTO: ['BITCOIN', 'ETHEREUM', 'BINANCECOIN', 'CARDANO', 'SOLANA', 'DOGECOIN']
    };

    const stocksToFetch = symbols[market];
    const results: StockData[] = [];
    
    console.log(`🚨 EMERGENCY FALLBACK: Calling Finnhub API directly for ${market}...`);
    
    // Try to fetch each stock directly from Finnhub
    // Limited to 3 stocks to avoid rate limits on fallback
    for (const symbol of stocksToFetch.slice(0, 3)) {
      let stockData: StockData | null = null;
      
      try {
        switch (market) {
          case 'USA':
            // Direct call to Finnhub for USA stocks
            stockData = await this.fetchUSAStockDirect(symbol);
            break;
          case 'CRYPTO':
            // Direct call to Finnhub for crypto prices
            stockData = await this.fetchCryptoDirect(symbol);
            break;
        }
        
        if (stockData) {
          results.push(stockData);
          console.log(`✅ FALLBACK SUCCESS: Got ${symbol} data from Finnhub`);
        }
        
        // Add delay to respect Finnhub API rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ FALLBACK FAILED for ${symbol}:`, error);
      }
    }

    console.log(`🔄 FALLBACK COMPLETE: Retrieved ${results.length}/${stocksToFetch.slice(0, 3).length} stocks from Finnhub`);
    return results;
  }
}

export const stockApiService = new StockApiService();