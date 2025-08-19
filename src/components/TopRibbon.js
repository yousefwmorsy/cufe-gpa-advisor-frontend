import React from 'react';

const pageTitles = {
  home: 'Home',
  transcript: 'Manage Grades (Transcript)',
  insights: 'GPA Insights',
  simulation: 'GPA Simulation',
  advisor: 'AI Advisor'
};

export default function TopRibbon({ currentPage }) {
  return (
    <header className="w-full bg-navy text-gray-100 py-4 text-2xl font-bold font-mono shadow-md flex items-center justify-center tracking-wide drop-shadow-lg">
      {pageTitles[currentPage]}
    </header>
  );
}
