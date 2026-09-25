import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Analytics() {
  const { code } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/analytics/${code}/`)
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        setError("Analytics not found");
      });
  }, [code]);

  if (error) {
    return (
      <div className="analytics-container">
        <div className="analytics-card">
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="analytics-container">
        <div className="analytics-card">
          <h2>Loading analytics...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-card">
        <h1>URL Analytics</h1>

        <p className="analytics-subtitle">Track your shortened URL activity</p>

        <div className="stats">
          <div className="stat-box">
            <h2>{data.total_clicks}</h2>
            <p>Total Clicks</p>
          </div>

          <div className="stat-box">
            <h2>{data.short_code}</h2>
            <p>Short Code</p>
          </div>
        </div>

        <div className="url-info">
          <p>
            <strong>Original URL</strong>
          </p>

          <p className="break-url">{data.original_url}</p>
        </div>

        <h2 className="history-title">Click History</h2>

        {data.clicks.length === 0 ? (
          <p>No clicks yet.</p>
        ) : (
          <div className="click-table">
            <div className="table-header">
              <span>Clicked At</span>
              <span>IP Address</span>
            </div>

            {data.clicks.map((click, index) => (
              <div className="table-row" key={index}>
                <span>{new Date(click.clicked_at).toLocaleString()}</span>

                <span>{click.ip_address}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
