
import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';

interface AddTaskFormProps {
  onAddTask: (text: string, dueDate: string) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && dueDate) {
      onAddTask(text.trim(), dueDate);
      setText('');
      setDueDate('');
    }
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g., Finish project proposal"
        className="flex-grow bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-slate-800 dark:text-slate-200"
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-slate-800 dark:text-slate-200"
        required
        min={today}
      />
      <button
        type="submit"
        className="bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
      >
        <PlusIcon className="w-5 h-5 sm:mr-2" />
        <span className="hidden sm:inline">Add Task</span>
      </button>
    </form>
  );
};

export default AddTaskForm;
