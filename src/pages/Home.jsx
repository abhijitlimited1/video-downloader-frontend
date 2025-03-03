import { useState } from "react";
import Navbar from "../components/Navbar";
import FAQ from "../components/FAQ";
import SEOContent from "../components/SEOContent";
import Footer from "../components/Footer";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const getCSRFToken = () => {
    return (
      document.cookie.match("(^|;)\\s*csrftoken\\s*=\\s*([^;]+)")?.pop() || ""
    );
  };

  const handleFetchVideo = async () => {
    setLoading(true);
    setError("");
    setVideoData(null);
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "https://video-downloader-backend-jn92.onrender.com/api/fetch-video-info/",
        { url },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
        }
      );

      if (response.data.video_url) {
        setVideoData({
          title: response.data.title,
          video_url: response.data.video_url,
        });
      } else {
        setError("Video format not supported");
      }
    } catch (err) {
      setError("Failed to fetch video. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    setSuccessMessage("");

    try {
      const fetchResponse = await axios.post(
        "https://video-downloader-backend-jn92.onrender.com/api/fetch-video-info/",
        { url },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!fetchResponse.data.video_url) {
        throw new Error("Failed to fetch video URL.");
      }

      const videoURL = fetchResponse.data.video_url;
      const title = fetchResponse.data.title || "video";

      const response = await fetch(
        `https://video-downloader-backend-jn92.onrender.com/api/stream-video/?url=${encodeURIComponent(
          videoURL
        )}&title=${encodeURIComponent(title)}`
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${title}.mp4`;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);

      setSuccessMessage("✅ Your video has been successfully downloaded!");
      setVideoData(null); // Hide video details after download
    } catch (error) {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      <div className="flex flex-col items-center flex-grow text-center w-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-8 sm:mt-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Download Videos Instantly
        </h2>
        <p className="text-gray-300 mt-3 text-base sm:text-lg md:text-xl max-w-lg sm:max-w-2xl">
          Paste your video link below and download with one click!
        </p>

        <div className="bg-gray-900 p-6 rounded-2xl mt-6 w-full max-w-lg">
          <input
            type="text"
            placeholder="Paste video URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 rounded-full bg-gray-800 text-white"
          />

          {!videoData && !successMessage && (
            <button
              onClick={handleFetchVideo}
              disabled={loading}
              className={`w-full mt-4 py-3 rounded-full ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-500 cursor-pointer"
              } text-white`}
            >
              {loading ? "Fetching your video... Please wait" : "Fetch Video"}
            </button>
          )}

          {error && <p className="text-red-400 mt-4">{error}</p>}

          {videoData && !successMessage && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`mt-5 py-3 rounded-full w-full ${
                downloading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 cursor-pointer"
              } text-white`}
            >
              {downloading
                ? "Your video is downloading... Please wait"
                : "⬇ Download Video"}
            </button>
          )}

          {successMessage && (
            <p className="text-green-400 mt-4">{successMessage}</p>
          )}
        </div>
      </div>
      <FAQ />
      <SEOContent />
      <Footer />
    </div>
  );
}
