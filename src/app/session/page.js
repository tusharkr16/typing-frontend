"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { axiosInstance } from '@/network/axiosInstance';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet. 12345 numbers are included!",
  "Programming is the art of telling another human what one wants the computer to do. Good code is its own best documentation.",
  "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune...",
  "The 7 wonders of the world include the Great Pyramid of Giza and the Hanging Gardens of Babylon. 3.14 is the value of pi.",
  "She sells seashells by the seashore. How much wood would a woodchuck chuck if a woodchuck could chuck wood?"
];


const TypingTestUI = dynamic(() => Promise.resolve(({
  text,
  input,
  selectedText,
  isTyping,
  timer,
  results,
  handleInputChange,
  renderTextWithHighlights,
  startTest,
  endTest,
  resetTest,
  setSelectedText,
  inputRef,
  router
}) => (
  <div className="max-w-3xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Typing Performance Test</h1>
      <p className="text-lg text-gray-600">Measure your typing speed and accuracy</p>
    </div>

    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="w-full sm:w-auto">
          <label htmlFor="text-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Sample Text
          </label>
          <select
            id="text-select"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
            value={selectedText}
            onChange={(e) => setSelectedText(parseInt(e.target.value))}
            disabled={isTyping}
          >
            {sampleTexts.map((_, index) => (
              <option key={index} value={index}>
                Sample Text {index + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-1">Timer</label>
            <div className="text-2xl font-mono font-bold">
              {timer}s
            </div>
          </div>

          {!isTyping ? (
            <>
            <button
              onClick={startTest}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors"
            >
              Start Test
            </button>
            <button
            onClick={() => router.push('/dashboard')} 
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors"
          >
            Dashboard
          </button>
          </>
          ) : (
            <button
              onClick={endTest}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors"
            >
              End Test
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-gray-100 p-4 rounded-md min-h-32 mb-2">
          <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
            {renderTextWithHighlights()}
          </p>
        </div>
        <textarea
          ref={inputRef}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border h-32"
          value={input}
          onChange={handleInputChange}
          disabled={!isTyping}
          placeholder={isTyping ? "Start typing here..." : "Click 'Start Test' to begin"}
        />
      </div>
    </div>

    {results && (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-medium text-indigo-800 mb-2">Speed</h3>
            <div className="text-4xl font-bold text-indigo-600">{results.wpm} WPM</div>
            <p className="text-indigo-700 mt-1">
              {results.wpm > 60 ? "Excellent speed!" : 
               results.wpm > 40 ? "Good speed!" : 
               "Keep practicing to improve!"}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Accuracy</h3>
            <div className="text-4xl font-bold text-green-600">{results.accuracy}%</div>
            <p className="text-green-700 mt-1">
              {results.accuracy > 95 ? "Outstanding accuracy!" : 
               results.accuracy > 85 ? "Good accuracy!" : 
               "Focus on precision!"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Error Analysis</h3>
            <p className="text-gray-700 mb-2">Total errors: <span className="font-bold">{results.totalErrors}</span></p>
            {results.errorWords.length > 0 ? (
              <>
                <p className="text-gray-700 mb-1">Words with errors:</p>
                <div className="flex flex-wrap gap-2">
                  {results.errorWords.map((word, index) => (
                    <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      {word}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500">No words with errors!</p>
            )}
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Typing Pattern</h3>
            {results.typingDurations.length > 0 ? (
              <>
                <p className="text-gray-700 mb-2">Word typing durations (seconds):</p>
                <div className="h-20 overflow-x-auto">
                  <div className="flex gap-1 items-end h-full">
                    {results.typingDurations.map((duration, index) => (
                      <div 
                        key={index} 
                        className="bg-indigo-100 flex-1 flex items-end justify-center"
                        style={{ height: `${Math.min(duration * 20, 100)}%` }}
                        title={`Word ${index+1}: ${duration.toFixed(2)}s`}
                      >
                        <span className="text-xs text-indigo-800 hidden md:block">{duration.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No timing data available</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-gray-800 mb-2">Psychological Insights</h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800">
              {results.totalErrors > 10 ? 
                "You might be rushing too much. Try to focus on accuracy over speed." :
               results.typingDurations.length > 0 && 
               Math.max(...results.typingDurations) / Math.min(...results.typingDurations) > 2 ?
                "Your typing speed varies significantly. This might indicate hesitation with certain words or patterns." :
                "Your typing pattern shows good consistency. Keep up the good work!"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={resetTest}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md shadow-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )}
  </div>
)), { ssr: false });

export default function TypingTest() {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedText, setSelectedText] = useState(0);
  const [errorWords, setErrorWords] = useState([]);
  const [typingDurations, setTypingDurations] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setText(sampleTexts[selectedText]);
  }, [selectedText]);

  const saveResults = useCallback(async (data) => {
    if (!isClient) return;
    
    try {
      const response = await axiosInstance.post('api/sessions/sessions', {
        wpm: data.wpm,
        accuracy: data.accuracy,
        totalErrors: data.totalErrors,
        errorWords: data.errorWords,
        typingDurations: data.typingDurations
      });
      console.log(response, "@@@");
    } catch (error) {
      console.error('Error saving results:', error);
    }
  }, [isClient]);

  const calculateResults = useCallback((end) => {
    if (!startTime) return;
    
    const timeInMinutes = (end - startTime) / 60000;
    const words = text.split(' ').length;
    const typedWords = input.trim().split(/\s+/).length;
    const correctChars = [...text].filter((char, i) => char === input[i]).length;
    const accuracy = (correctChars / text.length) * 100;
    const wpm = Math.round(typedWords / timeInMinutes);

    const errors = [];
    const inputWords = input.split(' ');
    const textWords = text.split(' ');
    
    inputWords.forEach((word, i) => {
      if (textWords[i] && word !== textWords[i]) {
        errors.push(textWords[i]);
      }
    });

    const durations = [...typingDurations];
    if (durations.length === 0 && input.length > 0) {
      durations.push((end - startTime) / 1000);
    }

    setResults({
      wpm,
      accuracy: accuracy.toFixed(2),
      totalErrors: text.length - correctChars,
      errorWords: errors,
      typingDurations: durations
    });

    saveResults({
      wpm,
      accuracy: parseFloat(accuracy.toFixed(2)),
      totalErrors: text.length - correctChars,
      errorWords: errors,
      typingDurations: durations
    });
  }, [startTime, text, input, typingDurations, saveResults]);

  const endTest = useCallback(() => {
    if (!isClient) return;
    
    const end = Date.now();
    setEndTime(end);
    setIsTyping(false);
    setTimerActive(false);
    calculateResults(end);
  }, [isClient, calculateResults]);

  useEffect(() => {
    if (!isClient) return;
    
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && timerActive) {
      endTest();
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, isClient, endTest]);

  const startTest = useCallback(() => {
    setInput('');
    setStartTime(Date.now());
    setIsTyping(true);
    setTimerActive(true);
    setResults(null);
    setErrorWords([]);
    setTypingDurations([]);
    setTimer(15);
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef]);

  const resetTest = useCallback(() => {
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setIsTyping(false);
    setTimer(15);
    setTimerActive(false);
    setResults(null);
    setErrorWords([]);
    setTypingDurations([]);
  }, []);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInput(value);

    if (isClient && startTime && (value.endsWith(' ') || value.length === text.length) ){
      const timeElapsed = (Date.now() - startTime) / 1000;
      setTypingDurations(prev => [...prev, timeElapsed]);
    }

    if (value.length === text.length) {
      endTest();
    }
  }, [isClient, startTime, text, endTest]);

  const renderTextWithHighlights = useCallback(() => {
    if (!isClient) return text;
    
    return text.split('').map((char, index) => {
      let className = '';
      if (index < input.length) {
        className = char === input[index] ? 'text-green-500' : 'text-red-500 bg-red-100';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  }, [text, input, isClient]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Typing Performance Test</title>
        <meta name="description" content="Measure your typing speed and accuracy" />

      </Head>

      {isClient ? (
        <TypingTestUI
          text={text}
          input={input}
          selectedText={selectedText}
          isTyping={isTyping}
          timer={timer}
          results={results}
          handleInputChange={handleInputChange}
          renderTextWithHighlights={renderTextWithHighlights}
          startTest={startTest}
          endTest={endTest}
          resetTest={resetTest}
          setSelectedText={setSelectedText}
          inputRef={inputRef}
          router={router}
        />
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Typing Performance Test</h1>
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}