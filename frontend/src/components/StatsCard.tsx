import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  change?: string;
  status?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, status }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
        {change && (
          <p className={`ml-2 text-sm font-medium ${
            change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </p>
        )}
      </div>
      {status && (
        <div className="mt-1">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            {status}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard; 