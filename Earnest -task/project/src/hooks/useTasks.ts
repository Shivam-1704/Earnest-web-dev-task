import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mysql, Task } from '../lib/db';
import { toast } from 'react-toastify';

type TasksFilters = {
  status?: 'pending' | 'completed' | 'all';
  search?: string;
  page?: number;
  limit?: number;
};

export function useTasks(filters: TasksFilters = {}) {
  const { status = 'all', search = '', page = 1, limit = 10 } = filters;

  return useQuery({
    queryKey: ['tasks', status, search, page, limit],
    queryFn: async () => {
      let query = mysql
        .from('tasks')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        tasks: data as Task[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      };
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: { title: string; description?: string }) => {
      const { data: { user } } = await mysql.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await mysql
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description || '',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const { data, error } = await mysql
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await mysql
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      const { data, error } = await mysql
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task status updated!');
    },
    onError: () => {
      toast.error('Failed to toggle task status');
    },
  });
}
