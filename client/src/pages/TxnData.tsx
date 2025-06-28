import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

interface Transaction {
  transactionId: string;
  date: string;
  symbol: string;
  type: string;
  quantity: number;
  price: number;
}

// Define the shape of the full API response
interface HistoryResponse {
  success: boolean;
  count: number;
  data: Transaction[];
}

const statuses = ["Cancelled", "Submitted", "Executed", "Completed", "Failed"];
const portfolios = ["AAAAAAA", "BBBBBBB"];
const types = ["Buy", "Sell"];
const itemsPerPage = 10;

const TxnData = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();

    if (selectedType) params.append("type", selectedType);
    if (selectedStatus) params.append("status", selectedStatus);
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());

    fetch(`http://localhost:8003/api/history?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.message || "Failed to fetch data");
        }
        return res.json();
      })
      .then((fetchedData: HistoryResponse) => {
        setData(fetchedData.data);
        setCount(fetchedData.count);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(itemsPerPage / count);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Transaction Data</h1>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
            <div className="flex gap-2">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={selectedPortfolio}
                onChange={(e) => setSelectedPortfolio(e.target.value)}
              >
                <option>Portfolio</option>
                {portfolios.map((portfolio) => (
                  <option key={portfolio} value={portfolio}>
                    {portfolio}
                  </option>
                ))}
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option>All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy-MM-dd"
                placeholderText="Start date"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                //minDate={startDate}
                dateFormat="yyyy-MM-dd"
                placeholderText="End date"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                onClick={fetchData}
              >
                Search
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <div className="flex justify-center">
                        <svg
                          className="animate-spin h-6 w-6 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-red-600 text-sm">
                      {error}
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  data.map((txn) => (
                    <tr key={txn.transactionId}>
                      <td className="py-4 text-sm text-gray-900">{txn.date}</td>
                      <td className="py-4 text-sm text-gray-900">{txn.transactionId}</td>
                      <td className="py-4 text-sm text-gray-900">{txn.symbol}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${txn.type === "BUY"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-900">{txn.quantity}</td>
                      <td className="py-4 text-sm text-gray-900">${txn.price.toFixed(2)}</td>
                      <td className="py-4 text-sm text-gray-900">
                        ${(txn.price * txn.quantity).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TxnData;