import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "VideoDownloader",
          text: "Download videos instantly with VideoDownloader!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Your browser does not support sharing.");
    }
  };

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <h1 className="text-2xl font-bold">VideoDownloader</h1>

        {/* Hamburger Menu Button for Mobile */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Navigation Links (Desktop & Mobile) */}
        <ul
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent p-4 md:p-0 flex flex-col md:flex-row md:gap-6 md:items-center text-center transition-all duration-300 ${
            isOpen ? "block" : "hidden md:flex"
          }`}
        >
          <li className="py-2 md:py-0">
            <a href="#faq" className="block md:inline hover:text-blue-400">
              FAQ
            </a>
          </li>

          {/* Share Button */}
          <li className="py-2 md:py-0">
            <button
              onClick={handleShare}
              className="block md:inline bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 transition-all cursor-pointer"
            >
              Share
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
