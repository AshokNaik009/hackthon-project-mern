const mongoose = require('mongoose');

const StockDataSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  market: {
    type: String,
    required: true,
    enum: ['USA', 'BSE', 'CRYPTO']
  },
  price: {
    type: Number,
    required: true
  },
  open: {
    type: Number,
    required: true
  },
  high: {
    type: Number,
    required: true
  },
  low: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  changePercent: {
    type: Number,
    default: 0
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

StockDataSchema.index({ symbol: 1, market: 1 }, { unique: true });
StockDataSchema.index({ lastUpdate: -1 });

module.exports = mongoose.model('StockData', StockDataSchema);