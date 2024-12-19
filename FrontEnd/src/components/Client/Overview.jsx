import React from 'react';

const Overview = ({ clientProfile }) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Quick Stats</h3>
        <div className="space-y-3">
          <p>Total Nanny Searches: <span className="font-bold">{clientProfile.totalNannySearches}</span></p>
          <p>Profile Completeness: 
            <span className="font-bold text-green-600 ml-2">
              {clientProfile.profileCompleteness}%
            </span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{width: `${clientProfile.profileCompleteness}%`}}
            ></div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Recent Activity</h3>
        <ul className="space-y-3">
          <li className="border-b pb-2">
            <p className="font-medium">Searched for nannies in São Paulo</p>
            <p className="text-sm text-gray-600">2 days ago</p>
          </li>
          <li className="border-b pb-2">
            <p className="font-medium">Viewed 3 nanny profiles</p>
            <p className="text-sm text-gray-600">3 days ago</p>
          </li>
          <li>
            <p className="font-medium">Updated search preferences</p>
            <p className="text-sm text-gray-600">5 days ago</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Overview;
