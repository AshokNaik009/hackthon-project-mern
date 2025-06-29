import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import type { StockData } from '../types/stock';

const BACKEND_API_URL = 'http://localhost:8003/api';

export interface ExportData {
  Symbol: string;
  Market: string;
  Price: number;
  Open: number;
  High: number;
  Low: number;
  Volume: number;
  Change: number;
  'Change %': number;
  'Last Update': string;
}

export interface ExportSummary {
  overview: {
    totalRecords: number;
    marketBreakdown: {
      USA: number;
      CRYPTO: number;
    };
    lastUpdate: string;
  };
  performance: {
    usa: {
      totalStocks: number;
      gainers: number;
      losers: number;
      avgChange: string;
    };
    crypto: {
      totalCoins: number;
      gainers: number;
      losers: number;
      avgChange: string;
    };
  };
  exportTimestamp: string;
}

export class ExportService {
  // Fetch all data from backend for export
  async fetchAllData(market: 'ALL' | 'USA' | 'CRYPTO' = 'ALL'): Promise<ExportData[]> {
    try {
      const url = `${BACKEND_API_URL}/export/all-data?market=${market}&format=export`;
      console.log('Fetching export data from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch export data');
      }
    } catch (error) {
      console.error('Error fetching export data:', error);
      throw error;
    }
  }

  // Fetch summary data for export
  async fetchSummary(): Promise<ExportSummary> {
    try {
      const url = `${BACKEND_API_URL}/export/summary`;
      
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
        throw new Error(result.message || 'Failed to fetch summary data');
      }
    } catch (error) {
      console.error('Error fetching summary data:', error);
      throw error;
    }
  }

  // Export data to CSV format
  async exportToCSV(market: 'ALL' | 'USA' | 'CRYPTO' = 'ALL'): Promise<void> {
    try {
      const data = await this.fetchAllData(market);
      
      if (data.length === 0) {
        throw new Error('No data available for export');
      }

      // Create CSV headers
      const headers = Object.keys(data[0]);
      const csvHeaders = headers.join(',');

      // Create CSV rows
      const csvRows = data.map(row => 
        headers.map(header => {
          const value = row[header as keyof ExportData];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      );

      // Combine headers and rows
      const csvContent = [csvHeaders, ...csvRows].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const fileName = `stock_data_${market.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
      
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  // Export data to PDF format
  async exportToPDF(market: 'ALL' | 'USA' | 'CRYPTO' = 'ALL'): Promise<void> {
    try {
      const [data, summary] = await Promise.all([
        this.fetchAllData(market),
        this.fetchSummary()
      ]);
      
      if (data.length === 0) {
        throw new Error('No data available for export');
      }

      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Stock Market Data Report', 14, 22);
      
      // Add market filter info
      doc.setFontSize(12);
      doc.text(`Market: ${market}`, 14, 32);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);
      doc.text(`Total Records: ${data.length}`, 14, 48);

      // Add summary section if available
      if (summary && market === 'ALL') {
        doc.setFontSize(14);
        doc.text('Market Summary', 14, 60);
        
        doc.setFontSize(10);
        doc.text(`USA Stocks: ${summary.overview.marketBreakdown.USA} (${summary.performance.usa.gainers} gainers, ${summary.performance.usa.losers} losers)`, 14, 70);
        doc.text(`Crypto: ${summary.overview.marketBreakdown.CRYPTO} (${summary.performance.crypto.gainers} gainers, ${summary.performance.crypto.losers} losers)`, 14, 78);
        doc.text(`Last Update: ${new Date(summary.overview.lastUpdate || '').toLocaleString()}`, 14, 86);
      }

      // Prepare table data
      const tableHeaders = ['Symbol', 'Market', 'Price ($)', 'Change ($)', 'Change (%)'];
      const tableRows = data.map(row => [
        row.Symbol,
        row.Market,
        `$${row.Price.toFixed(2)}`,
        `$${row.Change.toFixed(2)}`,
        `${row['Change %'].toFixed(2)}%`
      ]);

      // Add table
      autoTable(doc, {
        head: [tableHeaders],
        body: tableRows,
        startY: market === 'ALL' ? 95 : 60,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [59, 130, 246], // Blue color
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
        columnStyles: {
          2: { halign: 'right' }, // Price
          3: { halign: 'right' }, // Change
          4: { halign: 'right' }, // Change %
        },
      });

      // Save the PDF
      const fileName = `stock_data_${market.toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }

  // Format price for display
  private formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }

  // Format percentage for display
  private formatPercentage(percentage: number): string {
    return `${percentage.toFixed(2)}%`;
  }
}

export const exportService = new ExportService();