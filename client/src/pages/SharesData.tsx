const SharesData = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shares Data</h1>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Your Shares Portfolio</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Share
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 text-sm text-gray-900">AAPL</td>
                  <td className="py-4 text-sm text-gray-900">100</td>
                  <td className="py-4 text-sm text-gray-900">$150.00</td>
                  <td className="py-4 text-sm text-gray-900">$15,000.00</td>
                </tr>
                <tr>
                  <td className="py-4 text-sm text-gray-900">MSFT</td>
                  <td className="py-4 text-sm text-gray-900">50</td>
                  <td className="py-4 text-sm text-gray-900">$300.00</td>
                  <td className="py-4 text-sm text-gray-900">$15,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharesData;