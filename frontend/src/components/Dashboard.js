import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/trades');
        const data = await response.json();
        setTrades(Object.entries(data));
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchTrades();
    fetchAlerts();

    const interval = setInterval(() => {
      fetchTrades();
      fetchAlerts();
    }, 5000); // Refresh data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Trade Data</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Token</th>
            <th>Trade Volume</th>
            <th>Price Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(([token, data]) => (
            <tr key={token}>
              <td>{token}</td>
              <td>{data.tradeVolume}</td>
              <td>{data.priceChange.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Alerts</h2>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              Token: {alert.token}, Trade Volume: {alert.tradeVolume}, Price
              Change: {alert.priceChange.toFixed(2)}%
            </li>
          ))}
        </ul>
      ) : (
        <p>No alerts at the moment.</p>
      )}
    </div>
  );
}

export default Dashboard;
