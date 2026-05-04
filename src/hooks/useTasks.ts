import { useState, useEffect } from 'react';
import { Task, Category } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tugasku_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories] = useState<Category[]>([
    'Ujian',
    'Tugas',
    'Ulangan',
    'Project',
  ]);

  useEffect(() => {
    localStorage.setItem('tugasku_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    
    // Simple mock notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Tugas Baru Ditambahkan', {
        body: `Ingat: ${newTask.title}`,
      });
    }
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  return {
    tasks,
    categories,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
  };
}
