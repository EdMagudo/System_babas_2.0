import React from "react";

const Jobs = ({ nannyProfile }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-blue-700">Job Opportunities</h3>
      <div className="space-y-4">
        {nannyProfile.jobs.map((job, index) => (
          <div key={index} className="border p-4 rounded-md">
            <h4 className="font-semibold">{job.title}</h4>
            <p>{job.description}</p>
            <p className={`text-${job.status === "Open" ? "green" : "yellow"}-600`}>{job.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;