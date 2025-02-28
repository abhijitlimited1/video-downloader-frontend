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
      const response = await fetch(
        "https://video-downloader-backend-jn92.onrender.com/api/fetch-video-info/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      if (response.ok && data.video_url) {
        setVideoData({
          title: data.title,
          video_url: data.video_url,
        });
      } else {
        setError(data.error || "Failed to fetch video.");
      }
    } catch (err) {
      console.error("Error fetching video:", err);
      setError("Failed to fetch video.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoData || !videoData.video_url) return;

    try {
      setDownloading(true);

      // Use the video URL directly to initiate the download
      const link = document.createElement("a");
      link.href = videoData.video_url;
      link.setAttribute("download", `${videoData.title}.mp4`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading video:", err);
      setError("Failed to download the video.");
    } finally {
      setDownloading(false);
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
                setError(""); // Clear error when URL changes
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
              <h3 className="text-lg font-bold">{videoData.title}</h3>
              <div className="mt-6 flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-2">Preview</h2>
                {/* <video
                  controls
                  className="w-full max-w-lg rounded-lg shadow-lg border border-gray-700"
                >
                  <source src={videoData.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video> */}
              </div>

              <button
                onClick={handleDownload}
                className="block mt-5 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full text-center w-full"
                disabled={downloading}
              >
                {downloading ? "Downloading your video..." : "⬇ Download Video"}
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
