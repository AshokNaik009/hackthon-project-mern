import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, Activity, Download, FileText, BarChart3, Newspaper, Star, Clock } from 'lucide-react';
import { stockApiService } from '../services/stockApi';
import { exportService } from '../services/exportService';
import { fundamentalsService } from '../services/fundamentalsService';
import type { StockData } from '../types/stock';
import type { FundamentalData, NewsData, NewsArticle } from '../types/fundamentals';

const SharesData = () => {
  const [activeTab, setActiveTab] = useState<'USA' | 'CRYPTO'>('USA');
  const [stockData, setStockData] = useState<Record<string, StockData[]>>({
    USA: [],
    CRYPTO: []
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({
    USA: false,
    CRYPTO: false
  });
  const [lastUpdate, setLastUpdate] = useState<Record<string, string>>({
    USA: '',
    CRYPTO: ''
  });
  const [dataSource, setDataSource] = useState<Record<string, string>>({
    USA: '',
    CRYPTO: ''
  });
  const [exportLoading, setExportLoading] = useState<Record<string, boolean>>({
    csvAll: false,
    csvCurrent: false,
    pdfAll: false,
    pdfCurrent: false
  });
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [fundamentalData, setFundamentalData] = useState<FundamentalData | null>(null);
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [fundamentalsLoading, setFundamentalsLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState('');
const [isModalOpen, setIsModalOpen] = useState(false);
const [aiLoading, setAiLoading] = useState(false);




const fetchAIAnalysis = async () => {
  if (!selectedStock) {
    alert("Please select a stock first.");
    return;
  }

  setAiLoading(true);
  setIsModalOpen(true);


};


  const tabs = [
    { id: 'USA' as const, label: 'USA Stocks', icon: '🇺🇸' },
    { id: 'CRYPTO' as const, label: 'Crypto', icon: '₿' }
  ];

  const fetchMarketData = async (market: 'USA' | 'CRYPTO') => {
    setLoading(prev => ({ ...prev, [market]: true }));
    
    try {
      const data = await stockApiService.fetchMarketData(market);
      setStockData(prev => ({ ...prev, [market]: data }));
      setLastUpdate(prev => ({ ...prev, [market]: new Date().toLocaleTimeString() }));
      
      // Determine data source
      const sources = data.map(item => item.source);
      const hasBackendData = sources.some(source => !source.includes('Direct'));
      const hasDirectData = sources.some(source => source.includes('Direct'));
      
      let sourceLabel = 'Platform Data';
      if (hasBackendData && hasDirectData) {
        sourceLabel = 'Mixed Sources';
      } else if (hasDirectData) {
        sourceLabel = 'External APIs';
      }
      
      setDataSource(prev => ({ 
        ...prev, 
        [market]: sourceLabel
      }));
      
    } catch (error) {
      console.error(`Error fetching ${market} data:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [market]: false }));
    }
  };

  const fetchFundamentals = async (symbol: string) => {
    if (!symbol) return;
    
    setFundamentalsLoading(true);
    try {
      const data = await fundamentalsService.fetchFundamentals(symbol);
      setFundamentalData(data);
    } catch (error) {
      console.error('Error fetching fundamentals:', error);
      setFundamentalData(null);
    } finally {
      setFundamentalsLoading(false);
    }
  };

  const fetchNews = async (symbol: string) => {
    if (!symbol) return;
    
    setNewsLoading(true);
    try {
      const data = await fundamentalsService.fetchCompanyNews(symbol);
      setNewsData(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsData(null);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleStockSelection = (symbol: string) => {
    setSelectedStock(symbol);
    if (symbol) {
      fetchFundamentals(symbol);
      fetchNews(symbol);
    } else {
      setFundamentalData(null);
      setNewsData(null);
    }
  };

  useEffect(() => {
    // Fetch data for active tab on mount and tab change
    fetchMarketData(activeTab);
  }, [activeTab]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        {formatPrice(Math.abs(change))} ({Math.abs(changePercent).toFixed(2)}%)
      </span>
    );
  };

  const getSentimentData = (market: 'USA' | 'CRYPTO') => {
    const data = stockData[market];
    if (!data.length) return { positive: 0, negative: 0, neutral: 0 };
    
    const positive = data.filter(item => item.changePercent > 1).length;
    const negative = data.filter(item => item.changePercent < -1).length;
    const neutral = data.length - positive - negative;
    
    return { positive, negative, neutral };
  };

  // Export functions
  const handleExport = async (format: 'csv' | 'pdf', scope: 'all' | 'current') => {
    const exportKey = `${format}${scope === 'all' ? 'All' : 'Current'}` as keyof typeof exportLoading;
    
    setExportLoading(prev => ({ ...prev, [exportKey]: true }));
    
    try {
      const market = scope === 'all' ? 'ALL' : activeTab;
      
      if (format === 'csv') {
        await exportService.exportToCSV(market);
      } else {
        await exportService.exportToPDF(market);
      }
      
      // Success notification could be added here
      console.log(`Successfully exported ${format.toUpperCase()} for ${market} market`);
      
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
      // Error notification could be added here
      alert(`Failed to export ${format.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExportLoading(prev => ({ ...prev, [exportKey]: false }));
    }
  };

  const renderSentimentAnalysis = () => {
    const allMarkets = ['USA', 'CRYPTO'] as const;
    
    return (
      <div className="mt-8 bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="text-blue-600" size={24} />
            Market Sentiment Analysis
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allMarkets.map(market => {
              const sentiment = getSentimentData(market);
              const total = sentiment.positive + sentiment.negative + sentiment.neutral;
              
              return (
                <div key={market} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    {tabs.find(tab => tab.id === market)?.icon} {market}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-medium">Bullish</span>
                      <span className="text-sm font-semibold">{sentiment.positive}/{total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${total ? (sentiment.positive / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 font-medium">Bearish</span>
                      <span className="text-sm font-semibold">{sentiment.negative}/{total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${total ? (sentiment.negative / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Neutral</span>
                      <span className="text-sm font-semibold">{sentiment.neutral}/{total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-400 h-2 rounded-full" 
                        style={{ width: `${total ? (sentiment.neutral / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const hasValidFundamentalData = (data: FundamentalData | null) => {
    if (!data) return false;
    
    const ratios = data.keyRatios;
    const hasValidRatio = (value: any) => value !== 'N/A' && value !== null && value !== undefined && !isNaN(Number(value));
    
    return hasValidRatio(ratios.pe) || hasValidRatio(ratios.pb) || hasValidRatio(ratios.roe) || 
           hasValidRatio(ratios.roa) || hasValidRatio(ratios.debtToEquity) || hasValidRatio(ratios.currentRatio);
  };

  const renderCompanyFundamentals = () => {
    const currentStocks = stockData[activeTab] || [];
    
    return (
      <div className="mt-8 bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-purple-600" size={24} />
            📊 Company Fundamentals & Health Score
          </h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a stock to analyze:
            </label>
            <select
              value={selectedStock}
              onChange={(e) => handleStockSelection(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a stock...</option>
              {currentStocks.map(stock => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol}
                </option>
              ))}
            </select>
          </div>

          {fundamentalsLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600" size={32} />
              <p className="text-gray-600">Loading fundamental data...</p>
            </div>
          ) : fundamentalData && hasValidFundamentalData(fundamentalData) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  Health Score
                </h3>
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${fundamentalsService.getHealthScoreColor(fundamentalData.healthScore)}`}>
                    {fundamentalData.healthScore}/100
                  </div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium bg-${fundamentalData.healthRating.color}-100 text-${fundamentalData.healthRating.color}-800`}>
                    {fundamentalData.healthRating.rating}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{fundamentalData.healthRating.description}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Financial Ratios</h3>
                <div className="grid grid-cols-2 gap-4">
                  {fundamentalData.keyRatios.pe !== 'N/A' && fundamentalData.keyRatios.pe !== null && (
                    <div className="text-center p-3 bg-white rounded">
                      <div className="text-sm text-gray-600">P/E Ratio</div>
                      <div className="text-lg font-semibold">{fundamentalsService.formatNumber(fundamentalData.keyRatios.pe)}</div>
                    </div>
                  )}
                  {fundamentalData.keyRatios.pb !== 'N/A' && fundamentalData.keyRatios.pb !== null && (
                    <div className="text-center p-3 bg-white rounded">
                      <div className="text-sm text-gray-600">P/B Ratio</div>
                      <div className="text-lg font-semibold">{fundamentalsService.formatNumber(fundamentalData.keyRatios.pb)}</div>
                    </div>
                  )}
                  {fundamentalData.keyRatios.roe !== 'N/A' && fundamentalData.keyRatios.roe !== null && (
                    <div className="text-center p-3 bg-white rounded">
                      <div className="text-sm text-gray-600">ROE</div>
                      <div className="text-lg font-semibold">{fundamentalsService.formatPercentage(fundamentalData.keyRatios.roe)}</div>
                    </div>
                  )}
                  {fundamentalData.keyRatios.roa !== 'N/A' && fundamentalData.keyRatios.roa !== null && (
                    <div className="text-center p-3 bg-white rounded">
                      <div className="text-sm text-gray-600">ROA</div>
                      <div className="text-lg font-semibold">{fundamentalsService.formatPercentage(fundamentalData.keyRatios.roa)}</div>
                    </div>
                  )}
                  {fundamentalData.keyRatios.debtToEquity !== 'N/A' && fundamentalData.keyRatios.debtToEquity !== null && (
                    <div className="text-center p-3 bg-white rounded">
                      <div className="text-sm text-gray-600">Debt/Equity</div>
                      <div className="text-lg font-semibold">{fundamentalsService.formatNumber(fundamentalData.keyRatios.debtToEquity)}</div>
                    </div>
                  )}
                  {fundamentalData.keyRatios.currentRatio !== 'N/A' && fundamentalData.keyRatios.currentRatio !== null && (
                    <div className="text-center p-3 bg-white rounded">
                      <div className="text-sm text-gray-600">Current Ratio</div>
                      <div className="text-lg font-semibold">{fundamentalsService.formatNumber(fundamentalData.keyRatios.currentRatio)}</div>
                    </div>
                  )}
                  <button
  onClick={fetchAIAnalysis}
  disabled={aiLoading || !selectedStock}
  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
>
  {aiLoading ? (
    <span className="flex items-center">
      <RefreshCw className="animate-spin mr-2" size={16} />
      Fetching Analysis...
    </span>
  ) : (
    '📈 Get AI Analysis'
  )}
</button>
                </div>
              </div>
            </div>
          ) : selectedStock ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600">No fundamental data available for {selectedStock}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600">Select a stock to view fundamental analysis</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNewsAnalysis = () => {
    return (
      <div className="mt-8 bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Newspaper className="text-orange-600" size={24} />
            📰 News & Market Impact Analysis
          </h2>
        </div>
        
        <div className="p-6">
          {!selectedStock ? (
            <div className="text-center py-8">
              <Newspaper className="mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600">Select a stock to view news analysis</p>
            </div>
          ) : newsLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto mb-4 text-orange-600" size={32} />
              <p className="text-gray-600">Loading news analysis...</p>
            </div>
          ) : newsData ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{newsData.totalArticles}</div>
                  <div className="text-sm text-gray-600">Total Articles</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {newsData.dateRange.from} to {newsData.dateRange.to}
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{newsData.statistics.averageImpactScore}</div>
                  <div className="text-sm text-gray-600">Avg Impact Score</div>
                  <div className="text-xs text-gray-500 mt-1">Out of 10</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Sentiment Distribution</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600">Positive: {newsData.statistics.sentiment.positive}</span>
                      <span className="text-red-600">Negative: {newsData.statistics.sentiment.negative}</span>
                    </div>
                    <div className="text-xs text-gray-600">Neutral: {newsData.statistics.sentiment.neutral}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {newsData.news.map((article) => (
                  <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {article.headline}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {article.summary}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${fundamentalsService.getSentimentColor(article.sentiment)}`}>
                            {article.sentiment}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${fundamentalsService.getPriorityColor(article.priority)}`}>
                            {article.priority} Impact
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {article.image && (
                        <img 
                          src={article.image} 
                          alt="" 
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">{article.source}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Impact Score:</span>
                        <span className="text-sm font-semibold">{article.impactScore}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600">No news data available for {selectedStock}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Live Market Data</h1>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Data Source and Actions */}
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Data Source: 
                <span className={`ml-1 font-semibold ${
                  dataSource[activeTab]?.includes('Platform') ? 'text-green-600' : 
                  dataSource[activeTab]?.includes('External') ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {dataSource[activeTab] || 'Loading...'}
                </span>
              </span>
              {lastUpdate[activeTab] && (
                <span className="text-sm text-gray-500">
                  Last Updated: {lastUpdate[activeTab]}
                </span>
              )}
            </div>
            
            <button
              onClick={() => fetchMarketData(activeTab)}
              disabled={loading[activeTab]}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw 
                size={16} 
                className={loading[activeTab] ? 'animate-spin' : ''} 
              />
              Refresh
            </button>
          </div>

          {/* Export Controls */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Export:</span>
              
              {/* CSV Export Buttons */}
              <button
                onClick={() => handleExport('csv', 'current')}
                disabled={exportLoading.csvCurrent}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exportLoading.csvCurrent ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Download size={12} />
                )}
                CSV ({activeTab})
              </button>
              
              <button
                onClick={() => handleExport('csv', 'all')}
                disabled={exportLoading.csvAll}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exportLoading.csvAll ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Download size={12} />
                )}
                CSV (All)
              </button>

              {/* PDF Export Buttons */}
              <button
                onClick={() => handleExport('pdf', 'current')}
                disabled={exportLoading.pdfCurrent}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exportLoading.pdfCurrent ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <FileText size={12} />
                )}
                PDF ({activeTab})
              </button>
              
              <button
                onClick={() => handleExport('pdf', 'all')}
                disabled={exportLoading.pdfAll}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-700 text-white rounded hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exportLoading.pdfAll ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <FileText size={12} />
                )}
                PDF (All)
              </button>
            </div>
          </div>
        </div>

        {/* Stock Data Table */}
        <div className="p-6">
          {loading[activeTab] ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
              <p className="text-gray-600">Loading {activeTab} market data...</p>
            </div>
          ) : stockData[activeTab].length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">High</th>
                    <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Low</th>
                    <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stockData[activeTab].map((stock) => (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="py-4 text-sm font-semibold text-gray-900">{stock.symbol}</td>
                      <td className="py-4 text-sm text-gray-900">{formatPrice(stock.price)}</td>
                      <td className="py-4 text-sm">{formatChange(stock.change, stock.changePercent)}</td>
                      <td className="py-4 text-sm text-gray-900">{formatPrice(stock.high)}</td>
                      <td className="py-4 text-sm text-gray-900">{formatPrice(stock.low)}</td>
                      <td className="py-4 text-sm text-gray-900">{stock.volume.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600">No data available for {activeTab} market</p>
              <button
                onClick={() => fetchMarketData(activeTab)}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sentiment Analysis */}
      {renderSentimentAnalysis()}

      {/* Company Fundamentals & Health Score */}
      {renderCompanyFundamentals()}

      {/* News & Market Impact Analysis */}
      {renderNewsAnalysis()}

     {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-4 text-gray-600 hover:text-gray-900"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-4 text-gray-800">📈 AI Investment Analysis</h2>

      {aiLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin text-blue-600 text-3xl mb-2">⏳</div>
          <p className="text-gray-600">Generating AI insights...</p>
        </div>
      ) : (
        <>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">
            {aiAnalysis.replace(/\*\*/g, "")}
          </pre>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              fontSize: "10px",
              color: "rgba(0,0,0,0.2)",
              pointerEvents: "none",
              userSelect: "none",
              fontWeight: "bold",
            }}
          >
            This is AI analysis, don't use this as investment advice.
          </div>
        </>
      )}
    </div>
  </div>
)}


    </div>
  );
};

export default SharesData;