const FAQ = () => {
  const faqs = [
    {
      question: "How do I download videos?",
      answer: "Simply paste the video URL and click the download button.",
    },
    {
      question: "Is this service free?",
      answer: "Yes! Our service is 100% free.",
    },
    {
      question: "Which websites are supported?",
      answer: "YouTube, Facebook, Instagram, and many more.",
    },
  ];

  return (
    <div
      id="faq"
      className="max-w-3xl mx-auto my-12 px-4 sm:px-6 lg:px-8 py-6 bg-gray-900 text-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h2>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-400">
            {faq.question}
          </h3>
          <p className="text-gray-300 text-sm sm:text-base mt-1">
            {faq.answer}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
