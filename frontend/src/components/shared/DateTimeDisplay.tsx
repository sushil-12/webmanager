import React, { useEffect, useState } from "react";

const DateTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayName = currentTime.toLocaleDateString(undefined, { weekday: "long" });
  const monthName = currentTime.toLocaleDateString(undefined, { month: "long" });
  const date = currentTime.getDate();
  const year = currentTime.getFullYear();
  const timeString = currentTime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-md shadow text-gray-700 text-sm font-medium">
      <span className="text-gray-500 font-semibold">{dayName},</span>
      <span className="text-gray-500 font-semibold">{monthName} {date}, {year}</span>
      <span className="text-blue-600 font-semibold">{timeString}</span>
    </div>
  );
};

export default DateTimeDisplay;
