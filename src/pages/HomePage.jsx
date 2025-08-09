import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="bg-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-indigo-600">Resume Analyzer</div>
          <nav className="space-x-8 text-lg text-gray-700">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <Link to="/analyze" className="hover:text-indigo-600">Analyze Resume</Link>
            <Link to="#" className="hover:text-indigo-600">Results</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
          AI-Powered <span className="text-indigo-600">Resume Analysis</span>
        </h1>
        <p className="text-lg text-gray-600 mx-auto max-w-2xl mb-10">
          Get instant insights into your resume with our advanced AI analysis.
        </p>
        <div className="inline-flex">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/analyze" className="text-lg px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Analyze Your Resume
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { label: "1k+", value: "Resumes Analyzed" },
          { label: "95%", value: "Accuracy Rate" },
          { label: "24/7", value: "Availability" },
          { label: "10+", value: "Companies Used" },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="text-3xl font-bold text-indigo-600">{item.label}</div>
            <p className="text-lg text-gray-600 mt-2">{item.value}</p>
          </motion.div>
        ))}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Why Choose Our Resume Analyzer?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-4 text-lg">
                {index + 1}
              </div>
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Detailed Insights</h3>
              <p className="text-gray-600 text-base">
                Get comprehensive analysis of your skills, experience, and resume strengths.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-12 text-center">
        <div className="bg-indigo-600 text-white p-10 rounded-xl shadow-lg">
          <h3 className="text-3xl font-bold mb-4">Ready to Improve Your Resume?</h3>
          <p className="mb-6 text-indigo-100 text-lg">Join thousands of professionals who have already improved their career prospects with our AI-powered resume analysis.</p>
          <Link to="/analyze" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-100 transition text-lg">
            Start Analysis Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
