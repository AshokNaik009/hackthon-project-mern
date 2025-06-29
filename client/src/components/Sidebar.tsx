import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Share2, ShoppingCart, Receipt } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/shares', icon: Share2, label: 'Shares Data' },
    { path: '/orders', icon: ShoppingCart, label: 'Order Data' },
    { path: '/transactions', icon: Receipt, label: 'Txn Data' }
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Portfolio Mangement App</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;