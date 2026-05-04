export type Category = 'Ujian' | 'Tugas' | 'Ulangan' | 'Project';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  category: Category;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  shareCode?: string;
  collaborators?: string[];
}

export type ViewMode = 'calendar' | 'list';
