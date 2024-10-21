// App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import 'bootstrap/dist/css/bootstrap.min.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

const App = () => {
  const [transactions, setTransactions] = useState([]); 
  const [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statistics, setStatistics] = useState({});
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [{ label: "Items by Price Range", data: [], backgroundColor: "rgba(75, 192, 192, 0.6)" }],
  });
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [{ label: "Category Distribution", data: [], backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }],
  });

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarData();
    fetchPieData();
  }, [month, page]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`/api/transactions?month=${month}&page=${page}&search=${search}`);
      // const res = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      if (Array.isArray(res.data)) {
        setTransactions(res.data.target); 
      } else {
        setTransactions([]);  
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);  
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(`/api/statistics?month=${month}`);
      setStatistics(res.data || {});
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatistics({});
    }
  };

  const fetchBarData = async () => {
    try {
      const res = await axios.get(`/api/bar-chart?month=${month}`);
      const { labels, values } = formatBarChartData(res.data || {});
      setBarData({
        labels,
        datasets: [
          {
            label: "Items by Price Range",
            data: values || [],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
      setBarData({ labels: [], datasets: [{ label: "Items by Price Range", data: [] }] });
    }
  };

  const fetchPieData = async () => {
    try {
      const res = await axios.get(`/api/pie-chart?month=${month}`);
      const { labels, values } = formatPieChartData(res.data || {});
      setPieData({
        labels,
        datasets: [
          {
            label: "Category Distribution",
            data: values || [],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
      setPieData({ labels: [], datasets: [{ label: "Category Distribution", data: [] }] });
    }
  };

  const formatBarChartData = (data) => {
    const labels = Object.keys(data || {});
    const values = Object.values(data || {});
    return { labels, values };
  };

  const formatPieChartData = (data) => {
    const labels = Object.keys(data || {});
    const values = Object.values(data || {});
    return { labels, values };
  };

  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  return (
    <>
      <section className="container-fluid mx-auto">
        <div className="row mx-0 justify-content-center">
          <div className="col">
            <div>
              <div className="container my-4">
                <div className="row">
                  <div className="col col-md-10 mx-md-auto">
                    <h1 className="text-center mb-4">Transaction Dashboard</h1>
                    <div className="row mx-0">
                      <div className="col px-0">
                        <div className="row mb-3">
                          <div className="col-12 col-md-6">
                            <label htmlFor="monthSelect" className="form-label">Select Month:</label>
                            <select
                              id="monthSelect"
                              className="form-select"
                              value={month}
                              onChange={handleMonthChange}
                            >
                              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((mon) => (
                                <option key={mon} value={mon}>
                                  {mon}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <form className="d-flex flex-wrap mb-3" onSubmit={handleSearchSubmit}>
                          <input
                            type="text"
                            className="form-control me-2 mb-2 mb-md-0"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search transactions..."
                          />
                          <button type="submit" className="btn btn-primary mb-2 mb-md-0 mx-auto">Search</button>
                        </form>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h2>Transactions Table</h2>

                      <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                          <thead className="table-dark">
                            <tr>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Price</th>
                              <th>Date of Sale</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.length > 0 ? (
                              transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                  <td>{transaction.title}</td>
                                  <td>{transaction.description}</td>
                                  <td>{transaction.price}</td>
                                  <td>{transaction.dateOfSale}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center">No transactions found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-secondary"
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                        >
                          Previous
                        </button>
                        <button className="btn btn-secondary" onClick={() => setPage(page + 1)}>
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 py-5 mx-auto">
                  <h2>Statistics</h2>
                  <div className="row">
                    <div className="col-12 col-md-4">
                      <div className="card text-center mb-3">
                        <div className="card-body">
                          <h5 className="card-title">Total Sale Amount</h5>
                          <p className="card-text">{statistics.totalSaleAmount || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="card text-center mb-3">
                        <div className="card-body">
                          <h5 className="card-title">Total Sold Items</h5>
                          <p className="card-text">{statistics.soldItems || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="card text-center mb-3">
                        <div className="card-body">
                          <h5 className="card-title">Total Not Sold Items</h5>
                          <p className="card-text">{statistics.notSoldItems || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <h2>Price Range Distribution</h2>
                  <div className="chart-container">
                    {barData.labels.length > 0 ? (
                      <Bar data={barData} />
                    ) : (
                      <p className="text-center">No data available for bar chart.</p>
                    )}
                  </div>
                </div>

                <div className="mb-5">
                  <h2>Category Distribution</h2>
                  <div className="chart-container">
                    {pieData.labels.length > 0 ? (
                      <Pie data={pieData} style={{marginTop:"50px"}} />
                    ) : (
                      <p className="text-center">No data available for pie chart.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default App;

