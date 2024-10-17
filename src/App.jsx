// src/App.js

import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa"; // Importing the cross icon from React Icons
import "./App.css";
import HeaderText from "./Components/HeaderText/HeaderText";
import Intro from "./Components/Intro/Intro";
import HowTo from "./Components/HowTo/HowTo";
import Legal from "./Components/Legal/Legal";

function App() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [filename, setFilename] = useState("video.mp4");
  const [isValid, setIsValid] = useState(false); // Indicates if the URL is valid

  // Handler for validating the URL
  const handleValidate = async (e) => {
    e.preventDefault();
    setError("");
    setIsValid(false);
    setFilename("video.mp4");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/validate/", // Ensure this endpoint matches your backend URLs
        { url },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "URL is valid.") {
        setIsValid(true);
        setFilename(
          response.data.title ? `${response.data.title}.mp4` : "video.mp4"
        );
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to validate the video URL. Please try again.");
      }
      console.error("Validation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handler for downloading the video
  const handleDownload = async () => {
    setError("");
    setLoading(true);
    setDownloadProgress(0);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/download/", // Ensure this endpoint matches your backend URLs
        { url },
        {
          responseType: "blob", // Important for handling binary data
          headers: {
            "Content-Type": "application/json",
          },
          onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total) {
              const percent = Math.round((loaded * 100) / total);
              setDownloadProgress(percent);
            }
          },
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers["content-disposition"];
      let downloadFilename = "video.mp4";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          downloadFilename = filenameMatch[1];
        }
      }

      // Create a download URL
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a link and trigger the download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", downloadFilename);
      document.body.appendChild(link);
      link.click();

      // Clean up and revoke the object URL
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to download the video. Please try again.");
      }
      console.error("Download error:", err);
    } finally {
      setLoading(false);
      setDownloadProgress(0);
    }
  };

  // Handler to clear the URL input
  const handleClear = () => {
    setUrl("");
    setError("");
    setIsValid(false);
    setFilename("video.mp4");
    setDownloadProgress(0);
  };

  return (
    <>
      <HeaderText />
      <div className="App">
        <h1>🎥 Video Downloader</h1>
        <form onSubmit={handleValidate} className="url-form">
          <div className="input-container">
            <input
              type="url"
              placeholder="Enter video URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="url-input"
            />
            {url && (
              <FaTimes
                className="clear-icon"
                onClick={handleClear}
                title="Clear URL"
                aria-label="Clear URL"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClear();
                  }
                }}
              />
            )}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Validating..." : "Get Download Link"}
          </button>
        </form>

        {isValid && (
          <div className="download-section">
            <p>Video Title: {filename}</p>
            <button onClick={handleDownload} disabled={loading}>
              {loading ? "Downloading..." : "📥 Download Video"}
            </button>
          </div>
        )}

        {loading && downloadProgress > 0 && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${downloadProgress}%` }}
            >
              {downloadProgress}%
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </div>
      <Intro />
      <HowTo />
      <Legal />
    </>
  );
}

export default App;
