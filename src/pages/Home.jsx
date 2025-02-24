import { useState } from "react";
import { X } from "lucide-react";
import Navbar from "../components/Navbar";
import FAQ from "../components/FAQ";
import SEOContent from "../components/SEOContent";
import Footer from "../components/Footer";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState("");

  const isValidUrl = (inputUrl) => {
    const pattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be|tiktok\.com|vimeo\.com)\/.*$/;
    return pattern.test(inputUrl);
  };

  const handleFetchVideo = async () => {
    if (!url.trim()) {
      setError("Please enter a video URL.");
      return;
    }

    if (!isValidUrl(url)) {
      setError(
        "Invalid video URL. Supported platforms: YouTube, TikTok, Vimeo."
      );
      return;
    }

    setError("");
    setVideoData(null);
    setLoading(true);

    try {
      const response = await fetch(
        "https://video-downloader-backend-jn92.onrender.com/api/download/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch video.");
      }

      const data = await response.json();
      setVideoData(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoData?.video_url) {
      setError("Download link is missing.");
      return;
    }

    const link = document.createElement("a");
    link.href = videoData.video_url;
    link.download = "video.mp4"; // Suggests a filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              onChange={(e) => setUrl(e.target.value)}
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

          {videoData && (
            <div className="mt-6">
              <h3 className="text-lg font-bold">{videoData.title}</h3>
              {/* Show video preview */}
              {videoData.video_url && (
                <video
                  controls
                  className="mt-3 rounded-lg w-full"
                  src={videoData.video_url}
                />
              )}

              <button
                onClick={handleDownload}
                className="block mt-5 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full text-center w-full"
              >
                ⬇ Download Video
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
