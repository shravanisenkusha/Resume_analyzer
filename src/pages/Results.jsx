import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaLightbulb,
  FaFire,
  FaExclamationCircle,
  FaRegHandRock,
  FaGithub, // Added GitHub icon
} from "react-icons/fa";
import CountUp from "react-countup";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(location.state?.data || {});
  const [percentage, setPercentage] = useState(45);

  useEffect(() => {
    if (location.state?.data) {
      setData(location.state.data);
    } else {
      // Fallback to localStorage if no state data
      const storedData = localStorage.getItem("analysisResult");
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    }
  }, [location.state]);

  // Extract feedback data
  const feedback = data?.feedback || {};
  const resumeScore = feedback?.score || percentage;
  const personalDetails = feedback?.personal_details || {};
  const skillsScores = feedback?.skills_scores || {};
  const scoreBreakdown = feedback?.score_breakdown || {};
  const githubProjects = feedback?.github_projects || [];
  const swotAnalysis = feedback?.swot_analysis || {};
  const skills = feedback?.skills || [];

  // --- START: GitHub parsing logic ---
  let githubUsername = null;
  let githubUrl = null;
  if (personalDetails.github) {
    const githubString = personalDetails.github;
    githubUrl = githubString.startsWith("http") ? githubString : `https://${githubString}`;
    const parts = githubString.split('/');
    githubUsername = parts[parts.length - 1];
    if (!githubUsername && parts.length > 1) {
        githubUsername = parts[parts.length - 2];
    }
    if (githubUsername === "github.com" || githubUsername === "") {
        githubUsername = personalDetails.github;
    }
  }
  // --- END: GitHub parsing logic ---

  // Create skills data for the bar chart
  const skillsForChart = skills.slice(0, 8);
  const barData = {
    labels: skillsForChart.map(skill => skill.name || skill),
    datasets: [
      {
        label: "Skill Confidence",
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        borderWidth: 1,
        hoverBackgroundColor: "#2563eb",
        hoverBorderColor: "#2563eb",
        data: skillsForChart.map(skill => skill.confidence_score || 75),
      },
    ],
  };

  // Handler for navigation button
  const handleUploadRescan = () => {
    navigate("/analyze");
  };

  return (
    <div className="bg-blue-50 min-h-screen p-6 flex flex-col lg:flex-row gap-6 font-inter">
      {/* Left Column */}
      <div className="lg:w-1/4 w-full flex flex-col gap-4">
        {/* Resume Score */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-blue-700 font-semibold mb-3 text-md text-center">Resume Score</h3>
          <div className="relative w-32 h-32 mx-auto">
            <Doughnut
              data={{
                datasets: [
                  {
                    data: [resumeScore, 100 - resumeScore],
                    backgroundColor: ["#5be956ff", "#e5e7eb"],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                cutout: "70%",
                animation: { animateRotate: true, duration: 1500 },
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">
                <CountUp end={resumeScore} duration={1.5} />%
              </span>
            </div>
          </div>
          {/* Single Upload & Rescan Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleUploadRescan}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 ease-in-out text-base font-semibold"
            >
              Upload & Rescan
            </button>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-blue-700 font-semibold mb-3 text-md flex items-center gap-2">
            <FaUser className="text-blue-500" /> Personal Details
          </h3>
          <div className="space-y-2 text-sm text-gray-800">
            <div className="flex items-center gap-2"><FaUser className="text-blue-600" /> {personalDetails.name || "N/A"}</div>
            <div className="flex items-center gap-2"><FaPhone className="text-green-600" /> {personalDetails.phone || "N/A"}</div>
            <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-yellow-500" /> {personalDetails.location || "N/A"}</div>
            <div className="flex items-center gap-2"><FaEnvelope className="text-red-500" /> {personalDetails.email || "N/A"}</div>
            {/* GitHub Account Section */}
            {githubUsername && githubUrl ? (
              <div className="flex items-center gap-2">
                <FaGithub className="text-gray-700" />
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {githubUsername}
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaGithub className="text-gray-400" /> N/A (GitHub)
              </div>
            )}
          </div>
        </div>

        {/* Skill bars */}
        <div className="bg-white p-3 rounded-lg shadow-md">
          <div className="flex justify-between text-sm mb-1">
            <span>Soft Skills</span>
            <span className="text-green-500">{skillsScores.soft_skills_score || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${skillsScores.soft_skills_score || 0}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-md">
          <div className="flex justify-between text-sm mb-1">
            <span>Hard Skills</span>
            <span className="text-green-500">{skillsScores.hard_skills_score || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${skillsScores.hard_skills_score || 0}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-md">
          <div className="flex justify-between text-sm mb-1">
            <span>Formatting</span>
            <span className="text-green-500">{scoreBreakdown.formatting_score || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${scoreBreakdown.formatting_score || 0}%` }}></div>
          </div>
        </div>

        {/* GitHub Projects */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-blue-700 font-semibold mb-3 text-md">GitHub Projects</h3>
          <div className="flex flex-col gap-4">
            {githubProjects.length > 0 ? githubProjects.map((proj, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition bg-blue-50"
              >
                <a href={proj.link} target="_blank" rel="noopener noreferrer">
                  <h4 className="font-semibold text-blue-700 text-sm hover:underline">{proj.name}</h4>
                </a>
                <p className="text-gray-700 text-sm mb-2">{proj.description || "No description available"}</p>
                {proj.tech && (
                  <div className="flex flex-wrap gap-2">
                    {proj.tech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No GitHub projects found</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:w-3/4 w-full flex flex-col gap-6">
        {/* Combined Skill Confidence + Score Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-6 text-blue-700 text-center">Skill Confidence & Score Breakdown</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Bar Graph */}
            <div className="w-full md:w-2/3 h-64">
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 10 },
                      max: 100,
                    },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>

            {/* Pie Chart for Score Breakdown */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-48 h-48">
                <Doughnut
                  data={{
                    labels: ["Experience", "Skills", "Education"],
                    datasets: [
                      {
                        data: [
                          scoreBreakdown.experience_score || 0,
                          scoreBreakdown.skills_score || 0,
                          scoreBreakdown.education_score || 0,
                        ],
                        backgroundColor: ["#3b82f6", "#f472b6", "#facc15"],
                        hoverBackgroundColor: ["#2563eb", "#ec4899", "#eab308"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              </div>
              <div className="mt-4 text-sm font-medium text-gray-700 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Experience
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-pink-400 rounded-full"></span> Skills
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full"></span> Education
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SWOT Analysis (Updated Layout) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-6 text-center">SWOT Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="relative bg-white shadow p-5 rounded-tr-[4rem] border">
              <div className="flex items-center justify-center gap-2 mb-2 text-blue-700 font-bold text-lg">
                <FaRegHandRock className="text-blue-500" />
                STRENGTHS
              </div>
              <div className="text-gray-700 text-sm text-center">
                {swotAnalysis.strengths && swotAnalysis.strengths.length > 0 ? (
                  <ul className="list-none">
                    {swotAnalysis.strengths.map((strength, idx) => (
                      <li key={idx} className="mb-1">• {strength}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No strengths identified</p>
                )}
              </div>
              <div className="absolute bottom-0 right-5 transform translate-x-1/2 translate-y-1/2 w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold text-lg rounded-full shadow-md">
                S
              </div>
            </div>

            {/* Weaknesses */}
            <div className="relative bg-white shadow p-5 rounded-tl-[4rem] border">
              <div className="flex items-center justify-center gap-2 mb-2 text-yellow-600 font-bold text-lg">
                <FaLightbulb className="text-yellow-500" />
                WEAKNESSES
              </div>
              <div className="text-gray-700 text-sm text-center">
                {swotAnalysis.weaknesses && swotAnalysis.weaknesses.length > 0 ? (
                  <ul className="list-none">
                    {swotAnalysis.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="mb-1">• {weakness}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No weaknesses identified</p>
                )}
              </div>
              <div className="absolute bottom-0 left-5 transform -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-yellow-400 text-white flex items-center justify-center font-bold text-lg rounded-full shadow-md">
                W
              </div>
            </div>

            {/* Opportunities */}
            <div className="relative bg-white shadow p-5 rounded-br-[4rem] border">
              <div className="flex items-center justify-center gap-2 mb-2 text-green-600 font-bold text-lg">
                <FaFire className="text-green-500" />
                OPPORTUNITIES
              </div>
              <div className="text-gray-700 text-sm text-center">
                {swotAnalysis.opportunities && swotAnalysis.opportunities.length > 0 ? (
                  <ul className="list-none">
                    {swotAnalysis.opportunities.map((opportunity, idx) => (
                      <li key={idx} className="mb-1">• {opportunity}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No opportunities identified</p>
                )}
              </div>
              <div className="absolute top-4 right-5 transform translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-500 text-white flex items-center justify-center font-bold text-lg rounded-full shadow-md">
                O
              </div>
            </div>

            {/* Threats */}
            <div className="relative bg-white shadow p-5 rounded-bl-[4rem] border">
              <div className="flex items-center justify-center gap-2 mb-2 text-red-600 font-bold text-lg">
                <FaExclamationCircle className="text-red-500" />
                THREATS
              </div>
              <div className="text-gray-700 text-sm text-center">
                {swotAnalysis.threats && swotAnalysis.threats.length > 0 ? (
                  <ul className="list-none">
                    {swotAnalysis.threats.map((threat, idx) => (
                      <li key={idx} className="mb-1">• {threat}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No threats identified</p>
                )}
              </div>
              <div className="absolute top-4 left-5 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-500 text-white flex items-center justify-center font-bold text-lg rounded-full shadow-md">
                T
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
