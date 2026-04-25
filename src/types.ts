export type Category = 'Matematika' | 'Bahasa' | 'Sains' | 'Sejarah' | 'Seni' | 'Ujian' | 'Tugas' | 'Lainnya';

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
