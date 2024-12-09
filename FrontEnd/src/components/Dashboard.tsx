import React from "react";

const Dashboard = ({ nannyProfile }) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">
          Quick Stats
        </h3>
        <div className="space-y-3">
          <p>
            Completed Jobs: <span className="font-bold">{nannyProfile.completedJobs}</span>
          </p>
          <p>
            Rating: <span className="font-bold text-yellow-600">{nannyProfile.rating}/5</span>
          </p>
          <p>
            Availability: <span className="font-bold text-green-600">{nannyProfile.availabilityStatus}</span>
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">
          Professional Summary
        </h3>
        <p>{nannyProfile.professionalSummary}</p>
      </div>
    </div>
  );
};

export default Dashboard;
