"use client";

import React from 'react';

const ClassroomSceneFallback = () => {
  return (
    <div className="h-[60vh] w-full bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-blue-800">Web Development Course</h2>
          
          <div className="flex justify-center">
            <div className="animate-pulse text-xl font-medium text-blue-600">
              Web Development Marathon
            </div>
          </div>
          
          <ul className="space-y-3 mx-auto max-w-md">
            <li className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="font-medium">Learn Modern Web Development</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="font-medium">Build Interactive Web Experiences</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="font-medium">Deploy Real Projects</span>
            </li>
          </ul>
          
          <div className="flex justify-center pt-4">
            <button 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-200 rounded-lg opacity-50 animate-bounce"></div>
      <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-cyan-200 rounded-lg opacity-50 animate-bounce"></div>
    </div>
  );
};

export default ClassroomSceneFallback; 