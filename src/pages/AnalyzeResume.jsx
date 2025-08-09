import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AnalyzeResume = () => {
  const [fileName, setFileName] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [file, setFile] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: null }); // For success/error messages
  const [isLoading, setIsLoading] = useState(false); // For loading state during analysis
  const navigate = useNavigate();

  // Effect to clear notification messages after a few seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: null });
      }, 5000); // Clear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAnalyze = async (selectedFile) => {
    if (!selectedFile) return;

    setIsLoading(true); // Set loading state
    setNotification({ message: "", type: null }); // Clear previous notifications

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        "https://resume-analyzer-api-351747392494.asia-south1.run.app/upload-resume/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      localStorage.setItem("analysisResult", JSON.stringify(res.data));
      setNotification({ message: "Resume analyzed successfully!", type: "success" });
      navigate("/results", { state: { data: res.data } });
    } catch (err) {
      console.error("Analysis failed:", err);
      setNotification({ message: "Failed to analyze resume. Please try again.", type: "error" });
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      removeFile(); // Clear if no file is selected
      return;
    }

    const MAX_FILE_SIZE_MB = 10;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 10MB

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setNotification({ message: `File size exceeds ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`, type: "error" });
      setFileName("");
      setFileSelected(false);
      setFile(null);
      e.target.value = null; // Clear the input field
      return;
    }

    setFileName(selectedFile.name);
    setFileSelected(true);
    setFile(selectedFile);

    // Automatically analyze the resume after successful file selection
    handleAnalyze(selectedFile);
  };

  const removeFile = () => {
    setFileName("");
    setFileSelected(false);
    setFile(null);
    setNotification({ message: "", type: null }); // Clear notifications when file is removed
  };

  return (
    <div className="bg-indigo-50 min-h-screen font-inter">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-600">Resume Analyzer</div>
          <nav className="space-x-6 text-gray-700">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <Link to="/analyze" className="text-indigo-600">Analyze Resume</Link>
            <Link to="/results" className="hover:text-indigo-600">Results</Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-6 mt-16 pb-8">
        <div className="bg-white rounded-lg shadow p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Analyze Your Resume</h2>
          <p className="text-gray-600 text-center mb-6">
            Upload your resume in PDF or DOCX format to get instant AI‑powered analysis and personalized recommendations.
          </p>

          {/* Notification Message */}
          {notification.message && (
            <div className={`rounded-md p-3 mb-4 text-sm ${
              notification.type === "success" ? "bg-green-100 text-green-700 border border-green-200" :
              "bg-red-100 text-red-700 border border-red-200"
            }`}>
              {notification.message}
            </div>
          )}

          <label className="border-dashed border-2 border-indigo-200 rounded-lg p-12 text-center mb-6 relative block cursor-pointer hover:border-indigo-400 transition-colors">
            <svg className="mx-auto mb-4 w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <p className="text-gray-500 mb-2">Drag & drop your resume here, or click to browse</p>
            <p className="text-sm text-gray-400">Supports PDF and DOCX files up to 10MB</p>
            <input
              type="file"
              accept=".pdf,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isLoading} // Disable input while loading
            />
          </label>

          {fileSelected && (
            <div className="flex items-center bg-green-50 border border-green-200 rounded p-4 mb-6">
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4m0 6V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h6" />
              </svg>
              <span className="flex-grow text-gray-700">{fileName}</span>
              <button onClick={removeFile} className="text-green-700 font-bold hover:text-green-900 transition-colors">&times;</button>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-3 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-indigo-600">Analyzing your resume...</span>
            </div>
          )}

          {/* The Analyze button is now removed as analysis is automatic */}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 pb-20">
        <div className="bg-white rounded-lg shadow-md p-10 max-w-5xl mx-auto mt-10 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">How It Works?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {["Upload Resume", "Get AI Insights", "View Recommendations"].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center mb-4">
                  {idx + 1}
                </div>
                <h4 className="text-lg font-semibold text-gray-700">{step}</h4>
                <p className="text-sm text-gray-500 mt-2">
                  {idx === 0 && "Simply upload your resume in PDF or DOCX format."}
                  {idx === 1 && "Our AI will process your resume to extract key information."}
                  {idx === 2 && "Receive personalized recommendations to enhance your resume."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyzeResume;
