import { useState } from "react";
import { X } from "lucide-react";
import Navbar from "../components/Navbar";
import FAQ from "../components/FAQ";
import SEOContent from "../components/SEOContent";
import Footer from "../components/Footer";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [error, setError] = useState("");
  const [videoId, setVideoId] = useState("");

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/
    );
    return match ? match[1] : "";
  };

  const handleFetchVideo = () => {
    if (!url.trim()) {
      setError("Please enter a valid video URL.");
      return;
    }

    const extractedVideoId = extractVideoId(url);
    if (!extractedVideoId) {
      setError("Invalid YouTube URL. Please check again.");
      return;
    }

    setVideoId(extractedVideoId);
    setDownloadLink(""); // Reset download link
    setError("");
  };

  const handleDownload = async () => {
    if (!videoId) {
      setError("No video detected. Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError("");
    setDownloadLink("");

    try {
      const response = await fetch(
        "https://video-downloader-backend-jn92.onrender.com/api/download/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, quality: "best" }), // Use correct quality format
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download video.");
      }

      // Convert response to blob and create a download link
      const blob = await response.blob();
      const videoUrl = window.URL.createObjectURL(blob);
      setDownloadLink(videoUrl);

      // Auto-trigger download
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
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
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 rounded-full bg-gray-800 text-white border border-gray-600 focus:ring-4 focus:ring-blue-500 outline-none placeholder-gray-400"
            />
            {url && (
              <button
                onClick={() => {
                  setUrl("");
                  setVideoId("");
                  setDownloadLink("");
                }}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <button
            onClick={handleFetchVideo}
            className="w-full mt-4 bg-blue-500 hover:scale-105 text-white font-semibold py-3 rounded-full transition-all"
            disabled={loading}
          >
            {loading ? "Processing..." : "Fetch Video"}
          </button>

          {videoId && (
            <div className="mt-4 flex flex-col items-center">
              <div className="w-full aspect-video max-w-3xl">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>

              <button
                onClick={handleDownload}
                className="w-full max-w-3xl mt-4 bg-green-500 hover:scale-105 text-white font-semibold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Downloading..." : "Download Video"}
              </button>
            </div>
          )}

          {/* {downloadLink && (
            <a
              href={downloadLink}
              download="video.mp4"
              className="block mt-5 text-green-400 font-semibold underline"
            >
              ✅ Click here to download your video!
            </a>
          )} */}

          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>

        <FAQ />
        <SEOContent />
      </div>
      <Footer />
    </div>
  );
}
