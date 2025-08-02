import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HtiLogo from "./../assets/1.jpg";
import { removeCookie } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import { getMe } from "../Api/Users/usersApi";
import Header from "../Components/header";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const stats = [
    { title: "Total Students", value: "1,234", change: "+12%", color: "blue" },
    { title: "Active Courses", value: "45", change: "+5%", color: "green" },
    { title: "Faculty Members", value: "89", change: "+3%", color: "purple" },
    { title: "Attendance Rate", value: "94%", change: "+2%", color: "orange" },
  ];

  const recentActivities = [
    { action: "New student registered", time: "2 minutes ago", type: "student" },
    { action: "Course assignment submitted", time: "15 minutes ago", type: "assignment" },
    { action: "Faculty meeting scheduled", time: "1 hour ago", type: "meeting" },
    { action: "Grade updated", time: "2 hours ago", type: "grade" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("Api_token");
    removeCookie("user_id");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getMe();
      setUser(user.data);
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header HtiLogo={HtiLogo} handleLogout={handleLogout} user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-2">Welcome to your HTI Education Portal dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                  <div className={`w-6 h-6 bg-${stat.color}-600 rounded-full`}></div>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {["overview", "students", "courses", "reports"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activities */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-sm font-medium transition-colors">
                      Add New Student
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-sm font-medium transition-colors">
                      Create Course
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-sm font-medium transition-colors">
                      View Reports
                    </button>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-sm font-medium transition-colors">
                      Schedule Meeting
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "students" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Student Management</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600">Student management features will be implemented here.</p>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Course Management</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600">Course management features will be implemented here.</p>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Reports & Analytics</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600">Reports and analytics features will be implemented here.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2025 HTI Education Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 