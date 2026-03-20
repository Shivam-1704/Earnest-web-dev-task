import { Task } from '../lib/db';
import { CheckCircle2, Circle, CreditCard as Edit2, Trash2, Calendar } from 'lucide-react';

type TaskCardProps = {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-200">
      <div className="flex items-start gap-3 mb-3">
        <button
          onClick={onToggle}
          className="mt-1 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-2 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mb-3 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(task.created_at).toLocaleDateString()}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isCompleted
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {task.status}
        </span>
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
