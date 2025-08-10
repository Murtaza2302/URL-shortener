import { useState } from "react";
import axios from "axios";
import "./App.css"; // we’ll make this file

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!longUrl.trim()) {
      setError("Please enter a URL.");
      return;
    }
    const urlPattern = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
    if (!urlPattern.test(longUrl.trim())) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    try {
      const res = await axios.post("https://url-shortener-9ivc.onrender.com/api/shorten", { longUrl });
      setShortUrl(res.data.shortUrl);
      setLongUrl("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="container">
      <h1 className="title">🔗 URL Shortener</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className={`input ${error ? "input-error" : ""}`}
        />
        <button type="submit" className="button">Shorten</button>
      </form>

      {error && <p className="error">{error}</p>}
      {shortUrl && (
        <div>
          <p className="result">
            Short URL:{" "}
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
            <button className="copy-button" onClick={handleCopy}>
              Copy
            </button>
            {copied && <span className="copied-text">Copied!</span>}

          </p>
        </div>
      )}
    </div>
  );
}
