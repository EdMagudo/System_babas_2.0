import React from "react";

type NannyQuickStatsProps = {
  completedJobs: number;
  rating: number;
  availabilityStatus: string;
  professionalSummary: string;
};

const NannyQuickStats: React.FC<NannyQuickStatsProps> = ({
  completedJobs,
  rating,
  availabilityStatus,
  professionalSummary,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Quick Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">
          Quick Stats
        </h3>
        <div className="space-y-3">
          <p>
            Completed Jobs:{" "}
            <span className="font-bold">{completedJobs}</span>
          </p>
          <p>
            Rating:{" "}
            <span className="font-bold text-yellow-600">{rating}/5</span>
          </p>
          <p>
            Availability:{" "}
            <span className="font-bold text-green-600">
              {availabilityStatus}
            </span>
          </p>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">
          Professional Summary
        </h3>
        <p>{professionalSummary}</p>
      </div>
    </div>
  );
};

export default NannyQuickStats;
