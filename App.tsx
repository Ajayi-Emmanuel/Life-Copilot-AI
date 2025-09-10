
import React, { useState, useEffect, useCallback } from 'react';
import { Task, AiAnalysis } from './types';
import { getAIAnalysis } from './services/geminiService';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import StressChart from './components/StressChart';
import Recommendations from './components/Recommendations';
import SparklesIcon from './components/icons/SparklesIcon';

// Function to generate initial dates
const getInitialDate = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
};

const INITIAL_TASKS: Task[] = [
    { id: '1', text: 'Prepare presentation for Monday meeting', dueDate: getInitialDate(2), completed: false },
    { id: '2', text: 'Submit quarterly report', dueDate: getInitialDate(4), completed: false },
    { id: '3', text: 'Team brainstorming session', dueDate: getInitialDate(4), completed: true },
    { id: '4', text: 'Review project mockups', dueDate: getInitialDate(6), completed: false },
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const analyzeSchedule = useCallback(async (currentTasks: Task[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const analysis = await getAIAnalysis(currentTasks);
      setAiAnalysis(analysis);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      // Provide default empty state on error to prevent chart crash
      setAiAnalysis({ stressForecast: [], recommendations: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    analyzeSchedule(tasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]); // Rerunning analysis on task changes

  const handleAddTask = (text: string, dueDate: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      dueDate,
      completed: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };
  
  const handleRefreshAnalysis = () => {
    analyzeSchedule(tasks);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-brand-dark text-slate-900 dark:text-slate-100 font-sans">
      <header className="bg-white dark:bg-slate-900/70 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-primary dark:text-white">
            Life Copilot AI
          </h1>
          <button 
             onClick={handleRefreshAnalysis}
             disabled={isLoading}
             className="bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
            <SparklesIcon className={`w-5 h-5 sm:mr-2 ${isLoading ? 'animate-pulse' : ''}`}/>
            <span className="hidden sm:inline">{isLoading ? 'Analyzing...' : 'Refresh Analysis'}</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-8">
            <section>
              <AddTaskForm onAddTask={handleAddTask} />
              <TaskList
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <StressChart data={aiAnalysis?.stressForecast ?? []} />
            </section>
            <section>
              <Recommendations 
                recommendations={aiAnalysis?.recommendations ?? null}
                isLoading={isLoading}
                error={error}
              />
            </section>
          </div>
        </div>
      </main>
      
      <footer className="text-center py-4 mt-8 text-slate-500 text-sm">
        <p>Powered by Gemini. Built for modern productivity.</p>
      </footer>
    </div>
  );
};

export default App;
