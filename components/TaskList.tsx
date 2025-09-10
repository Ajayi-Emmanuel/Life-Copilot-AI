
import React from 'react';
import { Task } from '../types';
import TrashIcon from './icons/TrashIcon';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskItem: React.FC<{ task: Task; onToggleTask: (id: string) => void; onDeleteTask: (id: string) => void; }> = ({ task, onToggleTask, onDeleteTask }) => {
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date(new Date().toDateString());
  
  return (
     <li className="flex items-center bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm transition-all hover:shadow-md">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleTask(task.id)}
        className="h-5 w-5 rounded border-slate-300 text-brand-secondary focus:ring-brand-secondary"
      />
      <div className="ml-3 flex-grow">
        <span className={`text-slate-800 dark:text-slate-200 ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
          {task.text}
        </span>
        <div className={`text-sm ${isOverdue ? 'text-accent-danger font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
          Due: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {isOverdue && " (Overdue)"}
        </div>
      </div>
      <button
        onClick={() => onDeleteTask(task.id)}
        className="ml-2 text-slate-400 hover:text-accent-danger transition-colors p-2 rounded-full"
        aria-label="Delete task"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </li>
  );
};


const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="bg-slate-100 dark:bg-slate-900/50 p-4 sm:p-6 rounded-2xl shadow-lg">
       <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light mb-4">Your Tasks</h3>
       {tasks.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">No tasks yet. Add one to get started!</p>
       ) : (
        <ul className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} />
          ))}
        </ul>
       )}
    </div>
  );
};

export default TaskList;
