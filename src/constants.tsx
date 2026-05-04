import React from 'react';
import { 
  AlertTriangle, 
  CheckSquare, 
  FileText,
  Rocket,
  LucideIcon
} from 'lucide-react';
import { Category } from './types';

export const CATEGORY_CONFIG: Record<Category, { icon: LucideIcon, color: string, bgColor: string }> = {
  'Ujian': { icon: AlertTriangle, color: '#ef4444', bgColor: 'bg-red-50' },
  'Tugas': { icon: CheckSquare, color: '#2563eb', bgColor: 'bg-blue-50' },
  'Ulangan': { icon: FileText, color: '#f59e0b', bgColor: 'bg-amber-50' },
  'Project': { icon: Rocket, color: '#8b5cf6', bgColor: 'bg-purple-50' }
};
