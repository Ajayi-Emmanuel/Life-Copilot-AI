
import React from 'react';
import { Recommendation } from '../types';
import LoadingSpinner from './LoadingSpinner';
import SparklesIcon from './icons/SparklesIcon';

interface RecommendationsProps {
  recommendations: Recommendation[] | null;
  isLoading: boolean;
  error: string | null;
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
          <LoadingSpinner />
          <p className="mt-2">AI is analyzing your schedule...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-accent-danger bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="font-semibold">Error</p>
          <p className="text-center text-sm">{error}</p>
        </div>
      );
    }
    
    if (!recommendations || recommendations.length === 0) {
       return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center p-4">
            <SparklesIcon className="w-12 h-12 text-slate-400 mb-2"/>
            <p>Your AI recommendations will appear here.</p>
            <p className="text-sm">Add or update tasks to get a new analysis.</p>
        </div>
       );
    }

    return (
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-brand-light/50 dark:bg-slate-700/50 p-4 rounded-lg border border-brand-secondary/20">
            <h4 className="font-bold text-brand-primary dark:text-blue-300 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-brand-secondary"/>
              {rec.title}
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{rec.text}</p>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg">
       <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light mb-4">AI Copilot Suggestions</h3>
       <div className="min-h-[24rem]">
        {renderContent()}
       </div>
    </div>
  );
};

export default Recommendations;
