const OrderData = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Data</h1>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Active Orders</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              New Order
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="pb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 text-sm text-gray-900">#12345</td>
                  <td className="py-4 text-sm text-gray-900">TSLA</td>
                  <td className="py-4 text-sm text-gray-900">BUY</td>
                  <td className="py-4 text-sm text-gray-900">25</td>
                  <td className="py-4 text-sm text-gray-900">$250.00</td>
                  <td className="py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 text-sm text-gray-900">#12346</td>
                  <td className="py-4 text-sm text-gray-900">GOOGL</td>
                  <td className="py-4 text-sm text-gray-900">SELL</td>
                  <td className="py-4 text-sm text-gray-900">10</td>
                  <td className="py-4 text-sm text-gray-900">$2,500.00</td>
                  <td className="py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                      Filled
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderData;