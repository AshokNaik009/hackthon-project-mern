const TxnData = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Transaction Data</h1>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
            <div className="flex gap-2">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>All Types</option>
                <option>Buy</option>
                <option>Sell</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 text-sm text-gray-900">2024-06-28</td>
                  <td className="py-4 text-sm text-gray-900">TXN001</td>
                  <td className="py-4 text-sm text-gray-900">AAPL</td>
                  <td className="py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                      BUY
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-900">50</td>
                  <td className="py-4 text-sm text-gray-900">$150.00</td>
                  <td className="py-4 text-sm text-gray-900">$7,500.00</td>
                </tr>
                <tr>
                  <td className="py-4 text-sm text-gray-900">2024-06-27</td>
                  <td className="py-4 text-sm text-gray-900">TXN002</td>
                  <td className="py-4 text-sm text-gray-900">MSFT</td>
                  <td className="py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                      SELL
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-900">25</td>
                  <td className="py-4 text-sm text-gray-900">$300.00</td>
                  <td className="py-4 text-sm text-gray-900">$7,500.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TxnData;