import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SharesData from './pages/SharesData';
import OrderData from './pages/OrderData';
import TxnData from './pages/TxnData';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="shares" element={<SharesData />} />
          <Route path="orders" element={<OrderData />} />
          <Route path="transactions" element={<TxnData />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;