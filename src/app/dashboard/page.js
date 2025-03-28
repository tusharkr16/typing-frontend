'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { axiosInstance } from '@/network/axiosInstance';

export default function SessionHistory() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get('api/sessions/all-session');
        setSessions(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <div className="text-center text-red-500">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Typing Sessions</h1>
          <Link
            href="/session"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            New Test
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">You have not completed any typing tests yet.</p>
            <Link
              href="/typing-test"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Start Your First Test
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sessions.map((session) => (
              <div key={session._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Typing Test - {formatDate(session.createdAt)}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Duration: {session.typingDurations?.reduce((a, b) => a + b, 0).toFixed(1)} seconds
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">WPM</p>
                        <p className={`text-xl font-bold ${
                          session.wpm > 55 ? 'text-green-600' : 
                          session.wpm > 45 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {session.wpm}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Accuracy</p>
                        <p className={`text-xl font-bold ${
                          session.accuracy > 95 ? 'text-green-600' : 
                          session.accuracy > 85 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {session.accuracy}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Error Analysis</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm mb-2">
                          Total errors: <span className="font-medium">{session.totalErrors}</span>
                        </p>
                        {session.errorWords?.length > 0 ? (
                          <>
                            <p className="text-sm mb-1">Words with errors:</p>
                            <div className="flex flex-wrap gap-1">
                              {session.errorWords.map((word, index) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                >
                                  {word}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">No words with errors!</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Typing Pattern</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="h-32">
                          <div className="flex items-end h-full space-x-1">
                            {session.typingDurations?.map((duration, index) => (
                              <div 
                                key={index} 
                                className="flex-1 bg-indigo-100 flex flex-col items-center justify-end"
                                style={{ height: `${Math.min(duration * 30, 100)}%` }}
                                title={`Word ${index+1}: ${duration.toFixed(2)}s`}
                              >
                                <span className="text-xs text-indigo-800">{duration.toFixed(1)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Word typing durations (seconds)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Performance Insights</h3>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm text-blue-800">
                        {session.totalErrors > 10 ? 
                          "You might be rushing too much. Try to focus on accuracy over speed." :
                         session.typingDurations?.length > 0 && 
                         Math.max(...session.typingDurations) / Math.min(...session.typingDurations) > 2 ?
                          "Your typing speed varies significantly. This might indicate hesitation with certain words or patterns." :
                          "Your typing pattern shows good consistency. Keep up the good work!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}