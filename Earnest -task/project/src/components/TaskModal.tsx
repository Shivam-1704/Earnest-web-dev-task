import { useState, useEffect, FormEvent } from 'react';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';
import { pool, Task } from '../lib/db';
import { X } from 'lucide-react';

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string | null;
};

export default function TaskModal({ isOpen, onClose, taskId }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  useEffect(() => {
    if (isOpen && taskId) {
      setLoading(true);
      mysql
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single()
        .then(({ data }) => {
          if (data) {
            const task = data as Task;
            setTitle(task.title);
            setDescription(task.description || '');
          }
          setLoading(false);
        });
    } else if (isOpen) {
      setTitle('');
      setDescription('');
    }
  }, [isOpen, taskId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (taskId) {
      await updateTask.mutateAsync({
        id: taskId,
        updates: { title, description },
      });
    } else {
      await createTask.mutateAsync({ title, description });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {taskId ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter task description (optional)"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTask.isPending || updateTask.isPending}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createTask.isPending || updateTask.isPending
                  ? 'Saving...'
                  : taskId
                  ? 'Update'
                  : 'Create'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
