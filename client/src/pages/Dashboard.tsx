const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Shares</h3>
          <p className="text-2xl font-bold text-blue-600">1,234</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Orders</h3>
          <p className="text-2xl font-bold text-green-600">56</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Transactions</h3>
          <p className="text-2xl font-bold text-purple-600">789</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Portfolio Value</h3>
          <p className="text-2xl font-bold text-orange-600">$125,000</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-600">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default Dashboard;