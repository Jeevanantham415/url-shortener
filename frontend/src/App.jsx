import { useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Analytics from "./analytics";
import "./App.css";

function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shortenURL = async () => {
    setError("");
    setResult(null);
    setCopied(false);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/shorten/", {
        original_url: url,
      });

      setResult(response.data);
    } catch (error) {
      setError("Please enter a valid URL");
    } finally {
      setLoading(false);
    }
  };

  const copyURL = () => {
    navigator.clipboard.writeText(result.short_url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const refreshClicks = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/analytics/${result.short_code}/`,
      );

      setResult((prev) => ({
        ...prev,
        click_count: response.data.total_clicks,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>URL Shortener</h1>

        <p className="subtitle">Shorten your long URLs instantly</p>

        <div className="input-section">
          <input
            type="url"
            placeholder="Enter your long URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button onClick={shortenURL} disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result">
            <p>
              <strong>Original URL</strong>
            </p>

            <p className="original-url">{result.original_url}</p>

            <p>
              <strong>Short URL</strong>
            </p>

            <div className="short-url-box">
              <a href={result.short_url} target="_blank" rel="noreferrer">
                {result.short_url}
              </a>

              <button onClick={copyURL}>{copied ? "Copied!" : "Copy"}</button>
            </div>

            <p className="clicks">
              Clicks: <strong>{result.click_count}</strong>
            </p>

            <button onClick={refreshClicks}>Refresh Clicks</button>

            <button
              className="analytics-btn"
              onClick={() =>
                window.open(`/analytics/${result.short_code}`, "_blank")
              }
            >
              View Analytics
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/analytics/:code" element={<Analytics />} />
    </Routes>
  );
}

export default App;
