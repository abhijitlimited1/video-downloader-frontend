import { useState } from "react";
import { X } from "lucide-react";
import Navbar from "../components/Navbar";
import FAQ from "../components/FAQ";
import SEOContent from "../components/SEOContent";
import Footer from "../components/Footer";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const getCSRFToken = () => {
    const cookieValue =
      document.cookie.match("(^|;)\\s*csrftoken\\s*=\\s*([^;]+)")?.pop() || "";
    return cookieValue;
  };

  const handleFetchVideo = async () => {
    setLoading(true);
    setError("");
    setVideoData(null);

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
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch video. Check the URL and try again.";
      setError(errorMessage);

      console.error("Fetch Error Details:", {
        error: err,
        response: err.response,
        url: url,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async () => {
    try {
      const response = await fetch(
        `https://video-downloader-backend-jn92.onrender.com/api/stream-video/?url=${encodeURIComponent(
          videoData.video_url
        )}&title=${encodeURIComponent(videoData.title)}`
      );

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${videoData.title}.mp4`;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      // Handle errors
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      <div className="flex flex-col items-center flex-grow text-center px-4 sm:px-6 md:px-8 w-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-8 sm:mt-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Download Videos Instantly
        </h2>
        <p className="text-gray-300 mt-3 text-base sm:text-lg md:text-xl max-w-lg sm:max-w-2xl">
          Paste your video link below and download with one click!
        </p>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl mt-6 w-full max-w-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Paste video URL here..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              className="w-full p-3 rounded-full bg-gray-800 text-white border border-gray-600 focus:ring-4 focus:ring-blue-500 outline-none placeholder-gray-400"
            />
            {url && (
              <button
                onClick={() => {
                  setUrl("");
                  setVideoData(null);
                  setError("");
                }}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <button
            onClick={handleFetchVideo}
            className="w-full mt-4 bg-blue-500 hover:scale-105 text-white font-semibold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Processing..." : "Fetch Video"}
          </button>

          {error && <p className="text-red-400 mt-4">{error}</p>}

          {videoData && videoData.video_url && (
            <div className="mt-6">
              <h3 className="text-lg font-bold truncate">{videoData.title}</h3>
              <button
                onClick={handleDownload}
                className="block mt-5 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full text-center w-full"
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "⬇ Download Video"}
              </button>
            </div>
          )}
        </div>

        <FAQ />
        <SEOContent />
      </div>
      <Footer />
    </div>
  );
}
