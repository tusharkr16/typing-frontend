'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 mt-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Improve Your</span>
          <span className="block text-indigo-600">Typing Skills</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Test and enhance your typing speed and accuracy with our comprehensive typing tests. Track your progress and identify areas for improvement.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          {hasToken ? (
            <Link
              href="/session"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Start Typing Test
            </Link>
          ) : (
            <Link
              href="/signup"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Sign Up
            </Link>
          )}
          {hasToken ? (
            <Link
              href="/dashboard"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
            >
              Learn More
            </Link>
          )}
        </div>
      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-3 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-indigo-600 mb-4">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Real-time Feedback</h3>
          <p className="mt-2 text-gray-500">
            Get immediate results with detailed analysis of your typing performance including WPM and accuracy.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-indigo-600 mb-4">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Track Progress</h3>
          <p className="mt-2 text-gray-500">
            Save your results and monitor your improvement over time with our comprehensive analytics.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-indigo-600 mb-4">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Learn Faster</h3>
          <p className="mt-2 text-gray-500">
            Identify your weak spots with detailed error analysis and focus on areas that need improvement.
          </p>
        </div>
      </div>
    </div>
  );
}